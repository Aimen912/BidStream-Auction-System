import { useEffect, useMemo, useState } from 'react';

import PageHeader                from '../../components/layout/PageHeader';
import NotificationSummaryCards  from '../../components/notifications/NotificationSummaryCards';
import NotificationFilters       from '../../components/notifications/NotificationFilters';
import NotificationCard          from '../../components/notifications/NotificationCard';
import EmptyNotifications        from '../../components/notifications/EmptyNotifications';
import { deleteNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notifications';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search: '',
  type:   'all',
  sort:   'newest',
};

// ─── Notifications page ───────────────────────────────────────────────────────

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await listNotifications({ limit: 100 });
        if (!active) return;
        setNotifications(result.notifications || []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load notifications');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange    = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear     = () => setFilters(DEFAULT_FILTERS);

  const handleMarkRead  = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete    = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ── Derived values ───────────────────────────────────────────────────────────

  const hasActive =
    filters.search !== DEFAULT_FILTERS.search ||
    filters.type   !== DEFAULT_FILTERS.type   ||
    filters.sort   !== DEFAULT_FILTERS.sort;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    let list = [...notifications];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q)       ||
          n.description.toLowerCase().includes(q) ||
          (n.auctionTitle ?? '').toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      list = list.filter((n) => n.type === filters.type);
    }

    switch (filters.sort) {
      case 'oldest':
        list = [...list].reverse();
        break;
      case 'unread':
        list = [
          ...list.filter((n) => !n.read),
          ...list.filter((n) =>  n.read),
        ];
        break;
      case 'newest':
      default:
        break;
    }

    return list;
  }, [notifications, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your auctions and bids."
        breadcrumbs={[
          { label: 'Home',      href: '/'          },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger-100 px-3 py-1.5 text-sm font-semibold text-danger">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
                </span>
                {unreadCount} unread
              </span>
            )}

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text-secondary shadow-card transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Mark all read
              </button>
            )}
          </div>
        }
      />

      {loading && <p className="text-sm text-text-muted">Loading notifications…</p>}
      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Summary cards ── */}
      <NotificationSummaryCards notifications={notifications} />

      {/* ── Filters ── */}
      <NotificationFilters
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {/* ── Results info ── */}
      {!loading && notifications.length > 0 && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text-primary">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-text-primary">{notifications.length}</span>
            {' '}notifications
            {hasActive && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none"
              >
                (clear filters)
              </button>
            )}
          </p>

          {/* Active type chip */}
          {filters.type !== 'all' && (
            <span className="hidden items-center gap-1 rounded-full border border-secondary-600/30 bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-600 sm:flex">
              {filters.type.replace('_', ' ')}
              <button
                type="button"
                onClick={() => handleChange('type', 'all')}
                aria-label="Remove type filter"
                className="ml-0.5 hover:text-text-primary focus-visible:outline-none"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* ── List or empty state ── */}
      {!loading && notifications.length === 0 ? (
        <EmptyNotifications onReset={handleClear} allGone />
      ) : filtered.length === 0 ? (
        <EmptyNotifications onReset={handleClear} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Notifications;
