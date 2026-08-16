import { useEffect, useState } from 'react';
import { listMyAuctions } from '../../api/auctions';

const TYPE_CONFIG = {
  sale:    { iconBg: 'bg-success-100',     iconColor: 'text-success',       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  live:    { iconBg: 'bg-secondary-100', iconColor: 'text-secondary-600', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  created: { iconBg: 'bg-primary-900/30',   iconColor: 'text-primary-300',   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  ended:   { iconBg: 'bg-bg-elevated',      iconColor: 'text-text-muted',      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
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

function SellerActivityTimeline() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listMyAuctions({ limit: 10, sort: 'newest' })
      .then(({ auctions }) => {
        if (!active) return;
        const list = (auctions || []).map((a) => {
          const type = a.status === 'sold' ? 'sale'
            : a.status === 'live' || a.status === 'ending_soon' ? 'live'
            : a.status === 'ended' ? 'ended'
            : 'created';

          const text = a.status === 'sold'
            ? `"${a.title}" sold for $${(a.currentBid || 0).toLocaleString()}`
            : a.status === 'live'
            ? `"${a.title}" is now live — ${a.bids || 0} bid${(a.bids||0) !== 1 ? 's' : ''} so far`
            : a.status === 'ending_soon'
            ? `"${a.title}" is ending soon — ${a.bids || 0} bids`
            : a.status === 'ended'
            ? `"${a.title}" ended with ${a.bids || 0} bids`
            : `"${a.title}" created (${a.status})`;

          return {
            id:   a._id || a.id,
            type,
            text,
            time: timeAgo(a.updatedAt || a.createdAt),
          };
        });
        setItems(list);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Recent Activity</h3>
        <p className="text-xs text-text-muted">Your latest seller actions</p>
      </div>

      {loading ? (
        <div className="space-y-4 p-6">
          {[1,2,3,4].map((i) => <div key={i} className="h-10 rounded-xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-text-muted">No activity yet — create your first auction!</p>
        </div>
      ) : (
        <div className="relative px-6 py-5">
          <div className="absolute left-[2.6rem] top-5 bottom-5 w-px bg-bg-elevated" aria-hidden="true"/>
          <div className="flex flex-col gap-5">
            {items.map((item) => {
              const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.created;
              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  <div className={['relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-bg-card shadow-card', cfg.iconBg, cfg.iconColor].join(' ')}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-snug text-text-secondary">{item.text}</p>
                      <span className="shrink-0 text-xs text-text-muted whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerActivityTimeline;
