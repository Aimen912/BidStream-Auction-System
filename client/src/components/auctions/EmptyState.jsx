// ─── EmptyState ───────────────────────────────────────────────────────────────

/**
 * Shown when the filtered auction list is empty.
 *
 * @param {function} onReset – clears all active filters
 */
function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center motion-safe:animate-slide-up">

      {/* Illustration — pure SVG / gradients, no external images */}
      <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
        {/* Mid ring */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
        {/* Icon */}
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8"  y1="11" x2="14" y2="11" />
          </svg>
        </div>
      </div>

      {/* Copy */}
      <h3 className="mb-2 text-lg font-bold text-text-primary">No auctions found</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
        We couldn&apos;t find any auctions matching your current filters. Try adjusting your search or clearing the filters.
      </p>

      {/* CTA */}
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

export default EmptyState;
