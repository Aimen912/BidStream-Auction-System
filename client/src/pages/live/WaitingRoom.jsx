import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuction } from '../../api/auctions';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { currency, fmtPKR } from '../../utils/currency';

function BigCountdown({ startTime, onStarted }) {
  const [timeStr,  setTimeStr]  = useState('');
  const [segments, setSegments] = useState({ m: 0, s: 0 });
  const [started,  setStarted]  = useState(false);

  useEffect(() => {
    function tick() {
      const diff = new Date(startTime) - Date.now();
      if (diff <= 0) {
        setTimeStr('00:00');
        setSegments({ m: 0, s: 0 });
        if (!started) { setStarted(true); onStarted?.(); }
        return;
      }
      const m = Math.floor(diff / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeStr(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
      setSegments({ m, s });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const urgent = segments.m === 0 && segments.s <= 30;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-white/60 uppercase tracking-widest">Auction Starts In</p>
      <div className={['font-mono text-7xl font-bold tabular-nums tracking-tight transition-colors', urgent ? 'text-danger' : 'text-white'].join(' ')}>
        {timeStr}
      </div>
      {urgent && (
        <p className="text-sm font-bold text-danger">Get ready to bid!</p>
      )}
    </div>
  );
}

function WaitingRoom() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const isSeller     = user?.role === 'seller';

  const [auction,    setAuction]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [waiting,    setWaiting]    = useState(0);
  const [connected,  setConnected]  = useState(false);
  const [launched,   setLaunched]   = useState(false);
  const [countdown,  setCountdown]  = useState('');

  // ── Fetch auction details ────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    getAuction(id)
      .then(({ auction: a }) => { if (active) setAuction(a); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  // ── Socket: join room + listen for auction_started ───────────────────────
  useEffect(() => {
    const token  = window.sessionStorage.getItem('bs_access_token') || '';
    const socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_auction', { auctionId: id });
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('participants_update', ({ count }) => setWaiting(count));

    // When auction starts — auto-redirect to live room
    socket.on('auction_started', ({ auctionId }) => {
      if (String(auctionId) === String(id) && !launched) {
        setLaunched(true);
        socket.disconnect();
        const path = isSeller ? `/seller/live/${id}` : `/live/${id}`;
        setTimeout(() => navigate(path), 800);
      }
    });

    // Also handle if auction was already live when we join (race condition)
    socket.on('auction_state', ({ auction: a }) => {
      if ((a.status === 'live' || a.status === 'ending_soon') && !launched) {
        setLaunched(true);
        socket.disconnect();
        const path = isSeller ? `/seller/live/${id}` : `/live/${id}`;
        navigate(path);
      }
    });

    return () => socket.disconnect();
  }, [id, isSeller, navigate, launched]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-secondary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold text-text-primary">Auction not found</p>
        <Link to="/live" className="text-sm text-secondary-600 hover:text-secondary-500 no-underline">← Back to Live Auctions</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Back */}
      <Link to={isSeller ? '/seller/live' : '/live'}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary no-underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Live Auctions
      </Link>

      {/* ── Hero countdown banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-surface via-bg-card to-bg-elevated p-8 text-white border border-border">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-600/10 blur-3xl"/>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-auction/8 blur-3xl"/>

        {/* Status bar */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/20 border border-warning/40 px-3 py-1 text-xs font-bold text-warning">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning"/>
            </span>
            STARTING SOON
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50">
              {connected ? '● Connected' : '● Connecting…'}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-bg-elevated/60 px-3 py-1 text-xs font-semibold text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {waiting} waiting
            </span>
          </div>
        </div>

        {/* Countdown */}
        {auction.startTime && (
          <BigCountdown
            startTime={auction.startTime}
            onStarted={() => {
              if (!launched) {
                setLaunched(true);
                const path = isSeller ? `/seller/live/${id}` : `/live/${id}`;
                setTimeout(() => navigate(path), 1200);
              }
            }}
          />
        )}

        {/* Auction title */}
        <div className="mt-6 text-center">
          <h1 className="text-xl font-bold text-white">{auction.title}</h1>
          <p className="mt-1 text-sm text-white/60">
            {auction.category?.name} · Seller: {auction.seller?.name || '—'}
          </p>
        </div>

        {/* Launched overlay */}
        {launched && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-10">
            <div className="flex items-center gap-3 text-white">
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"/>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-danger"/>
              </span>
              <p className="text-xl font-bold">Auction is LIVE! Redirecting…</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Main grid: image + details ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">

        {/* Left: auction image + description */}
        <div className="flex flex-col gap-5">
          {auction.images?.[0] && (
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
              <img src={auction.images[0]} alt={auction.title}
                className="aspect-video w-full object-cover bg-bg-card"/>
            </div>
          )}
          {auction.description && (
            <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
              <h2 className="mb-2 text-sm font-bold text-text-primary">About this item</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line line-clamp-6">{auction.description}</p>
            </div>
          )}
        </div>

        {/* Right: pricing + rules + waiting info */}
        <div className="flex flex-col gap-4">

          {/* Pricing info */}
          <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
            <h2 className="mb-4 text-sm font-bold text-text-primary">Auction Details</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Starting Price',  value: currency(auction.startingPrice), pkr: fmtPKR(auction.startingPrice), isAuction: true },
                { label: 'Min Increment',   value: `$${auction.minIncrement || 1}`, isAuction: true },
                { label: 'Condition',       value: auction.condition || '—',        isAuction: false },
                { label: 'Category',        value: auction.category?.name || '—',  isAuction: false },
                { label: 'Start Time',      value: auction.startTime ? new Date(auction.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—', isAuction: false },
                { label: 'End Time',        value: auction.endTime   ? new Date(auction.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })   : '—', isAuction: false },
              ].map(({ label, value, pkr, isAuction }) => (
                <div key={label} className="rounded-xl bg-bg-surface p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                  <p className={['mt-0.5 text-sm font-bold', isAuction ? 'text-auction' : 'text-text-primary'].join(' ')}>{value}</p>
                  {pkr && <p className="text-[9px] text-text-muted/70">≈ {pkr}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Rules card */}
          <div className="rounded-2xl border border-primary-600/15 bg-primary-900/15 p-5">
            <h2 className="mb-3 text-sm font-bold text-text-primary">Bidding Rules</h2>
            <ul className="flex flex-col gap-2">
              {[
                `Minimum starting bid: ${currency(auction.startingPrice)} (≈ ${fmtPKR(auction.startingPrice)})`,
                `Each bid must exceed last by $${auction.minIncrement || 1}`,
                'Bidding disabled until auction starts',
                'Winner pays the final highest bid',
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0 text-primary-400" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Waiting info */}
          <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-surface mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="text-2xl font-bold text-text-primary">{waiting}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {waiting === 1 ? 'person waiting' : 'people waiting'}
            </p>
            <p className="mt-3 text-xs text-text-muted">
              {isSeller
                ? 'Buyers are waiting for your auction.'
                : 'You will be automatically moved to the live room when the auction starts.'}
            </p>
          </div>

          {/* Bid locked notice */}
          {!isSeller && (
            <div className="rounded-2xl border border-border bg-bg-surface p-4 text-center">
              <p className="text-sm font-semibold text-text-muted">🔒 Bidding is locked</p>
              <p className="mt-1 text-xs text-text-muted">Bid input will unlock when auction starts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
