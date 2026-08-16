import PageHeader       from '../../components/layout/PageHeader';
import AnalyticsSummary from '../../components/admin/AnalyticsSummary';
import AnalyticsCharts  from '../../components/admin/AnalyticsCharts';

// ─── Admin Analytics page ─────────────────────────────────────────────────────

function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Analytics"
        subtitle="Monitor marketplace performance, user growth and auction activity."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Analytics'                       },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* Live status indicator */}
            <span className="inline-flex items-center gap-2 rounded-xl border border-success/30 bg-success-100 px-3 py-1.5 text-xs font-semibold text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live Data
            </span>
            {/* Export — UI only */}
            <button type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-border focus-visible:outline-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Report
            </button>
          </div>
        }
      />

      {/* ── KPI summary cards ── */}
      <AnalyticsSummary />

      {/* ── All charts and insights ── */}
      <AnalyticsCharts />

    </div>
  );
}

export default AdminAnalytics;
