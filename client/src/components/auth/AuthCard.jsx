import { Link } from 'react-router-dom';

// ─── BidStream logo mark ──────────────────────────────────────────────────────

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 no-underline">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-violet shadow-dropdown">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 15L9 3l6 12H3z" fill="white" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight text-text-primary">
        Bid<span className="text-primary-400">Stream</span>
      </span>
    </Link>
  );
}

// ─── AuthCard ─────────────────────────────────────────────────────────────────

/**
 * Shared card shell used by every auth page.
 *
 * @param {string}           title     – main heading
 * @param {string}           subtitle  – supporting paragraph
 * @param {React.ReactNode}  children  – form content
 * @param {string}           className – optional extra classes on the card
 */
function AuthCard({ title, subtitle, children, className = '' }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-base px-4 py-12">

      {/* Background decoration blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-secondary-600/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[380px] w-[380px] rounded-full bg-accent-600/10 blur-3xl"
      />

      {/* Card */}
      <div
        className={[
          'relative z-10 w-full max-w-md',
          'rounded-2xl border border-border bg-bg-card',
          'shadow-modal',
          'px-4 py-8 sm:px-8 sm:py-10',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {subtitle}
            </p>
          )}
        </div>

        {/* Slot */}
        {children}
      </div>
    </div>
  );
}

export default AuthCard;
