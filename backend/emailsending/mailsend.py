

from __future__ import annotations

import html
import logging
import os
import smtplib
from datetime import date, time
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

log = logging.getLogger(__name__)

BRAND_NAME = "Winsome Kerala"
LOGO_PATH = Path(__file__).with_name("logo.png")
_LOGO_CID = "winsome-logo"


def _smtp_settings() -> tuple[str, int, str, str] | None:
    """Return (host, port, username, password), or None when not configured."""
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    try:
        port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError:
        port = 587
    username = os.getenv("SMTP_EMAIL", "")
    password = os.getenv("SMTP_PASSWORD", "")
    if not username or not password:
        log.warning("SMTP not configured (SMTP_EMAIL/SMTP_PASSWORD missing) — skipping confirmation email.")
        return None
    return host, port, username, password


def _format_date(value: date | str) -> str:
    if isinstance(value, date):
        return value.strftime("%a, %d %b %Y")
    return str(value)


def _format_time(value: time | str) -> str:
    if isinstance(value, time):
        return value.strftime("%I:%M %p").lstrip("0")
    return str(value)


def build_confirmation_message(
    *,
    to_email: str,
    full_name: str,
    service_name: str,
    booking_date: date | str,
    booking_time: time | str,
    sender_email: str,
) -> EmailMessage:
    """Build the multipart (plain + HTML) confirmation message."""
    name = html.escape(full_name)
    service = html.escape(service_name)
    date_label = html.escape(_format_date(booking_date))
    time_label = html.escape(_format_time(booking_time))

    plain = (
        f"{BRAND_NAME} — Booking Confirmed!\n\n"
        f"Hi {full_name},\n\n"
        f"Your appointment is confirmed:\n"
        f"  Service: {service_name}\n"
        f"  Date:    {_format_date(booking_date)}\n"
        f"  Time:    {_format_time(booking_time)}\n\n"
        "Please arrive 10 minutes early. "
        "To reschedule, just reply to this email.\n\n"
        f"Thank you for choosing {BRAND_NAME}!"
    )

    body_html = f"""\
<div style="margin:0;padding:0;background-color:#f6f4f7;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;color:#222;">
    <div style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="text-align:center;padding:28px 24px 8px;background-color:#ffffff;">
        <img src="cid:{_LOGO_CID}" alt="{BRAND_NAME}" style="max-width:220px;height:auto;display:inline-block;">
      </div>
      <div style="padding:8px 32px 32px;text-align:center;">
        <h2 style="margin:12px 0 4px;font-size:22px;color:#111;">Booking Confirmed!</h2>
        <p style="margin:0 0 20px;font-size:14px;color:#555;">Hi {name}, your appointment is booked.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 auto 20px;text-align:left;font-size:14px;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 12px;color:#777;border-bottom:1px solid #eee;">Service</td>
            <td style="padding:10px 12px;font-weight:bold;color:#111;border-bottom:1px solid #eee;">{service}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;color:#777;border-bottom:1px solid #eee;">Date</td>
            <td style="padding:10px 12px;font-weight:bold;color:#111;border-bottom:1px solid #eee;">{date_label}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;color:#777;">Time</td>
            <td style="padding:10px 12px;font-weight:bold;color:#111;">{time_label}</td>
          </tr>
        </table>
        <p style="font-size:13px;color:#555;">Please arrive 10 minutes early.<br>To reschedule, just reply to this email.</p>
      </div>
      <div style="padding:16px;text-align:center;font-size:12px;color:#999;background-color:#faf8fb;">
        Thank you for choosing {BRAND_NAME}!
      </div>
    </div>
  </div>
</div>"""

    msg = EmailMessage()
    msg["Subject"] = f"{BRAND_NAME} — Booking Confirmed for {date_label} at {time_label}"
    msg["From"] = formataddr((BRAND_NAME, sender_email))
    msg["To"] = to_email
    msg.set_content(plain)
    msg.add_alternative(body_html, subtype="html")

    if LOGO_PATH.exists():
        with open(LOGO_PATH, "rb") as f:
            logo_data = f.read()
        msg.get_payload()[1].add_related(
            logo_data, maintype="image", subtype="png", cid=_LOGO_CID
        )
    else:
        log.warning("Logo not found at %s — sending confirmation without image.", LOGO_PATH)
    return msg


def send_booking_confirmation(
    *,
    to_email: str,
    full_name: str,
    service_name: str,
    booking_date: date | str,
    booking_time: time | str,
) -> bool:
    """Send the confirmation email. Returns True on success, False otherwise.

    Never raises — booking must not fail just because email delivery did.
    """
    settings = _smtp_settings()
    if settings is None:
        return False
    host, port, username, password = settings
    msg = build_confirmation_message(
        to_email=to_email,
        full_name=full_name,
        service_name=service_name,
        booking_date=booking_date,
        booking_time=booking_time,
        sender_email=username,
    )
    try:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(username, password)
            smtp.send_message(msg)
    except Exception:
        log.exception("Failed to send booking confirmation to %s", to_email)
        return False
    return True
