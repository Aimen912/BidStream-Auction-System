import { useEffect, useState } from 'react';
import DashboardCard from '../layout/DashboardCard';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';
import { useSocketEvent } from '../../context/SocketContext';

const ActiveAuctionsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
  </svg>
);
const SoldIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const RevenueIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const BidsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

function Skeleton() {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
      <div className="h-4 w-24 rounded shimmer-bg motion-safe:animate-shimmer mb-3" />
      <div className="h-8 w-16 rounded shimmer-bg motion-safe:animate-shimmer" />
    </div>
  );
}

function SellerOverviewCards() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    getSellerDashboard()
      .then(({ stats: s }) => setStats(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  // ── Socket: refresh stats when new bids or orders come in ─────────────────
  useSocketEvent('bid_update',    () => { load(); });
  useSocketEvent('auction_ended', () => { load(); });
  useSocketEvent('new_order',     () => { load(); });

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1,2,3,4].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  const cards = [
    {
      label:    'Active Auctions',
      value:    String(stats?.liveAuctions  ?? 0),
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     ActiveAuctionsIcon,
    },
    {
      label:    'Items Sold',
      value:    String(stats?.soldAuctions  ?? 0),
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     SoldIcon,
    },
    {
      label:    'Total Revenue',
      value:    `${currency(stats?.totalRevenue ?? 0)} · ≈ ${fmtPKR(stats?.totalRevenue ?? 0)}`,
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     RevenueIcon,
    },
    {
      label:    'Total Bids Received',
      value:    String(stats?.totalBidsReceived ?? 0),
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     BidsIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardCard key={card.label} {...card} className="!p-5" />
      ))}
    </div>
  );
}

export default SellerOverviewCards;
