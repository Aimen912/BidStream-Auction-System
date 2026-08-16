import SearchBar      from './SearchBar';
import CategoryFilter from './CategoryFilter';
import StatusFilter   from './StatusFilter';
import SortDropdown   from './SortDropdown';

// ─── AuctionFilters ───────────────────────────────────────────────────────────

/**
 * Responsive filter bar that composes all filter primitives.
 *
 * @param {object}   filters   – { search, category, status, sort }
 * @param {function} onChange  – (key, value) => void
 * @param {function} onClear   – resets all filters
 * @param {boolean}  hasActive – true when any non-default filter is set
 */
function AuctionFilters({ filters, onChange, onClear, hasActive }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">

      {/* ── Row 1: search + sort + clear ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search — grows to fill */}
        <div className="flex-1">
          <SearchBar
            value={filters.search}
            onChange={(v) => onChange('search', v)}
            placeholder="Search by title or seller…"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <SortDropdown
            value={filters.sort}
            onChange={(v) => onChange('sort', v)}
          />

          {/* Clear — only shows when filters are active */}
          {hasActive && (
            <button
              type="button"
              onClick={onClear}
              className={[
                'flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary',
                'transition-all duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30',
              ].join(' ')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6"  y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-bg-elevated" aria-hidden="true" />

      {/* ── Row 2: category pills ── */}
      <CategoryFilter
        selected={filters.category}
        onChange={(v) => onChange('category', v)}
      />

      {/* ── Row 3: status pills ── */}
      <StatusFilter
        selected={filters.status}
        onChange={(v) => onChange('status', v)}
      />
    </div>
  );
}

export default AuctionFilters;
