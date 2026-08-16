// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  winning:      { label: 'Winning',      cls: 'bg-success-100 text-success',                  dot: 'bg-success',    pulse: true  },
  outbid:       { label: 'Outbid',       cls: 'bg-danger-100 text-danger',                     dot: 'bg-danger',     pulse: false },
  ending_soon:  { label: 'Ending Soon',  cls: 'bg-warning/15 text-warning border border-warning/25',    dot: 'bg-warning',    pulse: true  },
  won:          { label: 'Won',          cls: 'bg-primary-600/15 text-primary-300 border border-primary-600/20', dot: 'bg-primary-500', pulse: false },
  lost:         { label: 'Lost',         cls: 'bg-bg-elevated text-text-muted',                  dot: 'bg-navy-500',   pulse: false },
};

// ─── BidStatusBadge ───────────────────────────────────────────────────────────

/**
 * Pill badge for bid status.
 *
 * @param {'winning'|'outbid'|'ending_soon'|'won'|'lost'} status
 * @param {'sm'|'md'} size
 */
function BidStatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.lost;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        cfg.cls,
      ].join(' ')}
    >
      {/* Indicator dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {cfg.pulse && (
          <span className={['absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', cfg.dot].join(' ')} />
        )}
        <span className={['relative inline-flex h-1.5 w-1.5 rounded-full', cfg.dot].join(' ')} />
      </span>
      {cfg.label}
    </span>
  );
}

export default BidStatusBadge;
