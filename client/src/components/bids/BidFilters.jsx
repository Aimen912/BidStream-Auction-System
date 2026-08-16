import { useState, useRef, useEffect } from 'react';
import { BID_STATUSES, BID_SORT_OPTIONS } from '../../data/bids/BIDS_DATA';

// ─── SearchInput ──────────────────────────────────────────────────────────────

function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex items-center">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3.5 text-text-muted" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by auction title…"
        className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-3 text-text-muted hover:text-text-secondary focus-visible:outline-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── SortMenu ─────────────────────────────────────────────────────────────────

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeLabel = BID_SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Sort';

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    if (open) document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
          open ? 'border-secondary-600 bg-secondary-600/5 text-secondary-600' : 'border-border bg-bg-card text-text-secondary hover:border-border',
        ].join(' ')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        {activeLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={['transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown">
          {BID_SORT_OPTIONS.map(({ value: v, label }) => {
            const isSelected = value === v;
            return (
              <li key={v} role="option" aria-selected={isSelected} onClick={() => { onChange(v); setOpen(false); }}
                className={['flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150', isSelected ? 'bg-secondary-600/5 font-semibold text-secondary-600' : 'text-text-secondary hover:bg-bg-surface'].join(' ')}>
                {label}
                {isSelected && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── BidFilters ───────────────────────────────────────────────────────────────

/**
 * @param {object}   filters   – { search, status, sort }
 * @param {function} onChange  – (key, value) => void
 * @param {function} onClear
 * @param {boolean}  hasActive
 */
function BidFilters({ filters, onChange, onClear, hasActive }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">

      {/* Row 1: search + sort + clear */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput value={filters.search} onChange={(v) => onChange('search', v)} />
        </div>
        <div className="flex items-center gap-2">
          <SortMenu value={filters.sort} onChange={(v) => onChange('sort', v)} />
          {hasActive && (
            <button
              type="button"
              onClick={onClear}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-bg-elevated" aria-hidden="true" />

      {/* Status pill row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5" role="group" aria-label="Filter by bid status">
        {BID_STATUSES.map(({ value, label }) => {
          const isActive = filters.status === value;
          const activeMap = {
            all:         'bg-primary-700 text-white',
            winning:     'bg-success text-white',
            outbid:      'bg-danger text-white',
            ending_soon: 'bg-orange-500 text-white',
            won:         'bg-secondary-600 text-white',
            lost:        'bg-navy-500 text-white',
          };
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange('status', value)}
              aria-pressed={isActive}
              className={[
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
                isActive
                  ? activeMap[value]
                  : 'border border-border bg-bg-card text-text-secondary hover:border-border hover:bg-bg-surface',
              ].join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BidFilters;
