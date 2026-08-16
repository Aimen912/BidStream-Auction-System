import { useEffect, useMemo, useState } from 'react';
import PageHeader             from '../../components/layout/PageHeader';
import NotificationStatistics from '../../components/seller/NotificationStatistics';
import NotificationFilter     from '../../components/seller/NotificationFilter';
import NotificationCard       from '../../components/seller/NotificationCard';
import EmptyNotifications     from '../../components/seller/EmptyNotifications';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../../api/notifications';

const DEFAULT_FILTERS = {
  search:   '',
  status:   'all',
  type:     'all',
  priority: 'all',
  sort:     'newest',
};

// Map backend notification to NotificationCard's expected shape
function mapNotification(n) {
  return {
    id:       n._id || n.id,
    type:     n.type     || 'system',
    title:    n.title    || 'Notification',
    message:  n.description || n.message || '',   // backend uses "description"
    time:     n.createdAt
      ? (() => {
          const diff = Date.now() - new Date(n.createdAt);
          const m = Math.floor(diff / 60_000);
          if (m < 1)  return 'Just now';
          if (m < 60) return `${m}m ago`;
          const h = Math.floor(m / 60);
          if (h < 24) return `${h}h ago`;
          return `${Math.floor(h / 24)}d ago`;
        })()
      : '—',
    read:     Boolean(n.read),
    priority: 'medium',   // backend has no priority — default to medium
  };
}

function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  // Load from real API
  useEffect(() => {
    let active = true;
    listNotifications({ limit: 100 })
      .then((res) => {
        if (!active) return;
        const raw = res.notifications || [];
        setNotifications(raw.map(mapNotification));
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load notifications');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleClear = () => setFilters(DEFAULT_FILTERS);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch { /* silent */ }
  };

  const hasActive =
    filters.search   !== DEFAULT_FILTERS.search   ||
    filters.status   !== DEFAULT_FILTERS.status   ||
    filters.type     !== DEFAULT_FILTERS.type     ||
    filters.priority !== DEFAULT_FILTERS.priority ||
    filters.sort     !== DEFAULT_FILTERS.sort;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    let list = [...notifications];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      );
    }

    if (filters.status === 'unread') list = list.filter((n) => !n.read);
    if (filters.status === 'read')   list = list.filter((n) =>  n.read);
    if (filters.type !== 'all')      list = list.filter((n) => n.type === filters.type);

    switch (filters.sort) {
      case 'oldest':   list = list.reverse(); break;
      case 'unread':   list = list.sort((a, b) => Number(a.read) - Number(b.read)); break;
      default:         break; // newest — already ordered by API
    }

    return list;
  }, [notifications, filters]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on bids, sales, and platform activity."
        breadcrumbs={[
          { label: 'Home',             href: '/'                 },
          { label: 'Seller Dashboard', href: '/seller/dashboard' },
          { label: 'Notifications'                               },
        ]}
        actions={
          unreadCount > 0 && (
            <button type="button" onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Mark All Read
            </button>
          )
        }
      />

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      <NotificationStatistics notifications={notifications} />

      <NotificationFilter
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {/* Results summary */}
      {!loading && notifications.length > 0 && (
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-text-primary">{filtered.length}</span> of{' '}
          <span className="font-semibold text-text-primary">{notifications.length}</span> notifications
          {unreadCount > 0 && (
            <span className="ml-2 font-semibold text-secondary-600">· {unreadCount} unread</span>
          )}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-20 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyNotifications hasFilters={hasActive} onClear={handleClear} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerNotifications;
