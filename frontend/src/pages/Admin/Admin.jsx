import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FIXED_PASSWORD = '123456';

export default function Admin({ onBack, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const p = password;

    try {
      // 1) Try backend verification first (POST /api/admin/login).
      //    Username is fixed; the form only asks for the password.
      try {
        const res = await fetch(`${API_BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: FIXED_USERNAME, password: p }),
        });
        if (res.ok) {
          sessionStorage.setItem('winsome_admin_auth', '1');
          onLoginSuccess?.();
          return;
        }
        if (res.status === 401) {
          setError('Invalid password.');
          return;
        }
        // Non-401 (e.g. backend down) → fall through to local check below.
      } catch {
        // Backend unreachable → fall back to local fixed check.
      }

      // 2) Local fixed-credential fallback (password only).
      if (p === FIXED_PASSWORD) {
        sessionStorage.setItem('winsome_admin_auth', '1');
        onLoginSuccess?.();
      } else {
        setError('Invalid password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-5 pt-24 pb-12 sm:px-8">
      <p className="text-center text-base font-bold uppercase tracking-[0.22em] text-primary">Admin</p>
      <h1 className="mt-2 text-center text-3xl font-bold text-black">Admin Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-black">Password</span>
          <input
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && (
          <p className="text-center text-sm font-semibold text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="h-11 w-full rounded-xl border border-slate-200 text-sm font-bold text-black transition hover:bg-slate-50"
        >
          Back to Home
        </button>
      </form>
    </section>
  );
}
