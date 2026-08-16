// ─── MessageFilters ───────────────────────────────────────────────────────────

/**
 * Search + Unread + Online filter controls for the conversation list.
 *
 * @param {string}   search        – controlled search string
 * @param {boolean}  unreadOnly    – show unread conversations only
 * @param {boolean}  onlineOnly    – show online buyers only
 * @param {function} onSearch      – (value: string) => void
 * @param {function} onToggleUnread
 * @param {function} onToggleOnline
 */
function MessageFilters({ search, unreadOnly, onlineOnly, onSearch, onToggleUnread, onToggleOnline }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border-subtle px-4 pb-3 pt-2">

      {/* Search input */}
      <div className="relative">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search buyer or auction…"
          className="h-9 w-full rounded-xl border border-border bg-bg-surface pl-8 pr-8 text-xs text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:bg-bg-card focus:ring-2 focus:ring-secondary-500/20"
        />
        {search && (
          <button type="button" onClick={() => onSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Toggle pills */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleUnread}
          aria-pressed={unreadOnly}
          className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
            unreadOnly
              ? 'bg-danger text-white'
              : 'border border-border bg-bg-card text-text-secondary hover:border-border',
          ].join(' ')}
        >
          <span className={['h-1.5 w-1.5 rounded-full', unreadOnly ? 'bg-bg-card' : 'bg-danger'].join(' ')} />
          Unread
        </button>

        <button
          type="button"
          onClick={onToggleOnline}
          aria-pressed={onlineOnly}
          className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
            onlineOnly
              ? 'bg-success text-white'
              : 'border border-border bg-bg-card text-text-secondary hover:border-border',
          ].join(' ')}
        >
          <span className={['h-1.5 w-1.5 rounded-full', onlineOnly ? 'bg-bg-card' : 'bg-success'].join(' ')} />
          Online
        </button>
      </div>
    </div>
  );
}

export default MessageFilters;
