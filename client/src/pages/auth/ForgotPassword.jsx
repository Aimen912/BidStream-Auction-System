import { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── ForgotPassword page ──────────────────────────────────────────────────────

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail]         = useState('');

  // Input base classes
  const inputBase = [
    'w-full rounded-xl border border-border bg-bg-card',
    'px-4 py-2.5 text-sm text-text-primary',
    'placeholder:text-text-muted',
    'transition-colors duration-150',
    'outline-none',
    'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
  ].join(' ');

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-surface px-4 py-12">

      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-secondary-600/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-accent-600/10 blur-3xl"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-card px-8 py-10 shadow-modal">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-600 shadow-dropdown">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 15L9 3l6 12H3z" fill="white" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              Bid<span className="text-secondary-600">Stream</span>
            </span>
          </Link>
        </div>

        {!submitted ? (
          <>
            {/* Heading */}
            <div className="mb-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                Forgot Password?
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                No worries. Enter your registered email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className="text-sm font-medium text-text-secondary">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </div>

              <button
                type="button"
                onClick={() => email.trim() && setSubmitted(true)}
                className={[
                  'w-full rounded-xl bg-secondary-600 px-5 py-3',
                  'text-sm font-semibold text-white shadow-dropdown',
                  'transition-all duration-150',
                  'hover:bg-secondary-500 hover:-translate-y-0.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1',
                  !email.trim() ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
              >
                Send Reset Link
              </button>

              {/* Back to login */}
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text-primary no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="13" y1="8" x2="3" y2="8" />
                  <polyline points="7 12 3 8 7 4" />
                </svg>
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text-primary">Check your inbox</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                We sent a password reset link to{' '}
                <span className="font-semibold text-text-primary">{email}</span>.
                It expires in 15 minutes.
              </p>
            </div>

            <p className="text-xs text-text-muted">
              Didn&apos;t receive it?{' '}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-medium text-secondary-600 hover:text-secondary-500 focus-visible:outline-none"
              >
                Try again
              </button>
            </p>

            <Link
              to="/login"
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary shadow-card transition-all duration-150 hover:border-secondary-600 hover:text-secondary-600 no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="13" y1="8" x2="3" y2="8" />
                <polyline points="7 12 3 8 7 4" />
              </svg>
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
