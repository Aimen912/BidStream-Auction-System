// ─── EmptyBids ────────────────────────────────────────────────────────────────

/**
 * Shown when no bids match the current filters.
 *
 * @param {function} onReset – clears all active filters
 */
function EmptyBids({ onReset }) {
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-text-primary">No bids found</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
        No bids match your current filters. Try adjusting your search or status filter.
      </p>

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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 .49-3.17" />
        </svg>
        Reset Filters
      </button>
    </div>
  );
}

export default EmptyBids;
