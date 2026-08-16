import { useEffect, useState } from 'react';
import DashboardCard from '../layout/DashboardCard';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';

const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const ActiveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const SalesIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const ConversionIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {[1,2,3,4].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
          <div className="h-4 w-28 rounded shimmer-bg motion-safe:animate-shimmer mb-3"/>
          <div className="h-8 w-20 rounded shimmer-bg motion-safe:animate-shimmer"/>
        </div>
      ))}
    </div>
  );
}

function AnalyticsSummaryCards() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSellerDashboard()
      .then(({ stats: s }) => { if (active) setStats(s); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <Skeleton />;

  const totalRevenue   = stats?.totalRevenue   ?? 0;
  const liveAuctions   = stats?.liveAuctions   ?? 0;
  const soldAuctions   = stats?.soldAuctions   ?? 0;
  const totalAuctions  = stats?.totalAuctions  ?? 0;
  const conversionRate = totalAuctions > 0
    ? Math.round((soldAuctions / totalAuctions) * 100)
    : 0;

  const CARDS = [
    {
      label:    'Total Revenue',
      value:    `${currency(totalRevenue)} · ≈ ${fmtPKR(totalRevenue)}`,
      trend:    null,
      trendDir: null,
      period:   'all time',
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     RevenueIcon,
    },
    {
      label:    'Active Auctions',
      value:    String(liveAuctions),
      trend:    null,
      trendDir: null,
      period:   'live now',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     ActiveIcon,
    },
    {
      label:    'Completed Sales',
      value:    String(soldAuctions),
      trend:    null,
      trendDir: null,
      period:   'all time',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     SalesIcon,
    },
    {
      label:    'Conversion Rate',
      value:    `${conversionRate}%`,
      trend:    null,
      trendDir: null,
      period:   'sold / total',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     ConversionIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {CARDS.map((card) => <DashboardCard key={card.label} {...card} />)}
    </div>
  );
}

export default AnalyticsSummaryCards;
