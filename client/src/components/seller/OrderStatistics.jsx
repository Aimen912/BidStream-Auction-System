import DashboardCard from '../layout/DashboardCard';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CompletedIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const PendingIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// ─── OrderStatistics ──────────────────────────────────────────────────────────

/**
 * 4-card summary derived from the live orders array.
 *
 * @param {Array} orders – current (post-filter) orders array
 */
function OrderStatistics({ orders }) {
  const total     = orders.length;
  const completed = orders.filter((o) => o.deliveryStatus === 'delivered').length;
  const pending   = orders.filter((o) => o.deliveryStatus === 'processing' || o.deliveryStatus === 'shipped').length;
  const revenue   = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.winningBid, 0);

  const CARDS = [
    {
      label:    'Total Orders',
      value:    String(total),
      trend:    '+3',
      trendDir: 'up',
      period:   'this month',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     TotalIcon,
    },
    {
      label:    'Completed',
      value:    String(completed),
      trend:    '+2',
      trendDir: 'up',
      period:   'delivered',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     CompletedIcon,
    },
    {
      label:    'Pending Deliveries',
      value:    String(pending),
      trend:    pending > 0 ? 'In progress' : null,
      trendDir: pending > 0 ? 'down' : null,
      period:   'to dispatch',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     PendingIcon,
    },
    {
      label:    'Total Revenue',
      value:    `${currency(revenue)} · ≈ ${fmtPKR(revenue)}`,
      trend:    '+18.4%',
      trendDir: 'up',
      period:   'vs last month',
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     RevenueIcon,
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

export default OrderStatistics;
