import { useState } from 'react';
import { Aurora, FloatingOrbs } from '../../components/ui/Decor';
import Reveal from '../../components/ui/Reveal';

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
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft to-white">
      <Aurora />
      <FloatingOrbs />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-[480px] flex-col justify-center px-5 pb-12 pt-24 sm:px-8">
      <p className="flip-in text-center text-sm font-bold uppercase tracking-[0.22em] text-primary sm:text-base">Admin</p>
      <h1 className="flip-in mt-2 text-center text-3xl font-bold text-black" style={{ '--flip-delay': '120ms' }}>Admin Login</h1>

      <Reveal>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_0_#fbd5ea,0_30px_70px_rgba(143,15,85,0.16)] sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-black">Password</span>
          <input
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base font-medium shadow-[inset_0_2px_4px_rgba(15,23,42,0.05)] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
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
          className="btn-3d btn-3d-filled min-h-12 w-full rounded-xl text-sm font-bold disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="min-h-12 w-full rounded-xl border border-slate-200 text-sm font-bold text-black transition hover:bg-slate-50"
        >
          Back to Home
        </button>
      </form>
      </Reveal>
      </div>
    </section>
  );
}
