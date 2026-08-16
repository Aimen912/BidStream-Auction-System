// ─── Type config ──────────────────────────────────────────────────────────────
// Each type gets a distinct icon, background colour, and dot colour.

const TYPE_CONFIG = {
  auction_sold: {
    iconBg:   'bg-success-100',
    iconColor:'text-success',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  },
  ending_soon: {
    iconBg:   'bg-warning-100',
    iconColor:'text-warning',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  new_bid: {
    iconBg:   'bg-secondary-100',
    iconColor:'text-secondary-600',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  },
  payment_received: {
    iconBg:   'bg-accent-100',
    iconColor:'text-accent-600',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
  payment_pending: {
    iconBg:   'bg-warning-100',
    iconColor:'text-warning',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  auction_expired: {
    iconBg:   'bg-danger-100',
    iconColor:'text-danger',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  },
  system: {
    iconBg:   'bg-primary-900/30',
    iconColor:'text-primary-300',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
  message_received: {
    iconBg:   'bg-secondary-100',
    iconColor:'text-secondary-600',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  review_received: {
    iconBg:   'bg-violet-900/30',
    iconColor:'text-violet-light',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  },
  promotion: {
    iconBg:   'bg-emerald-900/30',
    iconColor:'text-emerald-400',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  },
};

// ─── Priority badge config ────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-danger-100 text-danger'   },
  medium: { label: 'Medium', cls: 'bg-warning-100 text-warning' },
  low:    { label: 'Low',    cls: 'bg-bg-elevated text-text-muted'   },
};

// ─── NotificationCard ─────────────────────────────────────────────────────────

/**
 * Single notification card.
 *
 * @param {object}   notification – single record from SELLER_NOTIFICATIONS
 * @param {function} onMarkRead   – (id) => void
 * @param {function} onDelete     – (id) => void
 */
function NotificationCard({ notification, onMarkRead, onDelete }) {
  const { id, type, title, message, time, read, priority } = notification;
  const cfg  = TYPE_CONFIG[type]     ?? TYPE_CONFIG.system;
  const pcfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.low;

  return (
    <div
      className={[
        'group relative flex gap-4 rounded-2xl border p-4 transition-all duration-150 hover:shadow-dropdown',
        read
          ? 'border-border bg-bg-card'
          : 'border-secondary-600/20 bg-secondary-600/5',
      ].join(' ')}
    >
      {/* Unread stripe */}
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

            {/* Title row */}
            <div className="flex flex-wrap items-center gap-2">
              <p className={['text-sm font-semibold', read ? 'text-text-primary' : 'text-text-primary'].join(' ')}>
                {title}
              </p>
              {/* Unread badge */}
              {!read && (
                <span className="shrink-0 rounded-full bg-secondary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  New
                </span>
              )}
              {/* Priority badge */}
              <span className={['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', pcfg.cls].join(' ')}>
                {pcfg.label}
              </span>
            </div>

            {/* Message */}
            <p className="mt-1 text-sm leading-snug text-text-muted">{message}</p>

            {/* Time */}
            <p className="mt-1.5 text-xs text-text-muted">{time}</p>
          </div>

          {/* Action buttons — revealed on hover */}
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
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
  );
}

export default NotificationCard;
