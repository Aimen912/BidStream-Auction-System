// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  outbid: {
    iconBg:    'bg-danger-100',
    iconColor: 'text-danger',
    dot:       'bg-danger',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  auction_won: {
    iconBg:    'bg-success-100',
    iconColor: 'text-success',
    dot:       'bg-success',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  auction_lost: {
    iconBg:    'bg-bg-elevated',
    iconColor: 'text-text-muted',
    dot:       'bg-navy-500',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  ending_soon: {
    iconBg:    'bg-warning/10',
    iconColor: 'text-warning',
    dot:       'bg-warning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  new_message: {
    iconBg:    'bg-secondary-100',
    iconColor: 'text-secondary-600',
    dot:       'bg-secondary-600',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  payment: {
    iconBg:    'bg-accent-100',
    iconColor: 'text-accent-600',
    dot:       'bg-accent-600',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  system: {
    iconBg:    'bg-primary-900/30',
    iconColor: 'text-primary-300',
    dot:       'bg-primary-700',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
};

// ─── NotificationCard ─────────────────────────────────────────────────────────

/**
 * @param {object}   notification  – single NOTIFICATIONS record
 * @param {function} onMarkRead    – (id) => void
 * @param {function} onDelete      – (id) => void
 */
function NotificationCard({ notification, onMarkRead, onDelete }) {
  const { id, type, title, description, auctionTitle, time, read } = notification;
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.system;

  return (
    <div
      className={[
        'group relative flex gap-4 rounded-2xl border p-4 transition-all duration-150',
        'hover:shadow-dropdown',
        read
          ? 'border-border bg-bg-card'
          : 'border-secondary-600/20 bg-secondary-600/5',
      ].join(' ')}
    >
      {/* Unread indicator stripe */}
      {!read && (
        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-secondary-600" aria-hidden="true" />
      )}

      {/* Icon */}
      <div className={['mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', cfg.iconBg, cfg.iconColor].join(' ')}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={['text-sm font-semibold', read ? 'text-text-primary' : 'text-text-primary'].join(' ')}>
                {title}
              </p>
              {!read && (
                <span className="shrink-0 rounded-full bg-secondary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  New
                </span>
              )}
            </div>
            <p className="mt-1 text-sm leading-snug text-text-muted">{description}</p>
            {auctionTitle && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {auctionTitle}
              </p>
            )}
          </div>

          {/* Time + actions */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-[11px] text-text-muted whitespace-nowrap">{time}</span>

            {/* Action buttons — visible on hover */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {/* Mark as read */}
              {!read && (
                <button
                  type="button"
                  onClick={() => onMarkRead(id)}
                  aria-label="Mark as read"
                  title="Mark as read"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors duration-150 hover:border-secondary-600/40 hover:bg-secondary-600/10 hover:text-secondary-600 focus-visible:outline-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              )}

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(id)}
                aria-label="Delete notification"
                title="Delete"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
