// ─── SearchBar ────────────────────────────────────────────────────────────────

/**
 * Controlled search input with magnifier icon and clear button.
 *
 * @param {string}   value
 * @param {function} onChange   – (value: string) => void
 * @param {string}   placeholder
 */
function SearchBar({ value, onChange, placeholder = 'Search auctions…' }) {
  return (
    <div className="relative flex items-center">
      {/* Magnifier */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-3.5 text-text-muted"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'h-10 w-full rounded-xl border border-border bg-bg-card',
          'pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted',
          'outline-none transition-all duration-150',
          'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
        ].join(' ')}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 flex items-center text-text-muted transition-colors duration-150 hover:text-text-secondary focus-visible:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
