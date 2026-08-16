// ─── EmptyAuctions ────────────────────────────────────────────────────────────

/**
 * @param {function} onReset  – clears active filters
 * @param {boolean}  allGone  – true when no auctions exist at all
 */
function EmptyAuctions({ onReset, allGone = false }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center motion-safe:animate-slide-up">

      {/* Illustration */}
      <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card shadow-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
            <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
            <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
          </svg>
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-text-primary">
        {allGone ? 'No auctions yet' : 'No auctions found'}
      </h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
        {allGone
          ? 'Create your first auction to start selling on BidStream.'
          : "No auctions match your current filters. Try adjusting or clearing them."}
      </p>

      {allGone ? (
        <a
          href="/seller/create-auction"   
          className={[
            'inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5',
            'text-sm font-semibold text-white shadow-card no-underline',
            'transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5',
          ].join(' ')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Auction
        </a>
      ) : (
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
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.17" />
          </svg>
          Reset Filters
        </button>
      )}
    </div>
  );
}

export default EmptyAuctions;
