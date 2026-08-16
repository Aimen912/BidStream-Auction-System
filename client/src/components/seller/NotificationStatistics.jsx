import DashboardCard from '../layout/DashboardCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const UnreadIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ReadIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PriorityIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TodayIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

// ─── NotificationStatistics ───────────────────────────────────────────────────

/**
 * 4-card summary derived from the live (post-delete) notifications array.
 *
 * @param {Array} notifications – current notifications array
 */
function NotificationStatistics({ notifications }) {
  const unread   = notifications.filter((n) => !n.read).length;
  const read     = notifications.filter((n) =>  n.read).length;
  const highPrio = notifications.filter((n) =>  n.priority === 'high' && !n.read).length;
  const today    = notifications.filter((n) =>
    n.time === 'Today'        ||
    n.time.includes('mins')   ||
    n.time.includes('hour')   ||
    n.time.includes('min ago')
  ).length;

  const CARDS = [
    {
      label:    'Unread',
      value:    String(unread),
      trend:    unread > 0 ? `${unread} pending` : null,
      trendDir: unread > 0 ? 'down' : null,
      period:   'need attention',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     UnreadIcon,
    },
    {
      label:    'Read',
      value:    String(read),
      trend:    null,
      trendDir: null,
      period:   'already seen',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     ReadIcon,
    },
    {
      label:    'High Priority',
      value:    String(highPrio),
      trend:    highPrio > 0 ? 'Act now' : null,
      trendDir: highPrio > 0 ? 'down' : null,
      period:   'unread urgent',
      iconBg:   'bg-warning-100',
      iconColor:'text-warning',
      icon:     PriorityIcon,
    },
    {
      label:    'Today',
      value:    String(today),
      trend:    '+' + today,
      trendDir: 'up',
      period:   'received today',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     TodayIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {CARDS.map((card) => (
        <DashboardCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default NotificationStatistics;
