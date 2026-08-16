import { STATUSES } from './AUCTIONS_DATA';

// ─── Status colour map ────────────────────────────────────────────────────────

const STATUS_ACTIVE_STYLES = {
  all:          'bg-primary-700 text-white',
  live:         'bg-success text-white',
  ending_soon:  'bg-danger text-white',
  upcoming:     'bg-accent-600 text-white',
  sold:         'bg-navy-500 text-white',
};

// ─── StatusFilter ─────────────────────────────────────────────────────────────

/**
 * Pill row for auction status selection.
 *
 * @param {string}   selected   – currently active status value
 * @param {function} onChange   – (status: string) => void
 */
function StatusFilter({ selected, onChange }) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label="Filter by status"
    >
      {STATUSES.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className={[
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
              isActive
                ? STATUS_ACTIVE_STYLES[value]
                : 'border border-border bg-bg-card text-text-secondary hover:border-border hover:bg-bg-surface',
            ].join(' ')}
          >
            {/* Live pulse dot */}
            {value === 'live' && isActive && (
              <span className="mr-1.5 inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
                </span>
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default StatusFilter;
