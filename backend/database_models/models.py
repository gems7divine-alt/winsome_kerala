"""ORM models for the booking flow.

Covers the form in the UI:
  1. Full Name  2. Mobile Number  3. Email Address
  4. Select Service (label like "Facial - 60 mins (Rs.400 onwards)")
  5. Select Date  6. Select Time (single-slot service)
"""

from sqlalchemy import (
    CheckConstraint,
    Column,
    Date,
    DateTime,
    Index,
    Integer,
    String,
    Time,
    UniqueConstraint,
    func,
)

from database.connection import Base


class BookEmployeeTable(Base):
    """One row per customer booking. Table: ``book_employeetable``."""

    __tablename__ = "book_employeetable"

    __table_args__ = (
        # One service run blocks exactly one slot: no double-booking same date+time.
        UniqueConstraint("booking_date", "booking_time", name="uq_book_employeetable_slot"),
        CheckConstraint(
            "length(mobile_number) >= 10",
            name="ck_book_employeetable_mobile_len",
        ),
        CheckConstraint(
            "status IN ('pending', 'confirmed', 'cancelled', 'completed')",
            name="ck_book_employeetable_status",
        ),
        Index("ix_book_employeetable_mobile", "mobile_number"),
        Index("ix_book_employeetable_email", "email_address"),
        Index("ix_book_employeetable_date", "booking_date"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)

    full_name = Column(String(100), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    email_address = Column(String(255), nullable=False)

    service_name = Column(String(200), nullable=False)
    duration_mins = Column(Integer, nullable=False, server_default="60")
    slots_blocked = Column(Integer, nullable=False, server_default="1")

    booking_date = Column(Date, nullable=False)
    booking_time = Column(Time, nullable=False)

    status = Column(String(20), nullable=False, server_default="confirmed")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return (
            f"<BookEmployeeTable id={self.id} name={self.full_name!r} "
            f"date={self.booking_date} time={self.booking_time} "
            f"service={self.service_name!r} status={self.status}>"
        )
