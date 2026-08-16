import { useEffect, useState } from 'react';
import DashboardCard from '../layout/DashboardCard';
import { getAdminDashboard } from '../../api/admin';
import { currency, fmtPKR } from '../../utils/currency';
import { useSocketEvent } from '../../context/SocketContext';

const UsersIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const AuctionsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const BidsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

function Skeleton() {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
      <div className="h-4 w-28 rounded shimmer-bg motion-safe:animate-shimmer mb-3" />
      <div className="h-8 w-20 rounded shimmer-bg motion-safe:animate-shimmer" />
    </div>
  );
}

function AdminStatistics() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    getAdminDashboard()
      .then(({ stats: s }) => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  // ── Socket: refresh stats on any bid, order or auction change ─────────────
  useSocketEvent('bid_update',      () => { load(); });
  useSocketEvent('auction_ended',   () => { load(); });
  useSocketEvent('new_order',       () => { load(); });
  useSocketEvent('auction_went_live', () => { load(); });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1,2,3,4].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      label:     'Total Users',
      value:     (stats?.totalUsers ?? 0).toLocaleString(),
      iconBg:    'bg-secondary-100',
      iconColor: 'text-secondary-600',
      icon:      UsersIcon,
    },
    {
      label:     'Active Auctions',
      value:     String(stats?.liveAuctions ?? 0),
      iconBg:    'bg-success/10',
      iconColor: 'text-success',
      icon:      AuctionsIcon,
    },
    {
      label:     'Total Bids',
      value:     (stats?.totalBids ?? 0).toLocaleString(),
      iconBg:    'bg-danger/10',
      iconColor: 'text-danger',
      icon:      BidsIcon,
    },
    {
      label:     'Platform Revenue',
      value:     `${currency(stats?.totalRevenue ?? 0)} · ≈ ${fmtPKR(stats?.totalRevenue ?? 0)}`,
      iconBg:    'bg-accent-100',
      iconColor: 'text-accent-600',
      icon:      RevenueIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCard
          key={card.label}
          {...card}
          // Slightly more compact than the default p-6 / text-3xl
          className="!p-5 [&_p.text-3xl]:text-2xl"
        />
      ))}
    </div>
  );
}

export default AdminStatistics;
