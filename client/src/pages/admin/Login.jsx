import { useState }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─── Eye icons ────────────────────────────────────────────────────────────────

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Admin Login page ─────────────────────────────────────────────────────────

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, loading, error, setError } = useAuth();

  const inputCls = [
    'w-full rounded-xl border border-border bg-bg-card',
    'px-4 py-2.5 text-sm text-text-primary',
    'placeholder:text-text-muted',
    'outline-none transition-all duration-150',
    'focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20',
  ].join(' ');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await adminLogin({
        email: form.elements['admin-email'].value.trim(),
        password: form.elements['admin-password'].value,
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Admin login failed');
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-surface px-4 py-12">

      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary-700/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-primary-900/10 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-card px-8 py-10 shadow-modal">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-900 shadow-dropdown">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 15L9 3l6 12H3z" fill="white" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              Bid<span className="text-primary-600">Stream</span>
            </span>
          </Link>
        </div>

        {/* Administrator Access badge */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-primary-700/30 bg-primary-900/30 px-4 py-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-300" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs font-bold tracking-wide text-primary-300">
            Administrator Access
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Restricted access. Authorised personnel only.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-sm font-medium text-text-secondary">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="admin@bidstream.com"
              className={inputCls}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-sm font-medium text-text-secondary">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={[inputCls, 'pr-11'].join(' ')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-150 hover:text-text-secondary focus-visible:outline-none"
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={[
              'mt-1 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white',
              loading ? 'cursor-not-allowed bg-primary-700/70' : 'bg-primary-900 shadow-dropdown',
              'transition-colors duration-150 hover:bg-primary-700 hover:-translate-y-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-1',
            ].join(' ')}
          >
            {loading ? 'Signing in...' : 'Admin Login'}
          </button>

          {error && (
            <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

        </form>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-text-muted">
          Admin accounts are managed by the platform.{' '}
          <Link to="/login" className="font-medium text-primary-300 hover:text-text-primary no-underline">
            Return to main login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
