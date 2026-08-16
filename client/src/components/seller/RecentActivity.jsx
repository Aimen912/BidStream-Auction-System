import { useEffect, useState } from 'react';
import { listMyBids } from '../../api/bids';
import { listMyAuctions } from '../../api/auctions';

const TYPE_ICONS = {
  bid: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  auction: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  sold: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function RecentActivity() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // Combine recent auction creations + recent bids received on seller's auctions
        const [auctionsRes] = await Promise.all([
          listMyAuctions({ limit: 5, sort: 'newest' }),
        ]);

        const events = (auctionsRes.auctions || []).map((a) => ({
          id:    a._id,
          type:  a.status === 'sold' ? 'sold' : 'auction',
          text:  a.status === 'sold'
            ? `"${a.title}" sold for $${(a.currentBid || 0).toLocaleString()}`
            : `Auction "${a.title}" is ${a.status}`,
          time:  timeAgo(a.updatedAt || a.createdAt),
          color: a.status === 'sold' ? 'bg-success' : a.status === 'live' ? 'bg-secondary-600' : 'bg-accent-600',
        }));

        if (active) setItems(events);
      } catch {
        // silent
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-5 py-3">
        <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
        <p className="mt-0.5 text-xs text-text-muted">Latest events across your auctions</p>
      </div>

      {loading ? (
        <div className="space-y-2.5 p-5">
          {[1,2,3].map((i) => <div key={i} className="h-9 rounded-lg shimmer-bg motion-safe:animate-shimmer" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-text-muted">No recent activity</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 px-5 py-2.5 transition-colors duration-150 hover:bg-bg-surface">
              <span className={['mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white', item.color].join(' ')}>
                {TYPE_ICONS[item.type] ?? TYPE_ICONS.auction}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug text-text-secondary">{item.text}</p>
                <p className="mt-0.5 text-[10px] text-text-muted">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentActivity;
