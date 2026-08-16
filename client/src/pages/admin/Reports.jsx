import { useEffect, useMemo, useState } from 'react';

import PageHeader       from '../../components/layout/PageHeader';
import ReportStatistics from '../../components/admin/ReportStatistics';
import ReportsTable     from '../../components/admin/ReportsTable';
import { getAdminReports } from '../../api/admin';

const DEFAULT_FILTERS = { search: '', status: 'all', type: 'all', priority: 'all' };

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    let active = true;
    getAdminReports({ limit: 100 })
      .then(({ reports: r }) => {
        if (!active) return;
        setReports((r || []).map((item) => ({
          id:            item._id,
          title:         item.title,
          status:        item.status === 'sold' ? 'resolved' : item.status === 'cancelled' ? 'pending' : 'reviewing',
          auctionStatus: item.status,
          currentBid:    item.currentBid  ?? 0,
          bids:          item.bids        ?? 0,
          seller:        item.seller?.name  ?? '—',
          category:      item.category?.name ?? '—',
          reportedBy:    item.seller?.name  ?? '—',
          reportedItem:  item.category?.name ?? '—',
          type:          'auction',
          priority:      item.currentBid > 1000 ? 'high' : item.currentBid > 100 ? 'medium' : 'low',
          createdAt:     item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : '—',
        })));
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load reports');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange  = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const handleClear   = () => setFilters(DEFAULT_FILTERS);
  const handleResolve = (id) =>
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: 'resolved' } : r));
  const handleEscalate = (id) =>
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, priority: 'high', status: 'reviewing' } : r));

  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  // Filter logic — status filter compares against raw auctionStatus from API
  const filtered = useMemo(() => {
    let list = [...reports];
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.seller.toLowerCase().includes(q)
      );
    }
    if (filters.status   !== 'all') list = list.filter((r) => r.auctionStatus === filters.status);
    if (filters.type     !== 'all') list = list.filter((r) => r.type     === filters.type);
    if (filters.priority !== 'all') list = list.filter((r) => r.priority === filters.priority);
    return list;
  }, [reports, filters]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header — no summary pills, clean title only ── */}
      <PageHeader
        title="Reports"
        subtitle="Review and manage reported marketplace activity."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Reports'                         },
        ]}
      />

      {/* ── Error ── */}
      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* ── KPI cards — compact, matching dashboard pattern ── */}
      <ReportStatistics reports={reports} />

      {/* ── Loading skeletons ── */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-2xl shimmer-bg motion-safe:animate-shimmer" />
          ))}
        </div>
      ) : (
        /* ── Single unified filter bar + table inside ReportsTable ── */
        <ReportsTable
          reports={filtered}
          totalCount={reports.length}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          filters={filters}
          onChange={handleChange}
          onClear={handleClear}
          hasActive={hasActive}
        />
      )}

    </div>
  );
}

export default AdminReports;
