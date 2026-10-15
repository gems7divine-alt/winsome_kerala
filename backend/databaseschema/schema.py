from __future__ import annotations

import re
from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator

Status = Literal["pending", "confirmed", "cancelled", "completed"]

# Slots shown in the UI grid: 9:30 AM .. 6:30 PM, all on the half hour.
ALLOWED_SLOT_HOURS = frozenset({9, 10, 11, 12, 13, 14, 15, 16, 17, 18})

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _parse_date(value: date | str) -> date:
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    text = str(value).strip()
    for fmt in (
        "%a %b %d %Y",  # dateKey: "Mon Oct 12 2026" (Date.toDateString)
        "%a, %d %b %Y",  # label: "Mon, 12 Oct 2026"
        "%Y-%m-%d",  # ISO
        "%d-%m-%Y",
        "%d/%m/%Y",
    ):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unrecognised date format: {value!r}")


def _parse_time(value: time | str) -> time:
    if isinstance(value, time):
        return value.replace(second=0, microsecond=0)
    text = str(value).strip().upper().replace(".", "")
    for fmt in ("%I:%M %p", "%I %p", "%H:%M", "%H%M"):
        try:
            return datetime.strptime(text, fmt).time().replace(second=0, microsecond=0)
        except ValueError:
            continue
    raise ValueError(f"Unrecognised time format: {value!r}. Example: '9:30 AM'")


class BookEmployeeBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore", str_strip_whitespace=True)

    full_name: str
    mobile_number: str
    email_address: str
    service_name: str
    duration_mins: int = 60
    slots_blocked: int = 1
    booking_date: date
    booking_time: time
    status: Status = "confirmed"

    @field_validator("full_name", mode="before")
    @classmethod
    def _name(cls, v):
        v = str(v or "").strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(v) > 100:
            raise ValueError("Full name must be at most 100 characters")
        return v

    @field_validator("mobile_number", mode="before")
    @classmethod
    def _mobile(cls, v):
        # Accept exactly 10 digits (optional +91 / 91 / 0 prefix is stripped).
        digits = re.sub(r"\D", "", str(v or ""))
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        elif len(digits) == 11 and digits.startswith("0"):
            digits = digits[1:]
        if not re.fullmatch(r"[6-9]\d{9}", digits or ""):
            raise ValueError("Please enter a valid 10-digit mobile number")
        return digits

    @field_validator("email_address", mode="before")
    @classmethod
    def _email(cls, v):
        v = str(v or "").strip().lower()
        if not _EMAIL_RE.match(v) or len(v) > 255:
            raise ValueError("Invalid email address")
        return v

    @field_validator("service_name", mode="before")
    @classmethod
    def _service(cls, v):
        v = str(v or "").strip()
        if not v:
            raise ValueError("Service must be selected")
        if len(v) > 200:
            raise ValueError("Service name must be at most 200 characters")
        return v

    @field_validator("duration_mins", "slots_blocked", mode="before")
    @classmethod
    def _positive_int(cls, v):
        v = int(v)
        if v < 1:
            raise ValueError("Must be a positive integer")
        return v

    @field_validator("booking_date", mode="before")
    @classmethod
    def _booking_date(cls, v):
        parsed = _parse_date(v)
        if parsed < date.today():
            raise ValueError("Booking date cannot be in the past")
        return parsed

    @field_validator("booking_time", mode="before")
    @classmethod
    def _booking_time(cls, v):
        parsed = _parse_time(v)
        if parsed.minute != 30 or parsed.hour not in ALLOWED_SLOT_HOURS:
            raise ValueError("Booking time must be a valid slot (9:30 AM - 6:30 PM, half-hour)")
        return parsed


class BookEmployeeCreate(BookEmployeeBase):
    """POST body for a new booking."""

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore",
        str_strip_whitespace=True,
        json_schema_extra={
            "example": {
                "full_name": "Anu Sharma",
                "mobile_number": "9876543210",
                "email_address": "anu@example.com",
                "service_name": "Facial - 60 mins (Rs.400 onwards)",
                "duration_mins": 60,
                "slots_blocked": 1,
                "booking_date": "2026-10-12",
                "booking_time": "9:30 AM",
            }
        },
    )


class BookEmployeeUpdate(BaseModel):
    """PATCH body — every field optional."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore", str_strip_whitespace=True)

    full_name: str | None = None
    mobile_number: str | None = None
    email_address: str | None = None
    service_name: str | None = None
    duration_mins: int | None = None
    slots_blocked: int | None = None
    booking_date: date | None = None
    booking_time: time | None = None
    status: Status | None = None

    @field_validator("full_name", mode="before")
    @classmethod
    def _name(cls, v):
        return BookEmployeeBase._name(v) if v is not None else v

    @field_validator("mobile_number", mode="before")
    @classmethod
    def _mobile(cls, v):
        return BookEmployeeBase._mobile(v) if v is not None else v

    @field_validator("email_address", mode="before")
    @classmethod
    def _email(cls, v):
        return BookEmployeeBase._email(v) if v is not None else v

    @field_validator("service_name", mode="before")
    @classmethod
    def _service(cls, v):
        return BookEmployeeBase._service(v) if v is not None else v

    @field_validator("duration_mins", "slots_blocked", mode="before")
    @classmethod
    def _positive_int(cls, v):
        return BookEmployeeBase._positive_int(v) if v is not None else v

    @field_validator("booking_date", mode="before")
    @classmethod
    def _booking_date(cls, v):
        return BookEmployeeBase._booking_date(v) if v is not None else v

    @field_validator("booking_time", mode="before")
    @classmethod
    def _booking_time(cls, v):
        return BookEmployeeBase._booking_time(v) if v is not None else v


class BookEmployeeResponse(BaseModel):  
    id: int
    full_name: str
    mobile_number: str
    email_address: str
    service_name: str
    duration_mins: int
    slots_blocked: int
    booking_date: date
    booking_time: time
    status: str
    created_at: datetime
    updated_at: datetime


    model_config = ConfigDict(from_attributes=True)
