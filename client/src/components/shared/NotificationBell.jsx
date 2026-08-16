import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';
import { useNotifications } from '../../context/NotificationContext';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  bid_placed:          { color: 'bg-success',       icon: '⚡' },
  outbid:              { color: 'bg-danger',         icon: '📉' },
  auction_won:         { color: 'bg-success',        icon: '🏆' },
  auction_lost:        { color: 'bg-navy-500',       icon: '❌' },
  ending_soon:         { color: 'bg-warning',        icon: '⏰' },
  auction_submitted:   { color: 'bg-secondary-600',  icon: '📋' },
  auction_approved:    { color: 'bg-success',        icon: '✅' },
  auction_rejected:    { color: 'bg-danger',         icon: '🚫' },
  new_bid:             { color: 'bg-accent-600',     icon: '💰' },
  auction_sold:        { color: 'bg-success',        icon: '🎉' },
  admin_new_auction:   { color: 'bg-primary-700',    icon: '🔔' },
  new_message:         { color: 'bg-secondary-600',  icon: '💬' },
  payment:             { color: 'bg-accent-600',     icon: '💳' },
  order_shipped:       { color: 'bg-secondary-500',  icon: '📦' },
  order_completed:     { color: 'bg-success',        icon: '✔️' },
  account_registered:  { color: 'bg-secondary-600',  icon: '👋' },
  system:              { color: 'bg-primary-700',    icon: '⚙️' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

function NotificationBell({ notificationsPath = '/notifications', colorScheme = 'light' }) {
  const navigate = useNavigate();
  const { unread, setUnread, refreshCount } = useNotifications();

  const [open,    setOpen]    = useState(false);
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    function onOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  // ── Load preview when opened ─────────────────────────────────────────────
  async function handleOpen() {
    const opening = !open;
    setOpen((v) => !v);
    if (opening) {
      setLoading(true);
      try {
        const r = await listNotifications({ limit: 8, sort: 'newest' });
        setItems(r.notifications || []);
        setUnread(r.unreadCount ?? 0);
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      setUnread((u) => Math.max(0, u - 1));
    } catch { /* silent */ }
  }

  async function handleMarkAll() {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch { /* silent */ }
  }

  function handleViewAll() {
    setOpen(false);
    navigate(notificationsPath);
  }

  const btnCls = colorScheme === 'dark'
    ? 'relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50'
    : 'relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card text-text-muted shadow-card transition-colors duration-150 hover:border-primary-600/30 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50';

  return (
    <div ref={wrapRef} className="relative">
      {/* Bell button */}
      <button type="button" aria-label="Notifications" onClick={handleOpen} className={btnCls}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true"/>
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-dropdown sm:w-96 motion-safe:animate-slide-down">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">Notifications</span>
                {unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button type="button" onClick={handleMarkAll}
                  className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors duration-150 focus-visible:outline-none">
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mb-2 text-border" aria-hidden="true">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <p className="text-sm text-text-muted">No notifications yet</p>
                </div>
              ) : (
                items.map((n) => {
                  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
                  return (
                    <button key={n.id} type="button"
                      onClick={() => { handleMarkRead(n.id); if (n.link) navigate(n.link); setOpen(false); }}
                      className={['flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-bg-surface', !n.read ? 'bg-primary-900/20' : ''].join(' ')}>
                      <span className={['mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-sm', cfg.color].join(' ')}>
                        {cfg.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={['text-xs font-semibold leading-snug', !n.read ? 'text-text-primary' : 'text-text-secondary'].join(' ')}>
                            {n.title}
                          </p>
                          {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary-600"/>}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-text-muted leading-relaxed">{n.description}</p>
                        <p className="mt-1 text-[10px] text-navy-500">{timeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border-subtle px-4 py-2.5">
              <button type="button" onClick={handleViewAll}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-150 focus-visible:outline-none">
                View all notifications
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;
