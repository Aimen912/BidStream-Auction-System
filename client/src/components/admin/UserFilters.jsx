// ─── UserFilters ──────────────────────────────────────────────────────────────

/**
 * Search + Role + Status filter bar for the Admin Users page.
 *
 * @param {object}   filters   – { search, role, status }
 * @param {function} onChange  – (key, value) => void
 * @param {function} onClear
 * @param {boolean}  hasActive
 */
function UserFilters({ filters, onChange, onClear, hasActive }) {

  // ── Shared select ─────────────────────────────────────────────────────────

  function SelectFilter({ id, value, onChange: onFilterChange, options }) {
    return (
      <div className="relative shrink-0">
        <select id={id} value={value} onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 hover:border-border">
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

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search by name or email…"
            className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
          />
          {filters.search && (
            <button type="button" onClick={() => onChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdowns + clear */}
        <div className="flex flex-wrap items-center gap-2">
          <SelectFilter id="uf-role"   value={filters.role}   onFilterChange={(v) => onChange('role', v)}
            options={[{ value: 'all', label: 'All Roles' }, { value: 'Buyer', label: 'Buyers' }, { value: 'Seller', label: 'Sellers' }]} />
          <SelectFilter id="uf-status" value={filters.status} onFilterChange={(v) => onChange('status', v)}
            options={[{ value: 'all', label: 'All Statuses' }, { value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'suspended', label: 'Suspended' }]} />
          {hasActive && (
            <button type="button" onClick={onClear}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserFilters;
