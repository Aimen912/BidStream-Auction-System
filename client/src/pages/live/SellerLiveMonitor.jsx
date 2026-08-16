import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuctionSocket } from '../../hooks/useAuctionSocket';
import { currency, fmtPKR } from '../../utils/currency';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const s = Math.floor(diff / 1000);
  if (s < 5)  return 'Just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function LiveCountdown({ endTime }) {
  const [left, setLeft] = useState('');
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    function tick() {
      const diff = new Date(endTime) - Date.now();
      if (diff <= 0) { setLeft('Ended'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setUrgent(diff < 60_000);
      setLeft(`${h > 0 ? `${String(h).padStart(2,'0')}:` : ''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return (
    <span className={['font-mono text-4xl font-bold tabular-nums', urgent ? 'text-danger' : 'text-white'].join(' ')}>
      {left}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={['rounded-2xl border p-5 shadow-card', accent ? 'border-secondary-600/20 bg-primary-900/20' : 'border-border bg-bg-card'].join(' ')}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
      <p className={['mt-1 text-2xl font-bold', accent ? 'text-auction' : 'text-text-primary'].join(' ')}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

function SellerLiveMonitor() {
  const { id } = useParams();
  const { auction, recentBids, participantCount, connected, error } = useAuctionSocket(id);

  // Compute average bid
  const avgBid = recentBids.length > 0
    ? Math.round(recentBids.reduce((s, b) => s + b.amount, 0) / recentBids.length)
    : 0;

  const isEnded = auction?.status === 'ended' || auction?.status === 'sold';

  if (!auction && !error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-secondary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <Link to="/seller/live" className="flex w-fit items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary no-underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to My Live Auctions
      </Link>

      {error && <div className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</div>}

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bg-surface via-bg-card to-bg-elevated p-8 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary-600/20 blur-3xl"/>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {isEnded ? (
                <span className="rounded-full bg-navy-500 px-2.5 py-1 text-xs font-bold text-white">ENDED</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-xs font-bold text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-75"/>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-card"/>
                  </span>
                  LIVE
                </span>
              )}
              {!connected && <span className="text-xs text-warning">● Reconnecting…</span>}
              {connected  && <span className="text-xs text-white/50">● Connected</span>}
            </div>
            <h1 className="text-2xl font-bold text-white">{auction?.title}</h1>
            <p className="text-sm text-white/60">{auction?.category?.name} · Seller Monitor</p>
          </div>
          {auction?.endTime && !isEnded && (
            <div className="text-right">
              <p className="text-xs text-white/60 mb-1">Time Remaining</p>
              <LiveCountdown endTime={auction.endTime} />
            </div>
          )}
        </div>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Current Bid"    value={currency(auction?.currentBid > 0 ? auction.currentBid : auction?.startingPrice)} sub={`≈ ${fmtPKR(auction?.currentBid > 0 ? auction.currentBid : auction?.startingPrice)}`} accent />
        <StatCard label="Total Bids"     value={auction?.bids ?? 0} />
        <StatCard label="Participants"   value={participantCount} sub="watching live" />
        <StatCard label="Highest Bidder" value={auction?.highestBidder?.name || '—'} />
        <StatCard label="Avg Bid"        value={avgBid > 0 ? currency(avgBid) : '—'} sub={avgBid > 0 ? `≈ ${fmtPKR(avgBid)}` : undefined} />
        <StatCard label="Starting Price" value={currency(auction?.startingPrice)} sub={`≈ ${fmtPKR(auction?.startingPrice)}`} />
      </div>

      {/* Live bid feed + Bid history */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Live feed */}
        <div className="rounded-2xl border border-border bg-bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
            <h2 className="text-sm font-bold text-text-primary">Live Bid Feed</h2>
            <span className="text-xs text-text-muted">{recentBids.length} bids</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentBids.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">Waiting for bids…</p>
            ) : (
              recentBids.map((b, i) => (
                <div key={b.id || i}
                  className={['flex items-center justify-between px-5 py-3 border-b border-border-subtle last:border-0', i === 0 ? 'bg-primary-900/20' : ''].join(' ')}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-600 to-primary-700 text-xs font-bold text-white">
                      {(b.bidder || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {b.bidder || 'Buyer'}
                        {i === 0 && <span className="ml-2 rounded-full bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">Leading</span>}
                      </p>
                      <p className="text-[11px] text-text-muted">{timeAgo(b.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                      <p className="text-sm font-bold text-auction">{currency(b.amount)}</p>
                      <p className="text-[10px] text-text-muted">≈ {fmtPKR(b.amount)}</p>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bid progression chart — simple bar list */}
        <div className="rounded-2xl border border-border bg-bg-card shadow-card">
          <div className="border-b border-border-subtle px-5 py-3">
            <h2 className="text-sm font-bold text-text-primary">Bid Progression</h2>
            <p className="text-xs text-text-muted">Most recent bids (highest → lowest)</p>
          </div>
          <div className="max-h-80 overflow-y-auto px-5 py-4 flex flex-col gap-2">
            {recentBids.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">No bids yet</p>
            ) : (
              (() => {
                const maxAmt = Math.max(...recentBids.map((b) => b.amount));
                return recentBids.map((b, i) => {
                  const pct = maxAmt > 0 ? Math.round((b.amount / maxAmt) * 100) : 0;
                  return (
                    <div key={b.id || i} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-right text-xs font-bold text-auction">{currency(b.amount)}</span>
                      <div className="flex-1 rounded-full bg-bg-elevated h-3">
                        <div className="h-3 rounded-full bg-gradient-to-r from-secondary-600 to-primary-700 transition-all duration-500"
                          style={{ width: `${pct}%` }}/>
                      </div>
                      <span className="w-20 shrink-0 truncate text-xs text-text-muted">{b.bidder || '—'}</span>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>
      </div>

      {/* Auction ended state */}
      {isEnded && (
        <div className="rounded-2xl border border-success-100 bg-success-50 p-6 text-center">
          <p className="text-base font-bold text-success">🎉 Auction Completed!</p>
          {auction?.highestBidder?.name && (
            <p className="mt-1 text-sm text-text-secondary">
              Won by <span className="font-bold text-text-primary">{auction.highestBidder.name}</span> for{' '}
              <span className="font-bold text-success">{currency(auction.currentBid)}</span>
              <span className="ml-1 text-xs text-text-muted">· ≈ {fmtPKR(auction.currentBid)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SellerLiveMonitor;
