import { useEffect, useMemo, useState } from 'react';

import PageHeader          from '../../components/layout/PageHeader';
import DisputeStatistics   from '../../components/admin/DisputeStatistics';
import DisputesTable       from '../../components/admin/DisputesTable';
import { getAdminReports } from '../../api/admin';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = { search: '', status: 'all', priority: 'all', type: 'all' };

// ─── Admin Disputes page ──────────────────────────────────────────────────────

function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let active = true;
    getAdminReports({ limit: 100 })
      .then(({ reports }) => {
        if (!active) return;
        // Map ended/cancelled/sold auctions to dispute shape
        const mapped = (reports || []).map((r) => ({
          id:          r._id || r.id,
          type:        r.status === 'cancelled' ? 'delivery' : r.status === 'ended' ? 'other' : 'payment',
          buyer:       '—',
          buyerAvatar: '?',
          seller:      r.seller?.name || '—',
          sellerAvatar: (r.seller?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
          subject:     r.title,
          priority:    r.currentBid > 1000 ? 'high' : r.currentBid > 100 ? 'medium' : 'low',
          status:      r.status === 'sold' ? 'resolved' : 'open',
          assignedTo:  'Admin',
          createdAt:   r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        }));
        setDisputes(mapped);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const handleClear  = () => setFilters(DEFAULT_FILTERS);
  const handleResolve = (id) =>
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d)));

  const handleAssignModerator = (id, moderator) =>
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, assignedTo: moderator } : d)));

  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  const openCount = disputes.filter((d) => d.status === 'open').length;
  const highCount = disputes.filter((d) => d.priority === 'high' && d.status !== 'resolved').length;

  const filtered = useMemo(() => {
    let list = [...disputes];
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((d) =>
        d.subject.toLowerCase().includes(q)     ||
        d.buyer.toLowerCase().includes(q)       ||
        d.seller.toLowerCase().includes(q)      ||
        d.id.toLowerCase().includes(q)
      );
    }
    if (filters.status   !== 'all') list = list.filter((d) => d.status   === filters.status);
    if (filters.priority !== 'all') list = list.filter((d) => d.priority === filters.priority);
    if (filters.type     !== 'all') list = list.filter((d) => d.type     === filters.type);
    return list;
  }, [disputes, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <PageHeader
        title="Disputes"
        subtitle="Review, investigate and resolve buyer and seller disputes across the BidStream marketplace."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Disputes'                        },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: `${disputes.length} Total`, dot: 'bg-navy-500' },
              { label: `${openCount} Open`,         dot: 'bg-danger'   },
              { label: `${highCount} High Priority`,dot: 'bg-warning'  },
            ].map(({ label, dot }) => (
              <span key={label}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary shadow-card">
                <span className={['h-1.5 w-1.5 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        }
      />

      {/* Statistics */}
      <DisputeStatistics disputes={disputes} />

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      )}

      {/* Results count */}
      {!loading && filtered.length > 0 && (
        <p className="text-sm text-text-muted">
          Showing <span className="font-semibold text-text-primary">{filtered.length}</span>
          {' '}of <span className="font-semibold text-text-primary">{disputes.length}</span> disputes
          {hasActive && (
            <button type="button" onClick={handleClear}
              className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none">
              (clear filters)
            </button>
          )}
        </p>
      )}

      {/* Table */}
      <DisputesTable
        disputes={filtered}
        onResolve={handleResolve}
        onAssignModerator={handleAssignModerator}
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

    </div>
  );
}

export default AdminDisputes;
