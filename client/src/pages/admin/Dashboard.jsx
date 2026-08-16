import { Link }          from 'react-router-dom';
import PageHeader        from '../../components/layout/PageHeader';
import AdminStatistics   from '../../components/admin/AdminStatistics';
import SystemOverview    from '../../components/admin/SystemOverview';
import RecentUsers       from '../../components/admin/RecentUsers';
import RecentReports     from '../../components/admin/RecentReports';
import { useAuth }       from '../../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
// Each child component (AdminStatistics, SystemOverview) fetches its own data.
// Dashboard.jsx only provides layout and the welcome banner.

function AdminDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <PageHeader
        title="Dashboard"
        subtitle="Monitor and manage the BidStream marketplace."
        breadcrumbs={[
          { label: 'Home',      href: '/'               },
          { label: 'Admin',     href: '/admin/dashboard' },
          { label: 'Dashboard'                           },
        ]}
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-success/30 bg-success/8 px-3 py-1.5 text-xs font-semibold text-success">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            All Systems Operational
          </span>
        }
      />

      {/* ── Welcome banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-bg-surface via-bg-card to-bg-elevated px-6 py-5">
        {/* Decorative glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-600/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet/10 blur-3xl"
        />

        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
              <svg
                width="9" height="9" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Administrator
            </span>
            <h2 className="mt-2 font-display text-xl font-bold text-white lg:text-2xl">
              {greeting()}, {firstName}
            </h2>
            <p className="mt-1 text-sm text-white/55">
              Manage your platform from one place.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              to="/admin/reports"
              className="rounded-xl border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/12 no-underline"
            >
              Review Reports
            </Link>
            <Link
              to="/admin/users"
              className="rounded-xl bg-bg-card px-4 py-2 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-bg-elevated no-underline"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <AdminStatistics />

      {/* ── Main content: two-column ── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">

        {/* Left */}
        <div className="flex flex-col gap-5">
          <SystemOverview />
          <RecentUsers />
        </div>

        {/* Right */}
        <RecentReports />
      </div>

    </div>
  );
}

export default AdminDashboard;
