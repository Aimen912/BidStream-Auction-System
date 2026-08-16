import { useState }          from 'react';
import { Link } from 'react-router-dom';

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

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────

/**
 * LoginForm
 *
 * @param {'buyer'|'seller'} role – drives button label and post-login destination
 */
function LoginForm({ role = 'buyer', onSubmit, loading = false, error = '' }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);

  const buttonLabel = role === 'seller' ? 'Login as Seller' : 'Login as Buyer';

  // Input base classes
  const inputBase = [
    'w-full rounded-xl border border-border bg-bg-card',
    'px-4 py-2.5 text-sm text-text-primary',
    'placeholder:text-text-muted',
    'transition-colors duration-150',
    'outline-none',
    'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
    'disabled:bg-bg-surface disabled:cursor-not-allowed',
  ].join(' ');

  async function handleSubmit(e) {
    e.preventDefault();
    if (onSubmit) {
      const email = e.currentTarget.elements['login-email'].value.trim();
      const password = e.currentTarget.elements['login-password'].value;
      await onSubmit({ email, password, rememberMe, role });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      {/* Email */}
      <Field label="Email Address" htmlFor="login-email">
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputBase}
        />
      </Field>

      {/* Password */}
      <Field label="Password" htmlFor="login-password">
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className={[inputBase, 'pr-11'].join(' ')}
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
      </Field>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-secondary-600 accent-secondary-600 focus:ring-secondary-500"
          />
          <span className="text-sm text-text-secondary">Remember me</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-sm font-medium text-secondary-600 transition-colors duration-150 hover:text-secondary-500 no-underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={[
          'mt-1 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white',
          'transition-all duration-150 hover:-translate-y-0.5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          loading ? 'cursor-not-allowed bg-secondary-400' : 'bg-secondary-600 hover:bg-secondary-500 focus-visible:ring-secondary-500 shadow-dropdown',
        ].join(' ')}
      >
        {loading ? 'Signing in...' : buttonLabel}
      </button>

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-navy-100" />
        <span className="text-xs font-medium text-text-muted">or</span>
        <div className="h-px flex-1 bg-navy-100" />
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-secondary-600 transition-colors duration-150 hover:text-secondary-500 no-underline"
        >
          Create Account
        </Link>
      </p>

    </form>
  );
}

export default LoginForm;
