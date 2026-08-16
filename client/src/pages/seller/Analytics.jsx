import { useState } from 'react';

import PageHeader             from '../../components/layout/PageHeader';
import AnalyticsSummaryCards  from '../../components/seller/AnalyticsSummaryCards';
import AnalyticsFilters       from '../../components/seller/AnalyticsFilters';
import RevenueChart           from '../../components/seller/RevenueChart';
import AuctionPerformance     from '../../components/seller/AuctionPerformance';
import TopCategories          from '../../components/seller/TopCategories';
import RecentInsights         from '../../components/seller/RecentInsights';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  dateRange: 'this_year',
  category:  'all',
  status:    'all',
};

// ─── Analytics page ───────────────────────────────────────────────────────────

function Analytics() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Analytics"
        subtitle="Monitor your revenue, auction performance and business growth."
        breadcrumbs={[
          { label: 'Home',             href: '/'                 },
          { label: 'Seller Dashboard', href: '/seller/dashboard' },
          { label: 'Analytics'                                   },
        ]}
      />

      {/* ── Summary KPI cards ── */}
      <AnalyticsSummaryCards />

      {/* ── Filter bar ── */}
      <AnalyticsFilters filters={filters} onChange={handleChange} />

      {/* ── Revenue chart — full width ── */}
      <RevenueChart />

      {/* ── Two-column section: Performance + Top Categories ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">

        {/* Auction performance tiles */}
        <AuctionPerformance />

        {/* Top categories breakdown */}
        <TopCategories />

      </div>

      {/* ── Recent insights — full width ── */}
      <RecentInsights />

    </div>
  );
}

export default Analytics;
