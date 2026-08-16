import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuctionSocket } from '../../hooks/useAuctionSocket';
import { placeBid } from '../../api/auctions';
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
    <span className={['font-mono text-3xl font-bold tabular-nums', urgent ? 'text-danger' : 'text-white'].join(' ')}>
      {left}
    </span>
  );
}

function LiveAuctionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { auction, recentBids, participantCount, connected, error, auctionEnded } = useAuctionSocket(id);

  const [bidAmount,  setBidAmount]  = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError,   setBidError]   = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  // Increments on each new incoming bid to re-trigger the flash animation
  const [bidFlashKey, setBidFlashKey] = useState(0);

  // Set default bid amount
  useEffect(() => {
    if (!auction) return;
    const min = auction.currentBid > 0
      ? auction.currentBid + (auction.minIncrement || 1)
      : auction.startingPrice || 0;
    setBidAmount(String(min));
  }, [auction?.currentBid]);

  // Flash the bid indicator whenever a new bid arrives
  useEffect(() => {
    if (recentBids.length > 0) {
      setBidFlashKey((k) => k + 1);
    }
  }, [recentBids.length]);

  async function handleBid(e) {
    e.preventDefault();
    setBidError(''); setBidSuccess('');
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) { setBidError('Enter a valid amount'); return; }
    const minBid = auction.currentBid > 0
      ? auction.currentBid + (auction.minIncrement || 1)
      : auction.startingPrice;
    if (amount < minBid) {
      setBidError(`Minimum bid is ${currency(minBid)}`);
      return;
    }
    setBidLoading(true);
    try {
      await placeBid(id, amount);
      setBidSuccess(`Bid of ${currency(amount)} placed!`);
      setTimeout(() => setBidSuccess(''), 3000);
    } catch (err) {
      setBidError(err?.response?.data?.message || 'Bid failed');
    } finally { setBidLoading(false); }
  }

  const minBid = auction
    ? (auction.currentBid > 0
        ? auction.currentBid + (auction.minIncrement || 1)
        : auction.startingPrice)
    : 0;

  const myId = user?._id || user?.id;
  const isHighestBidder = auction?.highestBidder?.id === myId ||
    auction?.highestBidder?._id === myId ||
    String(auction?.highestBidder) === String(myId);

  const isEnded = auctionEnded !== null ||
    auction?.status === 'ended' || auction?.status === 'sold';

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
    <div className="flex flex-col gap-4">
      {/* Back */}
      <Link to="/live" className="flex w-fit items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary no-underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Live Auctions
      </Link>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">

        {/* ── Left: Image + Bid Feed ── */}
        <div className="flex flex-col gap-5">

          {/* Hero image + live header */}
          <div className="relative overflow-hidden rounded-2xl bg-bg-surface">
            {auction?.images?.[0] && (
              <img src={auction.images[0]} alt={auction?.title}
                className="h-64 w-full object-cover opacity-40 bg-bg-card"/>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"/>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-danger"/>
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-widest">Live Auction</span>
              </div>
              <h1 className="text-xl font-bold text-white">{auction?.title}</h1>
              {auction?.endTime && <LiveCountdown endTime={auction.endTime} />}
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-white/60">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="inline mr-1" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {participantCount} watching
                </span>
                <span className="text-xs text-white/60">{auction?.bids ?? 0} bids</span>
                {!connected && <span className="text-xs text-warning">● Reconnecting…</span>}
                {connected  && <span className="text-xs text-success">● Connected</span>}
              </div>
            </div>
          </div>

          {/* Live bid feed */}
          <div className="rounded-2xl border border-border bg-bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
              <h2 className="text-sm font-bold text-text-primary">Live Bid Feed</h2>
              <span className="text-xs text-text-muted">{recentBids.length} bids</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {recentBids.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">No bids yet. Be the first!</p>
              ) : (
                recentBids.map((b, i) => (
                  <div key={b.id || i}
                    className={['flex items-center justify-between px-5 py-3 transition-colors border-b border-border-subtle last:border-0', i === 0 ? 'bg-primary-900/20' : 'hover:bg-bg-surface'].join(' ')}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-600 to-primary-700 text-xs font-bold text-white">
                        {(b.bidder || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {b.bidder || 'Anonymous'}
                          {i === 0 && <span className="ml-2 rounded-full bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">Highest</span>}
                        </p>
                        <p className="text-[11px] text-text-muted">{timeAgo(b.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-auction">
                      {currency(b.amount)}
                      <span className="block text-[10px] font-normal opacity-60">≈ {fmtPKR(b.amount)}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Bid Panel ── */}
        <div className="flex flex-col gap-4">

          {/* Current bid card */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {auction?.currentBid > 0 ? 'Current Bid' : 'Starting Price'}
            </p>
            <p
              key={bidFlashKey}
              className="mt-1 text-4xl font-bold text-auction motion-safe:animate-bid-flash rounded-lg"
            >
              {currency(auction?.currentBid > 0 ? auction.currentBid : auction?.startingPrice)}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              ≈ {fmtPKR(auction?.currentBid > 0 ? auction.currentBid : auction?.startingPrice)}
            </p>
            {auction?.highestBidder?.name && (
              <p className="mt-1 text-xs text-text-muted">
                Highest bidder: <span className="font-semibold text-text-secondary">{auction.highestBidder.name}</span>
              </p>
            )}
            {/* My status */}
            {auction?.currentBid > 0 && (
              <div className={['mt-3 rounded-xl px-4 py-2 text-xs font-semibold', isHighestBidder ? 'bg-success-100 text-success' : 'bg-danger-100 text-danger'].join(' ')}>
                {isHighestBidder ? '✓ You are the highest bidder' : '✗ You have been outbid'}
              </div>
            )}
          </div>

          {/* Auction stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Min Increment', value: currency(auction?.minIncrement || 1) },
              { label: 'Total Bids',    value: auction?.bids ?? 0 },
              { label: 'Participants',  value: participantCount },
              { label: 'Seller',        value: auction?.seller?.name || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-bg-card px-4 py-3 shadow-card">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className="mt-0.5 text-sm font-bold text-text-primary">{value}</p>
              </div>
            ))}
          </div>

          {/* Bid form / Ended state */}
          {!isEnded ? (
            <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
              <h2 className="mb-4 text-sm font-bold text-text-primary">Place Your Bid</h2>
              <form onSubmit={handleBid} className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">$</span>
                  <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid} step="0.01"
                    placeholder={`Min ${currency(minBid)}`}
                    className="h-12 w-full rounded-xl border border-border bg-bg-card pl-8 pr-4 text-sm font-semibold text-text-primary outline-none transition-all focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
                    required/>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-bg-surface px-3 py-2">
                  <span className="text-xs text-text-muted">Min bid</span>
                  <span className="text-xs font-bold text-auction">{currency(minBid)}</span>
                </div>
                {bidError && <p className="rounded-xl border border-danger/20 bg-danger-100 px-3 py-2 text-xs text-danger">{bidError}</p>}
                {bidSuccess && <p className="rounded-xl border border-success-100 bg-success-100 px-3 py-2 text-xs font-semibold text-success">{bidSuccess}</p>}
                <button type="submit" disabled={bidLoading || !connected}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-600 text-sm font-bold text-white shadow-card transition-all hover:bg-secondary-500 disabled:opacity-60 disabled:cursor-not-allowed">
                  {bidLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  )}
                  {bidLoading ? 'Placing…' : 'Place Bid'}
                </button>
              </form>
            </div>
          ) : (
            /* ── Auction ended overlay ── */
            <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card text-center">
              <div className="mb-3 text-4xl">🏆</div>
              <p className="text-base font-bold text-text-primary">Auction Ended</p>
              {(auctionEnded?.winnerName || auction?.highestBidder?.name) && (
                <>
                  <p className="mt-2 text-sm text-text-muted">
                    Won by{' '}
                    <span className="font-bold text-text-primary">
                      {auctionEnded?.winnerName || auction?.highestBidder?.name}
                    </span>
                  </p>
                  <p className="mt-1 text-xl font-bold text-success">
                    {currency(auctionEnded?.winningBid || auction?.currentBid)}
                  </p>
                  <p className="text-xs text-text-muted">≈ {fmtPKR(auctionEnded?.winningBid || auction?.currentBid)}</p>
                </>
              )}
              {(auctionEnded?.winnerId === myId || isHighestBidder) && (
                <div className="mt-4 rounded-xl bg-success-100 border border-success-100 px-4 py-3">
                  <p className="text-sm font-bold text-success">🎉 Congratulations! You won!</p>
                  <p className="mt-1 text-xs text-text-muted">Check your Orders page to complete payment.</p>
                  <Link to="/orders" className="mt-2 inline-block text-xs font-semibold text-secondary-600 hover:text-secondary-500 no-underline">
                    Go to My Orders →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveAuctionRoom;
