// ─── EmptyNotifications ───────────────────────────────────────────────────────

/**
 * Empty state for the Seller Notifications page.
 *
 * @param {function} onReset  – clears active filters (shown when filters are active)
 * @param {boolean}  allGone  – true when no notifications exist at all
 */
function EmptyNotifications({ onReset, allGone = false }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center motion-safe:animate-slide-up">

      {/* Illustration */}
      <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card shadow-card">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>

      {/* Copy */}
      <h3 className="mb-2 text-lg font-bold text-text-primary">
        {allGone ? 'No notifications available.' : 'No notifications found'}
      </h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
        {allGone
          ? "You're all caught up! New notifications will appear here when there is activity on your auctions."
          : 'No notifications match your current filters. Try adjusting or clearing them.'}
      </p>

      {/* CTA */}
      {!allGone && onReset && (
        <button
          type="button"
          onClick={onReset}
          className={[
            'inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5',
            'text-sm font-semibold text-white shadow-card',
            'transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
          ].join(' ')}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.17" />
          </svg>
          Reset Filters
        </button>
      )}
    </div>
  );
}

export default EmptyNotifications;
