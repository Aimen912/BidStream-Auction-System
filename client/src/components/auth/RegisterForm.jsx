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

// ─── Shared input class ───────────────────────────────────────────────────────

const inputBase = [
  'w-full rounded-xl border border-border bg-bg-card',
  'px-4 py-2.5 text-sm text-text-primary',
  'placeholder:text-text-muted',
  'transition-colors duration-150',
  'outline-none',
  'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
].join(' ');

// ─── RegisterForm ─────────────────────────────────────────────────────────────

/**
 * RegisterForm
 *
 * @param {'buyer'|'seller'} role – pre-selects which role is registering
 */
function RegisterForm({ role = 'buyer', onSubmit, loading = false, error = '' }) {
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms,       setAgreedToTerms]       = useState(false);

  const buttonLabel = role === 'seller' ? 'Create Seller Account' : 'Create Buyer Account';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreedToTerms || !onSubmit) return;

    const form = e.currentTarget;
    await onSubmit({
      name: form.elements['reg-name'].value.trim(),
      username: form.elements['reg-username'].value.trim(),
      email: form.elements['reg-email'].value.trim(),
      phone: form.elements['reg-phone'].value.trim(),
      password: form.elements['reg-password'].value,
      confirmPassword: form.elements['reg-confirm-password'].value,
      role,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      {/* Two-column row: Full Name + Username */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="reg-name">
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="Ayesha Muneer"
            className={inputBase}
          />
        </Field>

        <Field label="Username" htmlFor="reg-username">
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            placeholder="ayesha_m"
            className={inputBase}
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email Address" htmlFor="reg-email">
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputBase}
        />
      </Field>

      {/* Phone */}
      <Field label="Phone Number (Optional)" htmlFor="reg-phone">
        <input
          id="reg-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+92 300 1234567"
          className={inputBase}
        />
      </Field>

      {/* Password */}
      <Field label="Password" htmlFor="reg-password">
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
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

      {/* Confirm Password */}
      <Field label="Confirm Password" htmlFor="reg-confirm-password">
        <div className="relative">
          <input
            id="reg-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className={[inputBase, 'pr-11'].join(' ')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-150 hover:text-text-secondary focus-visible:outline-none"
          >
            {showConfirmPassword ? <EyeOff /> : <EyeOpen />}
          </button>
        </div>
      </Field>

      {/* Terms checkbox */}
      <label className="flex cursor-pointer items-start gap-3 select-none">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-secondary-600 focus:ring-secondary-500"
        />
        <span className="text-sm leading-snug text-text-muted">
          I agree to the{' '}
          <Link to="/terms" className="font-medium text-secondary-600 hover:text-secondary-500 no-underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-medium text-secondary-600 hover:text-secondary-500 no-underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!agreedToTerms}
        className={[
          'mt-1 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white',
          'bg-secondary-600 shadow-dropdown',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1',
          loading
            ? 'cursor-not-allowed opacity-70'
            : agreedToTerms
            ? 'hover:bg-secondary-500 hover:-translate-y-0.5'
            : 'opacity-50 cursor-not-allowed',
        ].join(' ')}
      >
        {loading ? 'Creating account...' : buttonLabel}
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

      {/* Login link */}
      <p className="text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-secondary-600 transition-colors duration-150 hover:text-secondary-500 no-underline"
        >
          Login
        </Link>
      </p>

    </form>
  );
}

export default RegisterForm;
