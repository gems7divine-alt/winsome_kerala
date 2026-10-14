"""FastAPI entrypoint — booking appointments API.

Frontend: ``frontend/src/pages/BookingAppointment/BookingAppointment.jsx``
  collects 1. Full Name  2. Mobile  3. Email  4. Service  5. Date  6. Time
  and POSTs it here as JSON. This module validates (pydantic schemas),
  persists (SQLAlchemy model ``book_employeetable``), and returns the row.

Run (from ``backend/``)::

    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

from datetime import date

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database.connection import Base, SessionLocal, engine
from database_models.models import BookEmployeeTable
from databaseschema.schema import (
    BookEmployeeCreate,
    BookEmployeeResponse,
    BookEmployeeUpdate,
)
import os


class AdminLogin(BaseModel):
    username: str
    password: str

app = FastAPI(
    title="Winsome Kerala — Booking API",
    version="1.0.0",
    description="Collects BookingAppointment form data and stores it in book_employeetable.",
)

# Vite dev server (default http://localhost:5173) + common alternatives.
# "*" keeps local file:// / LAN testing working without extra config.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Yield a request-scoped SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def _create_tables() -> None:
    # No-op when Postgres is unreachable (e.g. importing for tests);
    # the request will then surface a clear 500 instead of crashing boot.
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:  # pragma: no cover - boot-time safety
        print(f"[warn] create_all skipped (DB unreachable?): {exc}")


@app.get("/", tags=["meta"])
def root():
    return {"message": "Winsome Kerala Booking API", "docs": "/docs", "health": "/health"}


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


@app.post("/api/admin/login", tags=["admin"], summary="Fixed admin login")
def admin_login(creds: AdminLogin):
    """Check fixed admin credentials (defaults: vimal / 123456).

    Override with env vars ADMIN_USERNAME / ADMIN_PASSWORD in production.
    NOTE: demo-only — use proper hashed auth for real deployments.
    """
    expected_user = os.getenv("ADMIN_USERNAME", "vimal")
    expected_pass = os.getenv("ADMIN_PASSWORD", "123456")
    if creds.username == expected_user and creds.password == expected_pass:
        return {"ok": True, "username": expected_user}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password.")


@app.post(
    "/api/bookings",
    response_model=BookEmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["bookings"],
    summary="Store one BookingAppointment form submission",
)
def create_booking(payload: BookEmployeeCreate, db: Session = Depends(get_db)):
    """Collect frontend form data and insert one row into ``book_employeetable``."""
    row = BookEmployeeTable(
        full_name=payload.full_name,
        mobile_number=payload.mobile_number,
        email_address=payload.email_address,
        service_name=payload.service_name,
        duration_mins=payload.duration_mins,
        slots_blocked=payload.slots_blocked,
        booking_date=payload.booking_date,
        booking_time=payload.booking_time,
        status=payload.status,
    )
    db.add(row)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        # UniqueConstraint(booking_date, booking_time) -> slot taken.
        # Postgres: 'uq_book_employeetable_slot'; SQLite: 'UNIQUE constraint failed'.
        msg = str(getattr(exc, "orig", exc)).lower()
        if "uq_book_employeetable_slot" in msg or "unique" in msg or "duplicate" in msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slot already booked for {payload.booking_date} at {payload.booking_time}.",
            ) from exc
        raise HTTPException(status_code=400, detail="Could not save booking (integrity error).") from exc
    db.refresh(row)
    return row


@app.get(
    "/api/bookings/occupied",
    tags=["bookings"],
    summary="Times already taken on a date (to disable slots in the UI)",
)
def occupied_times(
    date: date = Query(..., description="ISO date YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    """Return booked ``HH:MM`` strings for ``date`` (excludes cancelled)."""
    rows = (
        db.query(BookEmployeeTable.booking_time)
        .filter(
            BookEmployeeTable.booking_date == date,
            BookEmployeeTable.status != "cancelled",
        )
        .all()
    )
    times = sorted({t[0].strftime("%H:%M") for t in rows if t[0] is not None})
    return {"date": date.isoformat(), "occupied_times": times}


@app.get("/api/bookings", response_model=list[BookEmployeeResponse], tags=["bookings"])
def list_bookings(
    booking_date: date | None = Query(default=None, description="Filter by ISO date YYYY-MM-DD"),
    status_filter: str | None = Query(default=None, alias="status"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    q = db.query(BookEmployeeTable).order_by(
        BookEmployeeTable.booking_date.desc(),
        BookEmployeeTable.booking_time.desc(),
    )
    if booking_date is not None:
        q = q.filter(BookEmployeeTable.booking_date == booking_date)
    if status_filter is not None:
        q = q.filter(BookEmployeeTable.status == status_filter)
    return q.offset(skip).limit(limit).all()


@app.get("/api/bookings/{booking_id}", response_model=BookEmployeeResponse, tags=["bookings"])
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    row = db.get(BookEmployeeTable, booking_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return row


@app.patch("/api/bookings/{booking_id}", response_model=BookEmployeeResponse, tags=["bookings"])
def update_booking(booking_id: int, patch: BookEmployeeUpdate, db: Session = Depends(get_db)):
    row = db.get(BookEmployeeTable, booking_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Booking not found.")
    for field, value in patch.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Update conflicts with an existing booking slot.") from exc
    db.refresh(row)
    return row


@app.delete("/api/bookings/{booking_id}", tags=["bookings"])
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    row = db.get(BookEmployeeTable, booking_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Booking not found.")
    db.delete(row)
    db.commit()
    return {"deleted": booking_id}
