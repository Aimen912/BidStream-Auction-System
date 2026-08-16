import { DATE_RANGES } from '../../data/seller/SELLER_ANALYTICS_DATA';

// ─── Shared select ────────────────────────────────────────────────────────────

function SelectFilter({ value, onChange, options }) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'h-10 appearance-none cursor-pointer',
          'rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary',
          'outline-none transition-all duration-150',
          'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
          'hover:border-border',
        ].join(' ')}
      >
        {options.map(({ value: v, label }) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─── AnalyticsFilters ─────────────────────────────────────────────────────────

/**
 * @param {object}   filters  – { dateRange, category, status }
 * @param {function} onChange – (key, value) => void
 */
function AnalyticsFilters({ filters, onChange }) {
  const CATEGORY_OPTIONS = [
    { value: 'all',          label: 'All Categories' },
    { value: 'Photography',  label: 'Photography'    },
    { value: 'Luxury',       label: 'Luxury'         },
    { value: 'Fashion',      label: 'Fashion'        },
    { value: 'Music',        label: 'Music'          },
    { value: 'Technology',   label: 'Technology'     },
    { value: 'Art',          label: 'Art'            },
  ];

  const STATUS_OPTIONS = [
    { value: 'all',      label: 'All Statuses' },
    { value: 'live',     label: 'Live'         },
    { value: 'sold',     label: 'Sold'         },
    { value: 'ended',    label: 'Ended'        },
    { value: 'upcoming', label: 'Upcoming'     },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">

      {/* Left: filter dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          value={filters.dateRange}
          onChange={(v) => onChange('dateRange', v)}
          options={DATE_RANGES}
        />
        <SelectFilter
          value={filters.category}
          onChange={(v) => onChange('category', v)}
          options={CATEGORY_OPTIONS}
        />
        <SelectFilter
          value={filters.status}
          onChange={(v) => onChange('status', v)}
          options={STATUS_OPTIONS}
        />
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        {/* Refresh — UI only */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-border focus-visible:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.17" />
          </svg>
          Refresh
        </button>

        {/* Export — UI only */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 focus-visible:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Report
        </button>
      </div>
    </div>
  );
}

export default AnalyticsFilters;
