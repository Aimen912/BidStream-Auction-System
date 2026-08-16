import { useEffect, useState } from 'react';
import DashboardCard    from '../layout/DashboardCard';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';

const AuctionsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
    <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
    <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
  </svg>
);
const SalesIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const RateIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </svg>
);

function SellerStatistics() {
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
            <div className="h-4 w-28 rounded shimmer-bg motion-safe:animate-shimmer mb-3"/><div className="h-8 w-20 rounded shimmer-bg motion-safe:animate-shimmer"/>
          </div>
        ))}
      </div>
    );
  }

  const totalAuctions  = stats?.totalAuctions  ?? 0;
  const soldAuctions   = stats?.soldAuctions   ?? 0;
  const revenue        = stats?.totalRevenue   ?? 0;
  const conversionRate = totalAuctions > 0 ? Math.round((soldAuctions / totalAuctions) * 100) : 0;

  const CARDS = [
    { label: 'Total Auctions', value: String(totalAuctions), iconBg: 'bg-primary-900/30',   iconColor: 'text-primary-300',   icon: AuctionsIcon },
    { label: 'Total Sales',    value: String(soldAuctions),  iconBg: 'bg-success-100',     iconColor: 'text-success',       icon: SalesIcon    },
    { label: 'Total Revenue',  value: `${currency(revenue)} · ≈ ${fmtPKR(revenue)}`, iconBg: 'bg-accent-100', iconColor: 'text-accent-600', icon: RevenueIcon },
    { label: 'Conversion Rate',value: `${conversionRate}%`, iconBg: 'bg-secondary-100', iconColor: 'text-secondary-600', icon: RateIcon     },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {CARDS.map((card) => <DashboardCard key={card.label} {...card} />)}
    </div>
  );
}

export default SellerStatistics;
