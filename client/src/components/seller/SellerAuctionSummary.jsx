import DashboardCard from '../layout/DashboardCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const LiveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DraftIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SoldIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ─── SellerAuctionSummary ─────────────────────────────────────────────────────

/**
 * @param {Array} auctions – the live (post-delete) auctions array
 */
function SellerAuctionSummary({ auctions }) {
  const total = auctions.length;
  const live  = auctions.filter((a) => a.status === 'live' || a.status === 'ending_soon').length;
  const draft = auctions.filter((a) => a.status === 'draft').length;
  const sold  = auctions.filter((a) => a.status === 'sold').length;

  const CARDS = [
    {
      label:    'Total Auctions',
      value:    String(total),
      trend:    null,
      trendDir: null,
      period:   'in your account',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     TotalIcon,
    },
    {
      label:    'Live',
      value:    String(live),
      trend:    live > 0 ? `${live} active` : null,
      trendDir: live > 0 ? 'up' : null,
      period:   'right now',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     LiveIcon,
    },
    {
      label:    'Draft',
      value:    String(draft),
      trend:    null,
      trendDir: null,
      period:   'not published yet',
      iconBg:   'bg-bg-elevated',
      iconColor:'text-text-muted',
      icon:     DraftIcon,
    },
    {
      label:    'Sold',
      value:    String(sold),
      trend:    '+2',
      trendDir: 'up',
      period:   'this month',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     SoldIcon,
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

export default SellerAuctionSummary;
