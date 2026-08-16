import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getAuction, placeBid, buyNow as apiBuyNow }    from '../../api/auctions';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../../api/watchlist';
import { getOrCreateConversation }           from '../../api/messages';
import { useAuth }                           from '../../context/AuthContext';
import { currency, fmtPKR }                 from '../../utils/currency';
import DualAmount                            from '../../components/ui/DualAmount';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeLeft(endTime) {
  if (!endTime) return { label: '—', urgent: false };
  const diff = new Date(endTime) - Date.now();
  if (diff <= 0) return { label: 'Ended', urgent: false };
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return { label: `${d}d ${h}h ${m}m`, urgent: d < 1 };
  if (h > 0) return { label: `${h}h ${m}m ${sec}s`,  urgent: h < 2 };
  return { label: `${m}m ${sec}s`, urgent: true };
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP = {
  live:        { label: 'Live',        cls: 'bg-success text-white',           dot: true  },
  ending_soon: { label: 'Ending Soon', cls: 'bg-danger text-white',            dot: true  },
  upcoming:    { label: 'Upcoming',    cls: 'bg-accent-600 text-white',        dot: false },
  sold:        { label: 'Sold',        cls: 'bg-navy-500 text-white',          dot: false },
  ended:       { label: 'Ended',       cls: 'bg-navy-500 text-white',          dot: false },
  draft:       { label: 'Draft',       cls: 'bg-navy-100 text-text-secondary',       dot: false },
  cancelled:   { label: 'Cancelled',   cls: 'bg-danger-100 text-danger',        dot: false },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.ended;
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold', cfg.cls].join(' ')}>
      {cfg.dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ endTime }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const { label, urgent } = timeLeft(endTime);
  return (
    <span className={['font-mono text-lg font-bold', urgent ? 'text-danger' : 'text-text-primary'].join(' ')}>
      {label}
    </span>
  );
}

// ─── Image gallery ────────────────────────────────────────────────────────────

function Gallery({ images, title }) {
  const [idx, setIdx] = useState(0);
  const imgs = images?.length ? images : [];

  if (imgs.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-secondary-600 to-primary-700 flex items-center justify-center">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card">
        <img src={imgs[idx]} alt={`${title} — image ${idx + 1}`} className="aspect-square w-full object-cover" />
        {imgs.length > 1 && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)} aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated/90 shadow-card backdrop-blur-sm transition hover:bg-bg-elevated">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % imgs.length)} aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated/90 shadow-card backdrop-blur-sm transition hover:bg-bg-elevated">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {idx + 1} / {imgs.length}
            </span>
          </>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={['h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-bg-card transition-all', i === idx ? 'border-secondary-600' : 'border-transparent opacity-60 hover:opacity-100'].join(' ')}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AuctionDetail ────────────────────────────────────────────────────────────

function AuctionDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [auction,    setAuction]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const [bidAmount,  setBidAmount]  = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError,   setBidError]   = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  const [inWatchlist, setInWatchlist]   = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [msgLoading,   setMsgLoading]   = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [buyNowSuccess, setBuyNowSuccess] = useState('');

  // Fetch auction
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getAuction(id)
      .then(({ auction: a }) => { if (active) setAuction(a); })
      .catch((err) => { if (active) setError(err?.response?.data?.message || 'Auction not found'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  // Check watchlist status
  useEffect(() => {
    if (!isAuthenticated || !auction) return;
    let active = true;
    getWatchlist()
      .then(({ auctions }) => {
        if (!active) return;
        const ids = (auctions || []).map((a) => a._id || a);
        setInWatchlist(ids.includes(auction._id));
      })
      .catch(() => {});
    return () => { active = false; };
  }, [auction, isAuthenticated]);

  // Set default bid amount when auction loads
  useEffect(() => {
    if (!auction) return;
    const min = auction.currentBid > 0
      ? auction.currentBid + (auction.minIncrement || 1)
      : auction.startingPrice || 0;
    setBidAmount(String(min));
  }, [auction]);

  async function handleBid(e) {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    if (!isAuthenticated) { navigate('/login'); return; }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) { setBidError('Please enter a valid bid amount'); return; }

    setBidLoading(true);
    try {
      const result = await placeBid(id, amount);
      setBidSuccess(`Bid of ${currency(amount)} placed successfully!`);
      // Refresh auction to show updated currentBid
      const { auction: updated } = await getAuction(id);
      setAuction(updated);
      const newMin = updated.currentBid + (updated.minIncrement || 1);
      setBidAmount(String(newMin));
    } catch (err) {
      setBidError(err?.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  }

  async function handleWatchlist() {
    if (!isAuthenticated) { navigate('/login'); return; }
    setWatchLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(auction._id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(auction._id);
        setInWatchlist(true);
      }
    } catch (err) {
      // silent
    } finally {
      setWatchLoading(false);
    }
  }

  async function handleMessageSeller() {
    if (!isAuthenticated) { navigate('/login'); return; }
    const sellerId = auction.seller?._id || auction.seller?.id;
    if (!sellerId) return;
    setMsgLoading(true);
    try {
      await getOrCreateConversation(sellerId);
      navigate('/messages');
    } catch {
      navigate('/messages');
    } finally {
      setMsgLoading(false);
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!window.confirm(`Buy now for ${currency(auction.buyNowPrice)}? This will instantly close the auction.`)) return;
    setBuyNowLoading(true);
    setBuyNowSuccess('');
    setBidError('');
    try {
      await apiBuyNow(id);
      setBuyNowSuccess(`You won the auction for ${currency(auction.buyNowPrice)}!`);
      const { auction: updated } = await getAuction(id);
      setAuction(updated);
    } catch (err) {
      setBidError(err?.response?.data?.message || 'Buy Now failed. Please try again.');
    } finally {
      setBuyNowLoading(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-64 rounded-xl bg-navy-100" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-navy-100" />
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-10 rounded-xl bg-navy-100" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-bold text-text-primary">{error || 'Auction not found'}</p>
        <Link to="/auctions" className="mt-4 text-sm font-semibold text-secondary-600 hover:text-secondary-500 no-underline">
          ← Back to Auctions
        </Link>
      </div>
    );
  }

  const isLive     = ['live', 'ending_soon'].includes(auction.status);
  const isUpcoming = auction.status === 'upcoming';
  const isEnded    = ['ended', 'sold', 'cancelled'].includes(auction.status);
  const auctionId = auction._id || auction.id || id;
  const isSeller   = user?.id === (auction.seller?._id || auction.seller?.id)
                  || user?._id === (auction.seller?._id || auction.seller?.id);
  const isBuyer    = user?.role === 'buyer';

  // Time until start (for upcoming auctions)
  const msUntilStart = auction.startTime ? new Date(auction.startTime) - Date.now() : null;
  const startingSoon = msUntilStart !== null && msUntilStart > 0 && msUntilStart <= 30 * 60 * 1000;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm text-text-muted">
        <Link to="/" className="hover:text-text-secondary no-underline">Home</Link>
        <span>/</span>
        <Link to="/auctions" className="hover:text-text-secondary no-underline">Auctions</Link>
        <span>/</span>
        <span className="truncate text-text-primary font-medium max-w-xs">{auction.title}</span>
      </nav>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[1fr_420px]">

        {/* ── Left: images + description ── */}
        <div className="flex flex-col gap-6">
          <Gallery images={auction.images} title={auction.title} />

          {/* Description */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card">
            <h2 className="mb-3 text-base font-bold text-text-primary">Description</h2>
            <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">{auction.description}</p>

            {/* Tags */}
            {auction.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {auction.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card">
            <h2 className="mb-4 text-base font-bold text-text-primary">Item Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: 'Condition',  value: auction.condition  || '—' },
                { label: 'Category',   value: auction.category?.name || '—' },
                { label: 'Location',   value: auction.location   || '—' },
                { label: 'Shipping',   value: auction.shipping   || '—' },
                { label: 'Start Time', value: auction.startTime ? new Date(auction.startTime).toLocaleString() : '—' },
                { label: 'End Time',   value: auction.endTime   ? new Date(auction.endTime).toLocaleString()   : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-text-muted">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: bidding panel ── */}
        <div className="flex flex-col gap-4">

          {/* Title + status */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={auction.status} />
              {auction.category?.name && (
                <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  {auction.category.name}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-text-primary leading-snug">{auction.title}</h1>

            {/* Seller */}
            {auction.seller && (
              <p className="mt-2 text-xs text-text-muted">
                Listed by{' '}
                <span className="font-semibold text-text-secondary">{auction.seller.name}</span>
              </p>
            )}
          </div>

          {/* Current bid + timer */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-text-muted">
                  {auction.currentBid > 0 ? 'Current Bid' : 'Starting Price'}
                </p>
                <p className="mt-1 text-3xl font-bold text-auction">
                  {currency(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  ≈ {fmtPKR(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {auction.bids ?? 0} bid{auction.bids !== 1 ? 's' : ''} placed
                  {auction.minIncrement > 0 && (
                    <> · min increment <span className="text-text-secondary">{currency(auction.minIncrement)}</span></>
                  )}
                </p>
              </div>

              {/* Countdown */}
              {isLive && (
                <div className="text-right">
                  <p className="text-xs font-medium text-text-muted">Time Left</p>
                  <Countdown endTime={auction.endTime} />
                </div>
              )}
            </div>

            {/* Reserve indicator removed */}
          </div>

          {/* ── Live/Upcoming Action Buttons ── */}

          {/* LIVE: Buyer → Join Live Auction Room */}
          {isLive && isBuyer && !isSeller && (
            <Link to={`/live/${id}`}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger text-sm font-bold text-white shadow-card transition-all hover:opacity-90 no-underline">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-75"/>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-bg-card"/>
              </span>
              Join Live Auction Room
            </Link>
          )}

          {/* UPCOMING + Starting Soon: Buyer → Join Waiting Room */}
          {isUpcoming && startingSoon && isBuyer && !isSeller && (
            <Link to={`/waiting/${id}`}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-warning bg-warning/10 text-sm font-bold text-warning transition-all hover:bg-warning hover:text-white no-underline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Join Waiting Room
            </Link>
          )}

          {/* UPCOMING: Not starting soon */}
          {isUpcoming && !startingSoon && isBuyer && !isSeller && (
            <div className="rounded-2xl border border-accent-600/20 bg-accent-600/10 p-4 text-center">
              <p className="text-sm font-semibold text-accent-600">Auction not started yet</p>
              <p className="mt-1 text-xs text-text-muted">
                Starts {auction.startTime ? new Date(auction.startTime).toLocaleString() : '—'}
              </p>
              <p className="mt-1 text-xs text-text-muted">The waiting room opens 30 minutes before start.</p>
            </div>
          )}

          {/* LIVE: Seller → Monitor */}
          {isLive && isSeller && (
            <Link to={`/seller/live/${id}`}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-900 text-sm font-bold text-white shadow-card transition-all hover:opacity-90 no-underline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Monitor Live Auction
            </Link>
          )}

          {/* UPCOMING: Seller → Waiting Room */}
          {isUpcoming && isSeller && (
            <Link to={`/seller/waiting/${id}`}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-warning bg-warning/10 text-sm font-bold text-warning transition-all hover:bg-warning hover:text-white no-underline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              View Waiting Room
            </Link>
          )}

          {/* Not authenticated + live */}
          {!isAuthenticated && isLive && (
            <div className="rounded-2xl border border-primary-600/20 bg-primary-900/20 p-6 text-center shadow-card">
              <p className="text-sm text-text-secondary mb-3">Sign in to join the live auction</p>
              <Link to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-bold text-white shadow-card transition-all hover:bg-secondary-500 no-underline">
                Sign In to Bid
              </Link>
            </div>
          )}

          {/* Ended state */}
          {isEnded && (
            <div className="rounded-2xl border border-border bg-bg-surface p-4 text-center">
              <p className="text-sm font-semibold text-text-muted">
                {auction.status === 'sold'
                  ? `Sold for ${currency(auction.currentBid)} · ≈ ${fmtPKR(auction.currentBid)}`
                  : 'This auction has ended'}
              </p>
            </div>
          )}

          {/* Message Seller button — only for buyers, not for the seller themselves */}
          {isAuthenticated && isBuyer && !isSeller && auction.seller && (
            <button type="button" onClick={handleMessageSeller} disabled={msgLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-secondary-600/30 bg-primary-900/20 text-sm font-semibold text-secondary-600 transition-colors duration-150 hover:bg-secondary-100 disabled:opacity-60">
              {msgLoading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
              {msgLoading ? 'Opening chat…' : `Message ${auction.seller.name || 'Seller'}`}
            </button>
          )}

          {/* Watchlist button — only for buyers */}
          {isAuthenticated && isBuyer && !isSeller && (
          <button type="button" onClick={handleWatchlist} disabled={watchLoading}
            className={['flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all duration-150 disabled:opacity-60',
              inWatchlist
                ? 'border-danger/30 bg-danger-100 text-danger hover:bg-danger-100'
                : 'border-border bg-bg-card text-text-secondary hover:border-border hover:bg-bg-surface'].join(' ')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
          )}

          {/* Highest bidder */}
          {auction.highestBidder && auction.currentBid > 0 && (
            <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
              <p className="text-xs font-medium text-text-muted mb-2">Current Leader</p>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-sm font-bold text-white">
                  {(auction.highestBidder.name || '?').slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{auction.highestBidder.name || 'Anonymous'}</p>
                  <p className="text-xs text-text-muted">Highest bidder</p>
                </div>
                <span className="ml-auto text-sm font-bold text-success">
                  {currency(auction.currentBid)}
                  <span className="block text-[10px] font-medium text-text-muted">≈ {fmtPKR(auction.currentBid)}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionDetail;
