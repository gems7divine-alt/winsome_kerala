import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Admin uses only two states: new bookings arrive as "confirmed",
// admin later moves them to "completed" (DB updated via PATCH).
const STATUS_OPTIONS = ['all', 'confirmed', 'completed'];
const EDITABLE_STATUSES = ['confirmed', 'completed'];

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(value) {
  if (!value) return '-';
  // Backend returns "HH:MM:SS" — display as "h:MM AM/PM".
  const parts = String(value).split(':');
  if (parts.length >= 2) {
    const h = Number(parts[0]);
    const m = parts[1];
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${m} ${ampm}`;
  }
  return String(value);
}

const statusPill = (s) => {
  const base = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize';
  if (s === 'confirmed') return `${base} bg-green-100 text-green-700`;
  if (s === 'completed') return `${base} bg-blue-100 text-blue-700`;
  return `${base} bg-yellow-100 text-yellow-800`;
};

export default function AdminDashboard({ onLogout, onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/bookings?limit=500`);
      if (!res.ok) throw new Error(`Failed to load bookings (${res.status})`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Could not load bookings. Is the backend running on http://localhost:8000?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (!q) return true;
      return [b.full_name, b.mobile_number, b.email_address, b.service_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bookings, search, statusFilter]);

  const handleStatusChange = async (id, nextStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error(err);
      alert('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete booking #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert('Could not delete booking. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('winsome_admin_auth');
    onLogout?.();
  };

  return (
    <section className="min-h-svh bg-gradient-to-b from-primary-soft to-white pb-12 pt-24 sm:pt-28">
      <div className="site-container max-w-[1320px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary sm:text-base">Admin Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold text-black sm:text-3xl">All Booking Details</h1>
            <p className="mt-1 text-sm font-medium text-black/60">
              {filtered.length} of {bookings.length} bookings
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              onClick={fetchBookings}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-50"
            >
              Refresh
            </button>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-black transition hover:bg-slate-50"
              >
                Home
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="btn-3d btn-3d-filled min-h-11 rounded-xl px-4 text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
            placeholder="Search by name, mobile, email or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold outline-none focus:border-primary sm:text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="py-10 text-center text-sm font-semibold text-black/60">Loading bookings...</p>}
        {error && !loading && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">{error}</p>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-black/60">
            No bookings found.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
            {filtered.map((b) => (
              <article key={b.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_5px_0_#fbd5ea,0_18px_40px_rgba(143,15,85,0.1)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-black/50">#{b.id}</p>
                    <h2 className="break-words text-base font-bold text-black">{b.full_name}</h2>
                  </div>
                  <span className={`${statusPill(b.status)} shrink-0`}>{b.status}</span>
                </div>

                <p className="mt-3 text-sm font-semibold text-black">{b.service_name}</p>
                <p className="text-xs text-black/50">{b.duration_mins} mins · {b.slots_blocked} slot(s)</p>
                <p className="mt-2 text-sm font-bold text-primary">{formatDate(b.booking_date)} · {formatTime(b.booking_time)}</p>

                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
                  <a href={`tel:${b.mobile_number}`} className="block font-medium text-black">{b.mobile_number}</a>
                  <a href={`mailto:${b.email_address}`} className="block break-all text-black/70">{b.email_address}</a>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <select
                    value={EDITABLE_STATUSES.includes(b.status) ? b.status : 'confirmed'}
                    disabled={updatingId === b.id}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold outline-none focus:border-primary sm:text-sm"
                    aria-label={`Change status for booking ${b.id}`}
                  >
                    {EDITABLE_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="h-11 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="hidden overflow-x-auto rounded-3xl lg:block ring-1 ring-black/[0.04] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <table className="w-full min-w-[900px] border-collapse bg-white text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-black/60">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold">#{b.id}</td>
                    <td className="px-4 py-3 font-semibold">{b.full_name}</td>
                    <td className="px-4 py-3">{b.mobile_number}</td>
                    <td className="px-4 py-3">{b.email_address}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{b.service_name}</span>
                      <span className="block text-xs text-black/50">
                        {b.duration_mins} mins · {b.slots_blocked} slot(s)
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(b.booking_date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatTime(b.booking_time)}</td>
                    <td className="px-4 py-3">
                      <span className={statusPill(b.status)}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={EDITABLE_STATUSES.includes(b.status) ? b.status : 'confirmed'}
                          disabled={updatingId === b.id}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold outline-none focus:border-primary"
                          aria-label={`Change status for booking ${b.id}`}
                        >
                          {EDITABLE_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id)}
                          className="h-9 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
