// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:    { label: 'Live',     cls: 'bg-success text-white',         pulse: true  },
  ended:   { label: 'Ended',   cls: 'bg-navy-500 text-white',         pulse: false },
  upcoming:{ label: 'Upcoming', cls: 'bg-accent-600 text-white',      pulse: false },
  draft:   { label: 'Draft',   cls: 'bg-navy-100 text-text-secondary',      pulse: false },
  sold:    { label: 'Sold',    cls: 'bg-secondary-600 text-white',    pulse: false },
};

// ─── AuctionStatusBadge ───────────────────────────────────────────────────────

/**
 * @param {'live'|'ended'|'upcoming'|'draft'|'sold'} status
 * @param {'sm'|'md'} size
 */
function AuctionStatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <span className={[
      'inline-flex items-center gap-1.5 rounded-full font-semibold',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      cfg.cls,
    ].join(' ')}>
      {cfg.pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

export default AuctionStatusBadge;
