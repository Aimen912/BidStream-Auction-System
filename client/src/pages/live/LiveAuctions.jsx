import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listAuctions } from '../../api/auctions';
import { useAuth } from '../../context/AuthContext';
import { useSocketEvent } from '../../context/SocketContext';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CompactCountdown({ endTime, prefix = 'Ends in' }) {
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
      setLeft(`${h > 0 ? `${h}h ` : ''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return (
    <span className={['font-mono text-xs font-bold', urgent ? 'text-danger' : 'text-white'].join(' ')}>
      {prefix} {left}
    </span>
  );
}

function StartCountdown({ startTime }) {
  const [left, setLeft] = useState('');
  const [msLeft, setMsLeft] = useState(0);
  useEffect(() => {
    function tick() {
      const diff = new Date(startTime) - Date.now();
      if (diff <= 0) { setLeft('Starting…'); setMsLeft(0); return; }
      const m = Math.floor(diff / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setMsLeft(diff);
      setLeft(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);
  const urgent = msLeft < 60_000 && msLeft > 0;
  return (
    <span className={['font-mono text-2xl font-bold tabular-nums', urgent ? 'text-danger' : 'text-warning'].join(' ')}>
      {left}
    </span>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-[10px] font-bold text-white">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-75"/>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-card"/>
      </span>
      LIVE
    </span>
  );
}

function SoonBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning px-2.5 py-1 text-[10px] font-bold text-white">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60"/>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-card"/>
      </span>
      STARTING SOON
    </span>
  );
}

// ─── Live Auction Card ────────────────────────────────────────────────────────

function LiveCard({ auction, isSeller }) {
  const auctionId = auction._id || auction.id;
  const joinPath = isSeller
    ? `/seller/live/${auctionId}`
    : `/live/${auctionId}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-0.5">
      <div className="relative h-44 w-full overflow-hidden bg-bg-surface">
        {auction.images?.[0]
          ? <img src={auction.images[0]} alt={auction.title} className="h-full w-full object-cover bg-bg-card"/>
          : <div className="h-full w-full bg-gradient-to-br from-secondary-600 to-primary-700"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <LiveBadge />
          <CompactCountdown endTime={auction.endTime} prefix="Ends in" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 gap-3">
        <div>
          <h3 className="line-clamp-1 text-sm font-bold text-text-primary">{auction.title}</h3>
          <p className="mt-0.5 text-xs text-text-muted">{auction.category?.name || '—'}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-bg-surface p-3">
          <div className="text-center">
            <p className="text-[10px] font-medium text-text-muted">Bid</p>
            <p className="text-xs font-bold text-auction">
              {auction.currentBid > 0 ? currency(auction.currentBid) : currency(auction.startingPrice)}
            </p>
            <p className="text-[9px] text-text-muted/70">
              ≈ {fmtPKR(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-medium text-text-muted">Bids</p>
            <p className="text-xs font-bold text-text-primary">{auction.bids ?? 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-medium text-text-muted">Min+</p>
            <p className="text-xs font-bold text-text-primary">${auction.minIncrement || 1}</p>
          </div>
        </div>
        <Link to={joinPath}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-secondary-600 text-sm font-semibold text-white transition-all hover:bg-secondary-500 no-underline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          {isSeller ? 'Monitor' : 'Join & Bid'}
        </Link>
      </div>
    </div>
  );
}

// ─── Starting Soon Card ───────────────────────────────────────────────────────

function SoonCard({ auction, isSeller, waitingCounts }) {
  const auctionId = auction._id || auction.id;
  const waitingPath = isSeller
    ? `/seller/waiting/${auctionId}`
    : `/waiting/${auctionId}`;
  const waiting = waitingCounts[auctionId] || waitingCounts[auction._id] || waitingCounts[auction.id] || 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-warning/30 bg-bg-card shadow-card transition-all duration-200 hover:shadow-dropdown hover:-translate-y-0.5">
      <div className="relative h-36 w-full overflow-hidden bg-bg-surface">
        {auction.images?.[0]
          ? <img src={auction.images[0]} alt={auction.title} className="h-full w-full object-cover bg-bg-card opacity-70"/>
          : <div className="h-full w-full bg-gradient-to-br from-warning/40 to-accent-600/40"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
        <div className="absolute top-3 left-3"><SoonBadge /></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-white/80 font-medium">
            {waiting > 0 ? `${waiting} waiting` : 'Be the first!'}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-bold text-text-primary">{auction.title}</h3>
            <p className="mt-0.5 text-xs text-text-muted">Starts at {new Date(auction.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <StartCountdown startTime={auction.startTime} />
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-warning-100 p-3">
          <div>
            <p className="text-[10px] font-medium text-text-muted">Starting Price</p>
            <p className="text-xs font-bold text-auction">{currency(auction.startingPrice)}</p>
            <p className="text-[9px] text-text-muted/70">≈ {fmtPKR(auction.startingPrice)}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-text-muted">Min Increment</p>
            <p className="text-xs font-bold text-text-secondary">${auction.minIncrement || 1}</p>
          </div>
        </div>
        <Link to={waitingPath}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-warning bg-warning/10 text-sm font-semibold text-warning transition-all hover:bg-warning hover:text-white no-underline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Join Waiting Room
        </Link>
      </div>
    </div>
  );
}

// ─── Recently Ended Card ──────────────────────────────────────────────────────

function EndedCard({ auction }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-card p-4 shadow-card opacity-75">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl shimmer-bg motion-safe:animate-shimmer">
        {auction.images?.[0]
          ? <img src={auction.images[0]} alt={auction.title} className="h-full w-full object-cover bg-bg-card"/>
          : <div className="h-full w-full bg-gradient-to-br from-navy-100 to-bg-elevated"/>
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-secondary">{auction.title}</p>
        <p className="text-xs text-text-muted">
          {auction.currentBid > 0
            ? <><span className="text-text-muted">Sold for </span><span className="font-semibold text-auction">{currency(auction.currentBid)}</span><span className="ml-1 text-[10px] text-text-muted/70">· ≈ {fmtPKR(auction.currentBid)}</span></>
            : 'No bids — Ended'}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-bg-elevated px-2.5 py-1 text-[10px] font-semibold text-text-muted">Ended</span>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label, count, accent }) {
  return (
    <div className={['flex items-center gap-3 rounded-2xl px-5 py-3', accent || 'bg-bg-surface border border-border'].join(' ')}>
      <span className="text-lg">{icon}</span>
      <h2 className="text-sm font-bold text-text-primary">{label}</h2>
      {count > 0 && (
        <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-bg-card px-2 text-xs font-bold text-text-secondary shadow-sm">{count}</span>
      )}
    </div>
  );
}

// ─── LiveAuctions page ────────────────────────────────────────────────────────

function LiveAuctions() {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';

  const [liveAuctions,   setLiveAuctions]   = useState([]);
  const [soonAuctions,   setSoonAuctions]   = useState([]);
  const [endedAuctions,  setEndedAuctions]  = useState([]);
  const [waitingCounts,  setWaitingCounts]  = useState({});
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');

  // ── Fetch initial data ─────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        // Fetch ALL approved auctions — let frontend categorize by status
        // This ensures syncStatus runs on backend and we get fresh statuses
        const [allRes, endedRes] = await Promise.allSettled([
          listAuctions({ limit: 100, sort: 'ending', approvalStatus: 'approved' }),
          listAuctions({ status: 'ended', limit: 6, sort: 'newest' }),
        ]);
        if (!active) return;

        if (allRes.status === 'fulfilled') {
          const all = allRes.value.auctions || [];
          const now = Date.now();

          const live = all.filter((a) => ['live', 'ending_soon'].includes(a.status));
          const soon = all.filter((a) => {
            if (a.status !== 'upcoming') return false;
            const diff = new Date(a.startTime) - now;
            return diff > 0 && diff <= 30 * 60 * 1000;
          });

          if (isSeller) {
            const myId = String(user?._id || user?.id || '');
            setLiveAuctions(live.filter((a) => {
              const sid = a.seller?._id || a.seller?.id || a.seller;
              return String(sid) === myId;
            }));
            setSoonAuctions(soon.filter((a) => {
              const sid = a.seller?._id || a.seller?.id || a.seller;
              return String(sid) === myId;
            }));
          } else {
            setLiveAuctions(live);
            setSoonAuctions(soon);
          }
        }

        if (endedRes.status === 'fulfilled') setEndedAuctions(endedRes.value.auctions || []);
      } catch { /* silent */ } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30_000);
    return () => { active = false; clearInterval(id); };
  }, [isSeller, user]);

  // ── Socket: listen for starting_soon + auction_went_live (shared socket) ──
  useSocketEvent('starting_soon', (data) => {
    setSoonAuctions((prev) => {
      if (prev.find((a) => String(a._id) === String(data.auctionId))) return prev;
      return [...prev, {
        _id:           data.auctionId,
        title:         data.title,
        startTime:     data.startTime,
        startingPrice: data.startingPrice,
        minIncrement:  data.minIncrement,
        images:        data.images,
        bids:          0,
      }];
    });
  });

  useSocketEvent('auction_went_live', (data) => {
    setSoonAuctions((prev) => prev.filter((a) => String(a._id) !== String(data.auctionId)));
    setLiveAuctions((prev) => {
      if (prev.find((a) => String(a._id) === String(data.auctionId))) return prev;
      return [{ _id: data.auctionId, title: data.title, status: 'live', bids: 0, images: [] }, ...prev];
    });
  });

  useSocketEvent('participants_update', ({ auctionId, count }) => {
    if (auctionId) setWaitingCounts((prev) => ({ ...prev, [auctionId]: count }));
  });

  // ── Filter live by seller if needed ───────────────────────────────────
  const visibleLive = useMemo(() => {
    let list = liveAuctions; // already seller-filtered in load()
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title?.toLowerCase().includes(q));
    }
    return list;
  }, [liveAuctions, search]);

  const visibleSoon = useMemo(() => {
    if (!search.trim()) return soonAuctions;
    const q = search.toLowerCase();
    return soonAuctions.filter((a) => a.title?.toLowerCase().includes(q));
  }, [soonAuctions, search]);

  const isEmpty = !loading && visibleLive.length === 0 && visibleSoon.length === 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-text-primary">
            {isSeller ? 'My Live Auctions' : 'Live Auctions'}
          </h1>
          {visibleLive.length > 0 && <LiveBadge />}
          {visibleSoon.length > 0 && !visibleLive.length && <SoonBadge />}
        </div>
        <p className="text-sm text-text-muted">
          {isSeller
            ? 'Monitor your active and upcoming live auctions.'
            : 'Bid in real-time or join a waiting room before the auction starts.'}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions…"
          className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-4 text-sm placeholder:text-text-muted outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"/>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-bg-card h-72">
              <div className="h-44 rounded-t-2xl bg-navy-100"/>
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 rounded shimmer-bg motion-safe:animate-shimmer w-3/4"/>
                <div className="h-3 rounded bg-bg-elevated w-1/2"/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Starting Soon section ── */}
      {!loading && visibleSoon.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionHeader icon="🟡" label="Starting Soon" count={visibleSoon.length} accent="bg-warning-100 border border-warning/30" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSoon.map((a) => (
              <SoonCard key={a._id} auction={a} isSeller={isSeller} waitingCounts={waitingCounts} />
            ))}
          </div>
        </div>
      )}

      {/* ── Live Now section ── */}
      {!loading && visibleLive.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionHeader icon="🔴" label="Live Now" count={visibleLive.length} accent="bg-danger-100 border border-danger/30" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleLive.map((a) => (
              <LiveCard key={a._id} auction={a} isSeller={isSeller} />
            ))}
          </div>
        </div>
      )}

      {/* ── Recently Ended section ── */}
      {!loading && !isSeller && endedAuctions.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionHeader icon="⚫" label="Recently Ended" count={0} accent="bg-bg-surface border border-border" />
          <div className="flex flex-col gap-3">
            {endedAuctions.map((a) => <EndedCard key={a._id} auction={a} />)}
          </div>
        </div>
      )}

      {/* Empty */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-surface">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <p className="text-base font-bold text-text-primary">No auctions right now</p>
          <p className="mt-1 text-sm text-text-muted">
            {isSeller
              ? 'Your approved auctions will appear here when live or starting soon.'
              : 'Check back soon — live auctions refresh every 30 seconds.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default LiveAuctions;
