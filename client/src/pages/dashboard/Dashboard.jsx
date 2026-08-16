import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/layout/DashboardCard';
import { useAuth }   from '../../context/AuthContext';
import http          from '../../api/http';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    winning: { label: 'Winning', cls: 'bg-success/10 text-success border border-success/20' },
    outbid:  { label: 'Outbid',  cls: 'bg-danger/10 text-danger border border-danger/20'    },
    won:     { label: 'Won',     cls: 'bg-primary-600/12 text-primary-300 border border-primary-600/20' },
    lost:    { label: 'Lost',    cls: 'bg-bg-elevated text-text-muted border border-border'  },
    ended:   { label: 'Ended',   cls: 'bg-bg-elevated text-text-muted border border-border'  },
    pending: { label: 'Pending', cls: 'bg-auction/10 text-auction border border-auction/20'  },
  };
  const { label, cls } = map[status] ?? map.ended;
  return (
    <span className={['inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', cls].join(' ')}>
      {label}
    </span>
  );
}

// ─── Live dot ────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Sk({ className = '' }) {
  return <div className={['rounded-lg bg-bg-elevated animate-pulse', className].join(' ')} />;
}

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'Browse Auctions',
    to: '/auctions',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    label: 'My Active Bids',
    to: '/bids',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: 'View Watchlist',
    to: '/watchlist',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'My Orders',
    to: '/orders',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
];

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard() {
  const { user } = useAuth();
  const [dashData,    setDashData]    = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError,   setDataError]   = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoadingData(true);
        const { data } = await http.get('/dashboard/buyer');
        if (!active) return;
        setDashData(data);
      } catch (err) {
        if (!active) return;
        setDataError(err?.response?.data?.message || 'Could not load dashboard data');
      } finally {
        if (active) setLoadingData(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const firstName      = user?.name?.split(' ')[0] || 'there';
  const recentBids     = dashData?.recentBids        || [];
  const watchlistItems = dashData?.watchlistAuctions || [];
  const totalSpent     = dashData?.stats?.totalSpent    ?? 0;
  const activeBids     = dashData?.stats?.activeBids    ?? 0;
  const wonAuctions    = dashData?.stats?.wonAuctions   ?? 0;
  const totalBids      = dashData?.stats?.totalBids     ?? 0;
  const watchlistCount = dashData?.stats?.watchlistCount ?? 0;

  // ── KPI card config ──────────────────────────────────────────────────────
  const stats = [
    {
      label: 'Total Bids Placed',
      value: String(totalBids),
      iconBg: 'bg-primary-600/10', iconColor: 'text-primary-300',
      accentGradient: 'from-primary-600 to-primary-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      label: 'Currently Winning',
      value: String(activeBids),
      iconBg: 'bg-success/10', iconColor: 'text-success',
      accentGradient: 'from-success to-emerald-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Auctions Won',
      value: String(wonAuctions),
      iconBg: 'bg-violet/10', iconColor: 'text-violet-light',
      accentGradient: 'from-violet to-primary-600',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      ),
    },
    {
      label: 'Watchlist Items',
      value: String(watchlistCount),
      iconBg: 'bg-rose-500/10', iconColor: 'text-rose-400',
      accentGradient: 'from-rose-500 to-pink-500',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* ════════════════════════════════════════
          PAGE HEADER
      ════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Welcome back, {user?.name || 'there'}. Here's your real-time auction overview.
          </p>
        </div>
        <Link
          to="/auctions"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white no-underline transition-all duration-150 hover:bg-primary-500 hover:-translate-y-0.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Browse Auctions
        </Link>
      </div>

      {/* ── Error banner ── */}
      {dataError && (
        <div className="rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger">
          {dataError}
        </div>
      )}

      {/* ════════════════════════════════════════
          WELCOME / OVERVIEW PANEL
      ════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-surface">
        {/* Decorative glows — very subtle */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary-600/8 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-violet/6 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">

          {/* Left — greeting */}
          <div className="min-w-0">
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/8 px-2.5 py-1">
              <LiveDot />
              <span className="text-[11px] font-semibold text-success">Live auctions available</span>
            </div>

            <h2 className="text-xl font-bold text-text-primary lg:text-2xl">
              {greeting()},{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(to right, #A5AEFB, #A78BFA)' }}
              >
                {firstName}
              </span>
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {loadingData ? (
                <Sk className="h-4 w-48 inline-block" />
              ) : (
                <>
                  <span className="font-semibold text-text-primary">{activeBids}</span>
                  {' '}active bid{activeBids !== 1 ? 's' : ''}
                  {' · '}
                  <span className="font-semibold text-text-primary">{wonAuctions}</span>
                  {' '}auction{wonAuctions !== 1 ? 's' : ''} won
                  {totalSpent > 0 && (
                    <>
                      {' · '}
                      <span className="font-semibold text-auction">{currency(totalSpent)}</span>
                      {' '}total spent
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Right — compact stat trio + actions */}
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {/* Inline stat group — scrollable on very small screens */}
            <div className="flex items-center divide-x divide-border overflow-x-auto overflow-hidden rounded-xl border border-border bg-bg-card [-webkit-overflow-scrolling:touch]">
              {[
                { v: loadingData ? '—' : String(activeBids),   l: 'Active Bids',  c: 'text-success'   },
                { v: loadingData ? '—' : String(wonAuctions),  l: 'Won',           c: 'text-primary-300' },
                { v: loadingData ? '—' : currency(totalSpent), l: 'Total Spent',   c: 'text-auction'   },
              ].map(({ v, l, c }) => (
                <div key={l} className="flex shrink-0 flex-col items-center px-3 py-2.5 sm:px-4">
                  <span className={['text-sm font-bold tabular-nums leading-tight sm:text-base', c].join(' ')}>{v}</span>
                  <span className="mt-0.5 text-[10px] text-text-muted whitespace-nowrap">{l}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/bids"
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary-600/25 bg-primary-600/10 px-3.5 py-2 text-sm font-semibold text-primary-300 no-underline transition-colors duration-150 hover:bg-primary-600/20"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                My Bids
              </Link>
              <Link
                to="/auctions"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white no-underline transition-all duration-150 hover:bg-primary-500 hover:-translate-y-0.5"
              >
                Browse
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          KPI STATISTICS ROW
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {loadingData
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-bg-card p-5">
                <Sk className="mb-4 h-3 w-20" />
                <Sk className="mb-2 h-7 w-12" />
                <Sk className="h-2.5 w-16" />
              </div>
            ))
          : stats.map((s) => (
              <DashboardCard key={s.label} {...s} className="!p-5" />
            ))
        }
      </div>

      {/* ════════════════════════════════════════
          MAIN CONTENT — Recent Bids + Right column
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">

        {/* ── Recent Bids ────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Recent Bids</h3>
              <p className="mt-0.5 text-xs text-text-muted">Your latest bidding activity</p>
            </div>
            <Link
              to="/bids"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-400 no-underline transition-colors duration-150 hover:text-primary-300"
            >
              View all →
            </Link>
          </div>

          {/* Loading */}
          {loadingData ? (
            <div className="space-y-px p-4">
              {Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-12 w-full" />)}
            </div>
          ) : recentBids.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-primary-600/20 bg-primary-600/8 text-primary-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </span>
              <p className="text-sm font-semibold text-text-primary">No bids yet</p>
              <p className="mt-1 text-xs text-text-muted">Start bidding on auctions to see your history here.</p>
              <Link
                to="/auctions"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white no-underline transition-colors duration-150 hover:bg-primary-500"
              >
                Browse Auctions
              </Link>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-bg-surface">
                    {['Item', 'Category', 'Your Bid', 'Status', 'Ends'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="border-b border-border-subtle px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentBids.map((bid) => {
                    const auction      = bid.auction || {};
                    const imgSrc       = auction.images?.[0];
                    const categoryName = auction.category?.name || '—';
                    const endTime      = auction.endTime
                      ? new Date(auction.endTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : '—';
                    return (
                      <tr
                        key={bid._id}
                        className="transition-colors duration-150 hover:bg-bg-surface"
                      >
                        {/* Item */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            {imgSrc
                              ? <img src={imgSrc} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-border" />
                              : <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-600 to-violet" />
                            }
                            <span className="max-w-[160px] truncate text-sm font-semibold text-text-primary">
                              {auction.title || 'Untitled'}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3">
                          <span className="rounded-full border border-border bg-bg-elevated px-2 py-0.5 text-[11px] font-medium text-text-muted">
                            {categoryName}
                          </span>
                        </td>

                        {/* Your bid */}
                        <td className="px-5 py-3">
                          <span className="text-sm font-bold text-auction">
                            {currency(bid.amount)}
                          </span>
                          <span className="block text-[10px] text-text-muted">≈ {fmtPKR(bid.amount)}</span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <StatusBadge status={bid.status} />
                        </td>

                        {/* Ends */}
                        <td className="px-5 py-3 text-xs text-text-muted">
                          {endTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Right column ─────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* ── Watchlist ── */}
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Watchlist</h3>
                <p className="mt-0.5 text-xs text-text-muted">Auctions you're tracking</p>
              </div>
              <Link
                to="/watchlist"
                className="text-xs font-medium text-primary-400 no-underline transition-colors duration-150 hover:text-primary-300"
              >
                View all →
              </Link>
            </div>

            {loadingData ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-11 w-full" />)}
              </div>
            ) : watchlistItems.length === 0 ? (
              /* Empty state — compact with heart icon */
              <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
                <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-elevated text-text-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </span>
                <p className="text-sm font-medium text-text-secondary">Nothing in your watchlist</p>
                <p className="mt-0.5 text-xs text-text-muted">Save auctions to track them here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {watchlistItems.slice(0, 5).map((auction) => (
                  <li
                    key={auction._id}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-bg-surface"
                  >
                    {auction.images?.[0]
                      ? <img src={auction.images[0]} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-border" />
                      : <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary-600 to-violet" />
                    }
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary transition-colors duration-150 group-hover:text-primary-300">
                        {auction.title}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        <span className="font-semibold text-auction">
                          {auction.currentBid > 0 ? currency(auction.currentBid) : currency(auction.startingPrice)}
                        </span>
                        <span className="ml-1 text-[10px] opacity-60">
                          · {fmtPKR(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
                        </span>
                        <span className="mx-1 text-border">·</span>
                        <span className="capitalize">{auction.status}</span>
                      </p>
                    </div>
                    <svg
                      width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 text-border group-hover:text-text-muted"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Quick Actions ── */}
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
            <div className="border-b border-border-subtle px-5 py-3">
              <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {QUICK_ACTIONS.map(({ label, to, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 px-4 py-2.5 no-underline transition-colors duration-150 hover:bg-bg-surface"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-400 transition-colors duration-150 group-hover:bg-primary-600/18 group-hover:text-primary-300">
                    {icon}
                  </span>
                  <span className="flex-1 text-sm text-text-secondary transition-colors duration-150 group-hover:text-text-primary">
                    {label}
                  </span>
                  <svg
                    width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="shrink-0 text-border transition-colors duration-150 group-hover:text-primary-400"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

        </div>
        {/* ── End right column ── */}
      </div>
      {/* ── End main grid ── */}

    </div>
  );
}

export default Dashboard;
