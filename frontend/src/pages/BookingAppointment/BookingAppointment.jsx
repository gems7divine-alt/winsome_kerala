import { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowRightIcon } from '../../components/ui/Icon';
import { services } from '../../data/servicesContent';

const timeSlots = ['9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM', '4:30 PM', '5:30 PM', '6:30 PM'];
const SLOT_MINS = 60;
const STORAGE_KEY = 'winsome_bookings_v1';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function toIsoDate(dateKey) {
  const d = new Date(dateKey);
  if (Number.isNaN(d.getTime())) return null;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function hhMmToSlotLabel(hhmm) {
  const [hStr, mStr] = String(hhmm).split(':');
  const h = Number(hStr);
  const m = mStr ?? '30';
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.padStart(2, '0')} ${ampm}`;
}

function getMobileError(value) {
  const digits = String(value || '').replace(/\D/g, '');
  let normalized = digits;
  if (normalized.length === 12 && normalized.startsWith('91')) {
    normalized = normalized.slice(2);
  } else if (normalized.length === 11 && normalized.startsWith('0')) {
    normalized = normalized.slice(1);
  }
  if (!normalized) return '';
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return 'Please enter a valid 10-digit mobile number.';
  }
  return '';
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDateSlots() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return {
      key: date.toDateString(),
      day: dayNames[date.getDay()],
      date: String(date.getDate()),
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
    };
  });
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Field({ number, label, placeholder, icon, type = 'text', value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex min-h-7 items-center gap-2 text-sm font-bold text-black">
        {icon && <span className="shrink-0">{icon}</span>}
        {number}. {label}
      </span>
      <input
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-black shadow-[0_6px_18px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-black/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4 4.8 6.2c-.6.6-.8 1.5-.5 2.3 1.8 5.1 6.1 9.4 11.2 11.2.8.3 1.7.1 2.3-.5L20 17l-4.2-4.2-2 2c-1.9-1-3.6-2.7-4.6-4.6l2-2L7 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppointmentForm() {
  const [dateSlots] = useState(getDateSlots);
  const [selectedDate, setSelectedDate] = useState(dateSlots[0]?.key);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [bookings, setBookings] = useState(loadBookings);
  const [serverOccupiedLabels, setServerOccupiedLabels] = useState([]);
  const [serverError, setServerError] = useState('');
  const [mobileTouched, setMobileTouched] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const refreshTimer = useRef(null);

  // Clear the delayed form-reset if the user leaves the page first.
  useEffect(() => () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, []);

  const mobileError = getMobileError(mobile);
  const showMobileError = mobileTouched && mobileError;

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || services[0],
    [selectedServiceId],
  );

  const slotsNeeded = useMemo(() => {
    const mins = selectedService?.durationMins || 60;
    return Math.max(1, Math.ceil(mins / SLOT_MINS));
  }, [selectedService]);

  // Occupied slot indexes for the selected date:
  // 1) local bookings (this device) + 2) server bookings (database)
  const occupiedIndexes = useMemo(() => {
    const set = new Set();
    bookings
      .filter((b) => b.dateKey === selectedDate)
      .forEach((b) => {
        for (let i = b.startIndex; i < b.startIndex + b.slotsNeeded; i += 1) {
          set.add(i);
        }
      });
    serverOccupiedLabels.forEach((label) => {
      const idx = timeSlots.indexOf(label);
      if (idx !== -1) set.add(idx);
    });
    return set;
  }, [bookings, selectedDate, serverOccupiedLabels]);

  // Fetch already-booked slots for the selected date from the FastAPI backend.
  useEffect(() => {
    const iso = toIsoDate(selectedDate);
    if (!iso) {
      setServerOccupiedLabels([]);
      return;
    }
    let cancelled = false;
    fetch(`${API_BASE}/api/bookings/occupied?date=${iso}`)
      .then((res) => (res.ok ? res.json() : { occupied_times: [] }))
      .then((data) => {
        if (cancelled) return;
        const labels = (data.occupied_times || []).map(hhMmToSlotLabel);
        setServerOccupiedLabels(labels);
      })
      .catch(() => {
        if (!cancelled) setServerOccupiedLabels([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  // Auto-hide the top success notification after 6 seconds.
  useEffect(() => {
    if (status !== 'success' || !toastVisible) return undefined;
    const timer = setTimeout(() => setToastVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [status, toastVisible]);

  const isStartBookable = (startIndex) => {
    // Must fit before closing
    if (startIndex + slotsNeeded > timeSlots.length) return false;
    // Must not overlap an already blocked slot
    for (let i = startIndex; i < startIndex + slotsNeeded; i += 1) {
      if (occupiedIndexes.has(i)) return false;
    }
    return true;
  };

  // Keep selected time valid when service/date changes
  useEffect(() => {
    const currentIndex = timeSlots.indexOf(selectedTime);
    if (currentIndex === -1 || !isStartBookable(currentIndex)) {
      const firstAvailable = timeSlots.findIndex((_, idx) => isStartBookable(idx));
      if (firstAvailable !== -1) {
        setSelectedTime(timeSlots[firstAvailable]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId, selectedDate, bookings, serverOccupiedLabels]);

  const selectedStartIndex = timeSlots.indexOf(selectedTime);
  const blockedSlots = selectedStartIndex !== -1
    ? timeSlots.slice(selectedStartIndex, selectedStartIndex + slotsNeeded)
    : [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mobile must be exactly 10 digits — show message under the field + below Book.
    if (getMobileError(mobile)) {
      setMobileTouched(true);
      setServerError('Please enter a valid 10-digit mobile number.');
      setStatus('error');
      return;
    }

    if (selectedStartIndex === -1 || !isStartBookable(selectedStartIndex)) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    setServerError('');
    setToastVisible(false);

    const slot = dateSlots.find((item) => item.key === selectedDate);
    const dateLabel = slot ? `${slot.day}, ${slot.date} ${slot.month} ${slot.year}` : selectedDate;
    const serviceLabel = `${selectedService?.title || 'Service'} - ${selectedService?.durationLabel || `${selectedService?.durationMins || 60} mins`}${selectedService?.price ? ` (${selectedService.price})` : ''}`;

    const bookingPayload = {
      full_name: name.trim(),
      mobile_number: mobile.trim(),
      email_address: email.trim(),
      service_name: serviceLabel,
      duration_mins: selectedService?.durationMins || 60,
      slots_blocked: slotsNeeded,
      booking_date: selectedDate,
      booking_time: selectedTime,
      status: 'confirmed',
    };

    const templateParams = {
      from_name: name,
      user_name: name,
      user_mobile: mobile,
      user_email: email,
      email: email,
      reply_to: email,
      selected_service: selectedService?.title || '',
      service_duration: selectedService?.durationLabel || `${selectedService?.durationMins || 60} mins`,
      selected_date: dateLabel,
      appointment_date: dateLabel,
      selected_time: selectedTime,
      appointment_time: selectedTime,
      blocked_slots: blockedSlots.join(', '),
    };

    try {
      // 1) Store in Postgres via FastAPI backend (backend/main.py POST /api/bookings)
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      if (!res.ok) {
        let detail = 'Could not save booking. Please try again.';
        try {
          const errBody = await res.json();
          const raw = errBody.detail ?? errBody;
          if (Array.isArray(raw)) {
            // FastAPI 422 validation errors: [{loc: [...], msg: '...'}]
            detail = raw
              .map((d) => {
                const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : '';
                return field ? `${field}: ${d.msg}` : d.msg;
              })
              .join('. ');
          } else if (typeof raw === 'string') {
            detail = raw;
          } else {
            detail = JSON.stringify(raw);
          }
        } catch {
          // keep default message
        }
        if (res.status === 409) {
          detail = 'That slot was just booked. Please pick another time.';
        }
        setServerError(detail);
        throw new Error(detail);
      }
      const savedBooking = await res.json();

      // 2) Send confirmation email (best-effort: booking is already saved,
      // so an email failure must not hide the success message).
      try {
        await emailjs.send('service_69m1iu2', 'template_eimdblu', templateParams, {
          publicKey: 'vk29Tc09XLpHOYXEz',
        });
      } catch (emailError) {
        console.warn('Booking saved, but confirmation email failed:', emailError);
      }

      // Persist booking locally so following slots stay blocked on this device
      const newBooking = {
        dateKey: selectedDate,
        startIndex: selectedStartIndex,
        slotsNeeded,
        serviceId: selectedService?.id,
        serviceTitle: selectedService?.title,
        createdAt: new Date().toISOString(),
      };
      const updated = [...loadBookings(), newBooking];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage full / unavailable — still show success
      }
      setBookings(updated);
      // Mark the saved slot as occupied immediately (DB is now source of truth).
      if (savedBooking?.booking_time) {
        const label = hhMmToSlotLabel(String(savedBooking.booking_time).slice(0, 5));
        setServerOccupiedLabels((prev) => (prev.includes(label) ? prev : [...prev, label]));
      } else {
        setServerOccupiedLabels((prev) => (prev.includes(selectedTime) ? prev : [...prev, selectedTime]));
      }
      setLastBooking({
        service: selectedService?.title || 'Appointment',
        dateLabel,
        time: selectedTime,
      });
      setToastVisible(true);
      setStatus('success');
      // Booking confirmed — reset the form on this same book page so it's
      // fresh for the next booking (stays here instead of going home).
      // Delayed so the success notification stays visible first.
      refreshTimer.current = setTimeout(() => {
        setName('');
        setMobile('');
        setEmail('');
        setMobileTouched(false);
        setServerError('');
        setSelectedServiceId(services[0]?.id || '');
        setSelectedDate(dateSlots[0]?.key);
        setSelectedTime(timeSlots[0]);
        setToastVisible(false);
        setLastBooking(null);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form
      className="w-full rounded-3xl bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] sm:p-8"
      onSubmit={handleSubmit}
    >
      {status === 'success' && toastVisible && lastBooking && (
        <div
          role="alert"
          className="fixed top-20 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[520px] -translate-x-1/2 rounded-2xl bg-green-600 px-4 py-3 text-white shadow-[0_16px_40px_rgba(22,163,74,0.35)]"
        >
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
              <path d="m8 12.5 2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold">Booking Successfully Completed!</p>
              <p className="mt-0.5 text-xs font-medium text-white/90">
                {lastBooking.service} on {lastBooking.dateLabel} at {lastBooking.time}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              aria-label="Dismiss notification"
              className="rounded-lg px-2 py-0.5 text-lg leading-none font-bold text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field number="1" label="Full Name" placeholder="Enter your full name" icon={<UserIcon />} value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="block">
            <span className="mb-1.5 flex min-h-7 items-center gap-2 text-sm font-bold text-black">
              <span className="shrink-0"><PhoneIcon /></span>
              2. Mobile Number
            </span>
            <input
              className={[
                'h-11 w-full rounded-xl border bg-white px-4 text-sm font-medium text-black shadow-[0_6px_18px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-black/60 focus:ring-4',
                showMobileError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-200 focus:border-primary focus:ring-primary/10',
              ].join(' ')}
              placeholder="Enter 10-digit mobile number"
              type="tel"
              inputMode="numeric"
              maxLength={13}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 13))}
              onBlur={() => setMobileTouched(true)}
              required
            />
          </label>
          {showMobileError && (
            <p className="mt-1 text-xs font-semibold text-red-600">{mobileError}</p>
          )}
        </div>
        <Field number="3" label="Email Address" placeholder="Enter your email address" icon={null} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-black">4. Select Service</span>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-black outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            required
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.durationLabel || `${s.durationMins || 60} mins`}{s.price ? ` (${s.price})` : ''}
              </option>
            ))}
          </select>
        </label>
        {selectedService && (
          <p className="mt-2 inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            Estimated duration: {selectedService.durationLabel || `${selectedService.durationMins} mins`} · Blocks {slotsNeeded} slot{slotsNeeded > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-black">5. Select Date</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {dateSlots.map((slot) => (
            <div key={slot.key} className="text-center">
              <p className="mb-1 text-xs font-bold text-black">{slot.day}</p>
              <button
                className={[
                  'h-12 w-full rounded-xl border text-sm font-bold transition',
                  selectedDate === slot.key
                    ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgba(233,30,140,0.22)]'
                    : 'border-slate-200 bg-white text-black hover:border-primary',
                ].join(' ')}
                type="button"
                onClick={() => setSelectedDate(slot.key)}
              >
                <span className="block text-sm leading-tight">{slot.date}</span>
                <span className="block text-xs font-medium">{slot.month}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-black">6. Select Time</p>
          <span className="text-[11px] font-semibold text-text-muted">
            {slotsNeeded > 1
              ? `This service needs ${slotsNeeded} consecutive slots — following slots auto-block.`
              : 'This service fits in a single slot.'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {timeSlots.map((time, idx) => {
            const bookable = isStartBookable(idx);
            const isOccupied = occupiedIndexes.has(idx);
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                disabled={!bookable}
                title={
                  !bookable
                    ? isOccupied
                      ? 'Already booked'
                      : 'Not enough consecutive slots left (blocked by duration)'
                    : `Select ${time} (${blockedSlots.length && isSelected ? `blocks ${blockedSlots.join(', ')}` : `blocks ${slotsNeeded} slot(s)`})`
                }
                className={[
                  'h-10 rounded-xl border-2 text-xs font-semibold transition sm:text-sm',
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-[0_10px_22px_rgba(233,30,140,0.24)]'
                    : !bookable
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                      : 'border-primary/25 bg-white text-primary hover:border-primary',
                ].join(' ')}
                type="button"
                onClick={() => setSelectedTime(time)}
              >
                {time}
                {!bookable && <span className="ml-1 text-[10px]">{isOccupied ? '· Booked' : '· Blocked'}</span>}
              </button>
            );
          })}
        </div>
        {selectedStartIndex !== -1 && (
          <p className="mt-2 text-xs font-semibold text-black">
            Selected: <span className="text-primary">{selectedTime}</span>
            <span className="font-medium text-text-muted">
              {' '}→ blocks {blockedSlots.join(', ')} ({selectedService?.durationLabel})
            </span>
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border-2 border-primary/25 bg-white" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded bg-primary" /> Selected
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded border border-slate-200 bg-slate-100" /> Booked / Blocked
          </span>
        </div>
      </div>

      <button
        className="mx-auto mt-6 flex h-12 w-full max-w-[420px] items-center justify-center gap-3 rounded-2xl bg-primary text-base font-semibold text-white shadow-[0_16px_30px_rgba(233,30,140,0.24)] transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Book Appointment'}
        {status !== 'sending' && <ArrowRightIcon className="h-5 w-5" />}
      </button>
      {status === 'success' && (
        <p className="mt-3 text-center text-sm font-semibold text-green-600">
          Your booking is successfully completed! Thank you for booking {lastBooking?.service || selectedService?.title} on {lastBooking?.dateLabel} at {lastBooking?.time || selectedTime}.
        </p>
      )}
      {status === 'error' && serverError && (
        <p className="mt-3 text-center text-sm font-semibold text-red-600">
          {serverError}
        </p>
      )}
      <p className="mt-2 text-center text-xs font-medium tracking-wide text-black/70">Your information is safe with us.</p>
    </form>
  );
}

export default function BookingAppointment() {
  return (
    <section className="bg-white pt-24 pb-12">
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        <div className="mb-6 text-center">
          <p className="text-base font-bold uppercase tracking-[0.22em] text-primary">Book Appointment</p>
          <h1 className="mt-2 text-2xl font-bold text-black sm:text-3xl">Book Your Appointment</h1>
        </div>
        <AppointmentForm />
      </div>
    </section>
  );
}
