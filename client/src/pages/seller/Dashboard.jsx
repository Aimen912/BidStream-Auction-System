import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import SellerOverviewCards  from '../../components/seller/SellerOverviewCards';
import RecentOrdersTable    from '../../components/seller/RecentOrdersTable';
import RecentActivity       from '../../components/seller/RecentActivity';
import QuickActions         from '../../components/seller/QuickActions';
import { useAuth }          from '../../context/AuthContext';
import http                 from '../../api/http';
import { currency, fmtPKR } from '../../utils/currency';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Seller Dashboard ─────────────────────────────────────────────────────────

function SellerDashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    let active = true;
    http.get('/dashboard/seller')
      .then(({ data }) => { if (active) setDashData(data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const firstName    = user?.name?.split(' ')[0] || 'there';
  const liveAuctions = dashData?.stats?.liveAuctions ?? 0;
  const totalRevenue = dashData?.stats?.totalRevenue  ?? 0;

  return (
    <div className="flex flex-col gap-5">

      {/* ════════════════════════════════════
          PAGE HEADER
      ════════════════════════════════════ */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Seller Dashboard</h1>
          <p className="mt-0.5 text-sm text-text-muted">Manage your auctions and monitor sales.</p>
        </div>
        <Link
          to="/seller/create-auction"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white no-underline shadow-card transition-all duration-150 hover:bg-primary-500 hover:-translate-y-0.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Auction
        </Link>
      </div>

      {/* ════════════════════════════════════
          WELCOME / HERO PANEL
          Compact gradient banner — no duplicate Create Auction CTA.
      ════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-700 to-primary-600 px-5 py-5 lg:px-6">
        {/* Decorative glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-300/8 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* Left — greeting */}
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white lg:text-xl">
              {greeting()}, {firstName}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              <span className="font-semibold text-white">{liveAuctions} auction{liveAuctions !== 1 ? 's' : ''} live</span>
              {totalRevenue > 0 && (
                <>
                  {' · '}
                  <span className="font-semibold text-auction">{currency(totalRevenue)}</span>
                  <span className="ml-1 text-xs text-white/50">· ≈ {fmtPKR(totalRevenue)}</span>
                  {' total revenue'}
                </>
              )}
            </p>
          </div>

          {/* Right — single action (Create is already the page CTA) */}
          <Link
            to="/seller/my-auctions"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm no-underline transition-colors duration-150 hover:bg-white/15 sm:self-auto"
          >
            Manage Auctions
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════
          KPI CARDS
      ════════════════════════════════════ */}
      <SellerOverviewCards />

      {/* ════════════════════════════════════
          MAIN CONTENT — Auctions + Right column
      ════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">

        {/* Left — Your Auctions table */}
        <div className="min-w-0 overflow-hidden">
          <RecentOrdersTable />
        </div>

        {/* Right — Quick Actions + Recent Activity */}
        <div className="flex min-w-0 flex-col gap-4">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>

    </div>
  );
}

export default SellerDashboard;
