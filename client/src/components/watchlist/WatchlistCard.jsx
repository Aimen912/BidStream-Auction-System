import { useState } from 'react';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:        { label: 'Live',        cls: 'bg-success text-white',     dot: true,  pulse: true  },
  ending_soon: { label: 'Ending Soon', cls: 'bg-danger text-white',      dot: true,  pulse: true  },
  upcoming:    { label: 'Upcoming',    cls: 'bg-accent-600 text-white',  dot: false, pulse: false },
  sold:        { label: 'Sold',        cls: 'bg-navy-500 text-white',    dot: false, pulse: false },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.sold;
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>
      {cfg.dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {cfg.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

// ─── WatchlistCard ────────────────────────────────────────────────────────────

/**
 * @param {object}   item       – single WATCHLIST record
 * @param {function} onRemove   – (id) => void – removes item from local state
 */
function WatchlistCard({ item, onRemove }) {
  const [favorited, setFavorited] = useState(true); // already in watchlist → starts favorited

  const {
    id, title, category, seller, sellerAvatar,
    currentBid, startingPrice, bids,
    status, timeLeft, gradient, addedAt, image,
  } = item;

  const isSold     = status === 'sold';
  const isUpcoming = status === 'upcoming';
  const bidDisabled = isSold || isUpcoming;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-border hover:shadow-modal">

      {/* ── Image area ── */}
      <div className={`relative h-44 w-full overflow-hidden ${image ? 'bg-bg-elevated' : `bg-gradient-to-br ${gradient}`}`}>
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10" />
            {/* Watermark icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <path d="M14 66 L40 14 L66 66 Z" fill="white" />
              </svg>
            </div>
          </>
        )}

        {/* Top row: status badge + heart */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge status={status} />

          <button
            type="button"
            onClick={() => setFavorited((v) => !v)}
            aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={favorited}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={favorited ? 'text-danger' : 'text-white'}
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Bottom row: timer + bid count */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <span className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm',
            status === 'ending_soon' ? 'bg-danger/90 text-white' :
            status === 'sold'        ? 'bg-bg-elevated/70 text-white' :
            'bg-black/40 text-white',
          ].join(' ')}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {timeLeft}
          </span>
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {bids} bids
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-5">

        {/* Category + seller */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
              {sellerAvatar}
            </span>
            {seller}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-text-primary transition-colors duration-150 group-hover:text-secondary-600">
          {title}
        </h3>

        {/* Added date */}
        <p className="mb-4 flex items-center gap-1.5 text-xs text-text-muted">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8"  y1="2" x2="8"  y2="6" />
            <line x1="3"  y1="10" x2="21" y2="10" />
          </svg>
          Added {addedAt}
        </p>

        {/* Bid info */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-text-muted">Current Bid</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-auction">
              ${currentBid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-text-muted">Starting</p>
            <p className="mt-0.5 text-sm font-semibold text-text-muted">
              ${startingPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          {/* Bid Now */}
          <button
            type="button"
            disabled={bidDisabled}
            className={[
              'flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
              bidDisabled
                ? 'cursor-not-allowed bg-navy-100 text-text-muted'
                : 'bg-secondary-600 shadow-card hover:bg-secondary-500 hover:-translate-y-0.5',
            ].join(' ')}
          >
            {isSold ? 'Sold' : isUpcoming ? 'Not Started' : 'Bid Now'}
          </button>

          {/* Remove from watchlist */}
          <button
            type="button"
            onClick={() => onRemove(id)}
            aria-label="Remove from watchlist"
            className={[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border',
              'text-text-muted transition-all duration-150',
              'hover:border-danger/40 hover:bg-danger-100 hover:text-danger',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30',
            ].join(' ')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default WatchlistCard;
