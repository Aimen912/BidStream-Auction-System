import { Link } from 'react-router-dom';

// ─── EmptyWatchlist ───────────────────────────────────────────────────────────

/**
 * Full-page empty state shown when the watchlist has no items.
 * Navigates to /auctions on CTA click.
 */
function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-24 text-center motion-safe:animate-slide-up">

      {/* Illustration */}
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-70" />
        {/* Mid ring */}
        <div className="absolute inset-5 rounded-full bg-gradient-to-br from-bg-elevated to-bg-surface" />
        {/* Icon card */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card shadow-dropdown">
          {/* Heart outline */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-text-primary">Your watchlist is empty</h3>
      <p className="mb-8 max-w-xs text-sm leading-relaxed text-text-muted">
        Save auctions you&apos;re interested in to easily find them later. Tap the heart icon on any auction card to add it here.
      </p>

      <Link
        to="/auctions"
        className={[
          'inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-6 py-3',
          'text-sm font-semibold text-white shadow-card no-underline',
          'transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
        ].join(' ')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Browse Auctions
      </Link>
    </div>
  );
}

export default EmptyWatchlist;
