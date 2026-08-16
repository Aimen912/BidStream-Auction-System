import DashboardCard from '../layout/DashboardCard';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Icons ────────────────────────────────────────────────────────────────────

const ActiveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const WonIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const LostIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9"  y1="9" x2="15" y2="15" />
  </svg>
);

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

// ─── BidSummaryCards ──────────────────────────────────────────────────────────

/**
 * 4-card summary row derived from the full bids list.
 *
 * @param {Array} bids – full unfiltered BIDS array
 */
function BidSummaryCards({ bids }) {
  const active  = bids.filter((b) => b.status === 'winning' || b.status === 'outbid' || b.status === 'ending_soon').length;
  const won     = bids.filter((b) => b.status === 'won').length;
  const lost    = bids.filter((b) => b.status === 'lost').length;
  const total   = bids.reduce((sum, b) => sum + b.yourBid, 0);

  const CARDS = [
    {
      label:    'Active Bids',
      value:    String(active),
      trend:    '+3',
      trendDir: 'up',
      period:   'this week',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     ActiveIcon,
    },
    {
      label:    'Auctions Won',
      value:    String(won),
      trend:    '+2',
      trendDir: 'up',
      period:   'this month',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     WonIcon,
    },
    {
      label:    'Auctions Lost',
      value:    String(lost),
      trend:    '+1',
      trendDir: 'down',
      period:   'this month',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     LostIcon,
    },
    {
      label:    'Total Amount Bid',
      value:    `${currency(total)} · ≈ ${fmtPKR(total)}`,
      trend:    '+12.4%',
      trendDir: 'up',
      period:   'vs last month',
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     TotalIcon,
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

export default BidSummaryCards;
