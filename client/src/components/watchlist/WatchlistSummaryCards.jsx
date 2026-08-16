import DashboardCard from '../layout/DashboardCard';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Icons ────────────────────────────────────────────────────────────────────

const WatchingIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const EndingIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ValueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const RecentIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── WatchlistSummaryCards ────────────────────────────────────────────────────

/**
 * 4-card summary row derived from the current watchlist items array.
 * Accepts the live (post-remove) list so counts update when items are removed.
 *
 * @param {Array} items – current watchlist array (may be filtered by removals)
 */
function WatchlistSummaryCards({ items }) {
  const watching    = items.length;
  const endingSoon  = items.filter((i) => i.status === 'ending_soon').length;
  const highestVal  = items.length > 0
    ? Math.max(...items.map((i) => i.currentBid))
    : 0;
  const recentCount = items.filter((i) => i.addedDaysAgo === 0).length;

  const CARDS = [
    {
      label:    'Watching',
      value:    String(watching),
      trend:    '+4',
      trendDir: 'up',
      period:   'this week',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     WatchingIcon,
    },
    {
      label:    'Ending Soon',
      value:    String(endingSoon),
      trend:    endingSoon > 0 ? 'Act fast!' : null,
      trendDir: endingSoon > 0 ? 'down' : null,
      period:   'in your list',
      iconBg:   'bg-warning-100',
      iconColor:'text-warning',
      icon:     EndingIcon,
    },
    {
      label:    'Highest Value',
      value:    `${currency(highestVal)} · ≈ ${fmtPKR(highestVal)}`,
      trend:    '+8.2%',
      trendDir: 'up',
      period:   'vs last week',
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     ValueIcon,
    },
    {
      label:    'Recently Added',
      value:    String(recentCount),
      trend:    'Today',
      trendDir: null,
      period:   'items added',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     RecentIcon,
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

export default WatchlistSummaryCards;
