import { useEffect, useState } from 'react';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';

function StatTile({ label, value, sub, iconBg, iconColor, icon }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-bg-card p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-dropdown">
      <span className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', iconBg, iconColor].join(' ')}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-text-primary">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-text-muted">{sub}</p>}
      </div>
    </div>
  );
}

function AuctionPerformance() {
  const [stats,    setStats]    = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let active = true;
    getSellerDashboard()
      .then(({ stats: s, recentAuctions, topAuctions }) => {
        if (!active) return;
        setStats(s);
        setAuctions(recentAuctions || topAuctions || []);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <div className="h-4 w-40 rounded shimmer-bg motion-safe:animate-shimmer"/>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-20 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      </div>
    );
  }

  const totalAuctions   = stats?.totalAuctions       ?? 0;
  const soldAuctions    = stats?.soldAuctions         ?? 0;
  const liveAuctions    = stats?.liveAuctions         ?? 0;
  const totalBids       = stats?.totalBidsReceived    ?? 0;
  const totalRevenue    = stats?.totalRevenue         ?? 0;
  const avgSalePrice    = stats?.avgSalePrice         ?? 0;
  const expiredAuctions = Math.max(0, totalAuctions - soldAuctions - liveAuctions);
  const avgBids         = totalAuctions > 0 ? Math.round(totalBids / totalAuctions) : 0;

  // Find highest winning bid from top auctions
  const highestBid = auctions.reduce((max, a) => Math.max(max, a.currentBid || 0), 0);
  const topAuction = auctions.find((a) => (a.currentBid || 0) === highestBid);

  const TILES = [
    {
      label: 'Total Auctions',
      value: String(totalAuctions),
      sub:   'all time',
      iconBg: 'bg-primary-900/30', iconColor: 'text-primary-300',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    },
    {
      label: 'Successful Sales',
      value: String(soldAuctions),
      sub:   totalAuctions > 0 ? `${Math.round((soldAuctions/totalAuctions)*100)}% success rate` : '0% success rate',
      iconBg: 'bg-success-100', iconColor: 'text-success',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    },
    {
      label: 'Expired / Unsold',
      value: String(expiredAuctions),
      sub:   expiredAuctions > 0 ? 'consider lowering reserve' : 'great conversion!',
      iconBg: 'bg-danger-100', iconColor: 'text-danger',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    },
    {
      label: 'Avg. Bids per Auction',
      value: String(avgBids),
      sub:   'buyer engagement',
      iconBg: 'bg-secondary-100', iconColor: 'text-secondary-600',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
    {
      label: 'Highest Winning Bid',
      value: highestBid > 0 ? `${currency(highestBid)} · ≈ ${fmtPKR(highestBid)}` : '—',
      sub:   topAuction?.title ? topAuction.title.slice(0, 22) + (topAuction.title.length > 22 ? '…' : '') : 'no sales yet',
      iconBg: 'bg-accent-100', iconColor: 'text-accent-600',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>,
    },
    {
      label: 'Average Winning Bid',
      value: avgSalePrice > 0 ? `${currency(Math.round(avgSalePrice))} · ≈ ${fmtPKR(Math.round(avgSalePrice))}` : '—',
      sub:   'across all sold auctions',
      iconBg: 'bg-primary-900/30', iconColor: 'text-primary-300',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Auction Performance</h3>
        <p className="text-xs text-text-muted">Detailed breakdown of auction outcomes</p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => <StatTile key={tile.label} {...tile}/>)}
      </div>
    </div>
  );
}

export default AuctionPerformance;
