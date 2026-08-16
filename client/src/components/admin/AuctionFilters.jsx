import { useEffect, useState } from 'react';
import { listCategories } from '../../api/categories';

const ADMIN_AUCTION_STATUSES = [
  { value: 'all',         label: 'All Statuses'  },
  { value: 'live',        label: 'Live'          },
  { value: 'ending_soon', label: 'Ending Soon'   },
  { value: 'upcoming',    label: 'Upcoming'      },
  { value: 'draft',       label: 'Draft'         },
  { value: 'ended',       label: 'Ended'         },
  { value: 'sold',        label: 'Sold'          },
  { value: 'cancelled',   label: 'Cancelled'     },
];

function SelectFilter({ value, onChange, options }) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 hover:border-border"
      >
        {options.map(({ value: v, label }) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function AuctionFilters({ filters, onChange, onClear, hasActive }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    listCategories({ status: 'active' })
      .then(({ categories: cats }) => {
        if (active) setCategories(cats || []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: c._id, label: c.name })),
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search by title or seller…"
            className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
          />
          {filters.search && (
            <button type="button" onClick={() => onChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdowns + Clear */}
        <div className="flex flex-wrap items-center gap-2">
          <SelectFilter
            value={filters.status}
            onChange={(v) => onChange('status', v)}
            options={ADMIN_AUCTION_STATUSES}
          />
          <SelectFilter
            value={filters.category ?? 'all'}
            onChange={(v) => onChange('category', v)}
            options={categoryOptions}
          />

          {hasActive && (
            <button type="button" onClick={onClear}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionFilters;
