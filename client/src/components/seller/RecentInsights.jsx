import { useEffect, useState } from 'react';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';

const TYPE_CONFIG = {
  positive: {
    dot: 'bg-success', iconBg: 'bg-success-100', iconColor: 'text-success',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>,
  },
  neutral: {
    dot: 'bg-secondary-600', iconBg: 'bg-secondary-100', iconColor: 'text-secondary-600',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  },
  warning: {
    dot: 'bg-warning', iconBg: 'bg-warning-100', iconColor: 'text-warning',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function RecentInsights() {
  const [insights, setInsights] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let active = true;
    getSellerDashboard()
      .then(({ stats: s, recentAuctions }) => {
        if (!active) return;

        const items = [];
        const auctions = recentAuctions || [];

        // Revenue insight
        if ((s?.totalRevenue ?? 0) > 0) {
          items.push({
            id: 'rev', type: 'positive',
            text: `Your total revenue is ${currency(s.totalRevenue)} · ≈ ${fmtPKR(s.totalRevenue)}. Keep it up!`,
            time: 'All time',
          });
        }

        // Conversion insight
        const total = s?.totalAuctions ?? 0;
        const sold  = s?.soldAuctions  ?? 0;
        if (total > 0) {
          const rate = Math.round((sold / total) * 100);
          items.push({
            id: 'conv', type: rate >= 50 ? 'positive' : 'warning',
            text: rate >= 50
              ? `${rate}% conversion rate — your auctions sell well.`
              : `${rate}% conversion rate. Consider lowering reserve prices.`,
            time: 'Based on all auctions',
          });
        }

        // Live auctions insight
        const live = s?.liveAuctions ?? 0;
        if (live > 0) {
          items.push({
            id: 'live', type: 'neutral',
            text: `You have ${live} auction${live !== 1 ? 's' : ''} currently live.`,
            time: 'Right now',
          });
        }

        // Recent auction insight
        if (auctions.length > 0) {
          const latest = auctions[0];
          items.push({
            id: 'latest', type: 'neutral',
            text: `"${latest.title}" ${latest.status === 'sold' ? `sold for $${(latest.currentBid||0).toLocaleString()}` : `is ${latest.status}`}.`,
            time: timeAgo(latest.updatedAt || latest.createdAt),
          });
        }

        // Bids insight
        const bids = s?.totalBidsReceived ?? 0;
        if (bids > 0) {
          items.push({
            id: 'bids', type: 'positive',
            text: `You've received ${bids} total bid${bids !== 1 ? 's' : ''} across all auctions.`,
            time: 'All time',
          });
        }

        // If no data yet
        if (items.length === 0) {
          items.push({
            id: 'empty', type: 'neutral',
            text: 'Create your first auction to start seeing insights here.',
            time: 'Now',
          });
        }

        setInsights(items);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Recent Insights</h3>
        <p className="text-xs text-text-muted">Auto-generated business intelligence</p>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">
          {[1,2,3].map((i) => <div key={i} className="h-10 rounded-xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {insights.map((item) => {
            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.neutral;
            return (
              <li key={item.id} className="flex items-start gap-3 px-6 py-3.5 transition-colors duration-150 hover:bg-bg-surface">
                <span className={['mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', cfg.iconBg, cfg.iconColor].join(' ')}>
                  {cfg.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-text-secondary">{item.text}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{item.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecentInsights;
