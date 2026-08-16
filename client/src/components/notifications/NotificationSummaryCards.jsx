import DashboardCard from '../layout/DashboardCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const UnreadIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const AuctionIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BidIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const SystemIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── NotificationSummaryCards ─────────────────────────────────────────────────

/**
 * @param {Array} notifications – the live (post-delete) notifications array
 */
function NotificationSummaryCards({ notifications }) {
  const unread        = notifications.filter((n) => !n.read).length;
  const auctionTypes  = ['auction_won', 'auction_lost', 'ending_soon'];
  const auctionAlerts = notifications.filter((n) => auctionTypes.includes(n.type)).length;
  const bidUpdates    = notifications.filter((n) => n.type === 'outbid').length;
  const systemAlerts  = notifications.filter((n) => n.type === 'system' || n.type === 'payment').length;

  const CARDS = [
    {
      label:    'Unread',
      value:    String(unread),
      trend:    unread > 0 ? `${unread} new` : null,
      trendDir: unread > 0 ? 'down' : null,
      period:   'need attention',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     UnreadIcon,
    },
    {
      label:    'Auction Updates',
      value:    String(auctionAlerts),
      trend:    '+2',
      trendDir: 'up',
      period:   'today',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     AuctionIcon,
    },
    {
      label:    'Bid Updates',
      value:    String(bidUpdates),
      trend:    bidUpdates > 0 ? 'Act now' : null,
      trendDir: bidUpdates > 0 ? 'down' : null,
      period:   'outbid alerts',
      iconBg:   'bg-warning-100',
      iconColor:'text-warning',
      icon:     BidIcon,
    },
    {
      label:    'System Alerts',
      value:    String(systemAlerts),
      trend:    null,
      trendDir: null,
      period:   'this week',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     SystemIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => (
        <DashboardCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default NotificationSummaryCards;
