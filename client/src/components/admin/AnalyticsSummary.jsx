import { useEffect, useState } from 'react';
import DashboardCard from '../layout/DashboardCard';
import { getAdminAnalytics } from '../../api/admin';
import { currency, fmtPKR } from '../../utils/currency';

const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const UsersIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const LiveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const SoldIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {[1,2,3,4].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
          <div className="h-4 w-28 rounded shimmer-bg motion-safe:animate-shimmer mb-3" />
          <div className="h-8 w-20 rounded shimmer-bg motion-safe:animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

function AnalyticsSummary() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminAnalytics()
      .then((res) => { if (active) setData(res); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <Skeleton />;

  const ov = data?.overview ?? {};

  const cards = [
    {
      label:     'Total Revenue',
      value:     `${currency(ov.totalRevenue ?? 0)} · ≈ ${fmtPKR(ov.totalRevenue ?? 0)}`,
      iconBg:    'bg-accent-100',
      iconColor: 'text-accent-600',
      icon:      RevenueIcon,
    },
    {
      label:     'Active Users',
      value:     (ov.totalUsers ?? 0).toLocaleString(),
      iconBg:    'bg-secondary-100',
      iconColor: 'text-secondary-600',
      icon:      UsersIcon,
    },
    {
      label:     'Live Auctions',
      value:     String(ov.activeAuctions ?? 0),
      iconBg:    'bg-success-100',
      iconColor: 'text-success',
      icon:      LiveIcon,
    },
    {
      label:     'Total Auctions',
      value:     (ov.totalAuctions ?? 0).toLocaleString(),
      iconBg:    'bg-primary-900/30',
      iconColor: 'text-primary-300',
      icon:      SoldIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {cards.map((card) => <DashboardCard key={card.label} {...card} />)}
    </div>
  );
}

export default AnalyticsSummary;
