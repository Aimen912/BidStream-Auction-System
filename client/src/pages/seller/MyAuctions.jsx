import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader        from '../../components/layout/PageHeader';
import AuctionStatistics from '../../components/seller/AuctionStatistics';
import AuctionTable      from '../../components/seller/AuctionTable';
import { listMyAuctions, deleteAuction } from '../../api/auctions';

const STATUSES = [
  { value: 'all',         label: 'All'      },
  { value: 'live',        label: 'Live'     },
  { value: 'ending_soon', label: 'Ending'   },
  { value: 'upcoming',    label: 'Upcoming' },
  { value: 'draft',       label: 'Draft'    },
  { value: 'ended',       label: 'Ended'    },
  { value: 'sold',        label: 'Sold'     },
];

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Newest First' },
  { value: 'oldest',  label: 'Oldest First' },
  { value: 'ending',  label: 'Ending Soon'  },
];

const STATUS_ACTIVE = {
  all:         'bg-primary-700 text-white',
  live:        'bg-success text-white',
  ending_soon: 'bg-danger text-white',
  upcoming:    'bg-accent-600 text-white',
  draft:       'bg-navy-500 text-white',
  ended:       'bg-bg-elevated text-white',
  sold:        'bg-secondary-600 text-white',
};

const DEFAULT_FILTERS = { search: '', status: 'all', sort: 'newest' };

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const label = SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Sort';

  return (
    <div className="relative shrink-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className={['flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
          open ? 'border-secondary-600 bg-secondary-600/5 text-secondary-600' : 'border-border bg-bg-card text-text-secondary hover:border-border'].join(' ')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={open ? 'rotate-180' : ''} aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown">
            {SORT_OPTIONS.map(({ value: v, label: l }) => (
              <li key={v} onClick={() => { onChange(v); setOpen(false); }}
                className={['flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150',
                  value === v ? 'bg-secondary-600/5 font-semibold text-secondary-600' : 'text-text-secondary hover:bg-bg-surface'].join(' ')}>
                {l}
                {value === v && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
      <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card shadow-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
      </div>
      <h3 className="mb-2 text-lg font-bold text-text-primary">
        {hasFilters ? 'No auctions match your filters' : 'No auctions yet'}
      </h3>
      <p className="mb-6 max-w-xs text-sm text-text-muted">
        {hasFilters ? 'Try adjusting your filters to see more results.' : 'Create your first auction to start selling.'}
      </p>
      {hasFilters ? (
        <button type="button" onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500">
          Reset Filters
        </button>
      ) : (
        <Link to="/seller/create-auction"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 no-underline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Auction
        </Link>
      )}
    </div>
  );
}

function MyAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [total,    setTotal]    = useState(0);

  const set   = (key, val) => setFilters((p) => ({ ...p, [key]: val }));
  const reset = () => setFilters(DEFAULT_FILTERS);
  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 100, sort: filters.sort };
      if (filters.status !== 'all') params.status = filters.status;
      const result = await listMyAuctions(params);

      // Map API response to the shape AuctionTable expects
      const mapped = (result.auctions || []).map((a) => ({
        id:             a._id || a.id,
        title:          a.title,
        category:       a.category?.name || '—',
        startingPrice:  a.startingPrice ?? 0,
        currentBid:     a.currentBid    ?? 0,
        bids:           a.bids          ?? 0,
        status:         a.status,
        approvalStatus: a.approvalStatus || 'pending',
        adminRemark:    a.adminRemark    || '',
        endDate:        a.endTime
          ? new Date(a.endTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          : '—',
        imageGradient:  a.category?.gradient || 'from-secondary-600 to-primary-700',
        image:          a.images?.[0] || null,
        _id:            a._id || a.id,
        _raw:           a,
      }));

      setAuctions(mapped);
      setTotal(result.pagination?.total ?? mapped.length);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load auctions');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.sort]);

  useEffect(() => { load(); }, [load]);

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteAuction(id);
      setAuctions((prev) => prev.filter((a) => a.id !== id && a._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!filters.search.trim()) return auctions;
    const q = filters.search.toLowerCase();
    return auctions.filter((a) =>
      a.title?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  }, [auctions, filters.search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Auctions"
        subtitle="Manage all your auctions from one place."
        breadcrumbs={[
          { label: 'Home',             href: '/'                 },
          { label: 'Seller Dashboard', href: '/seller/dashboard' },
          { label: 'My Auctions'                                 },
        ]}
        actions={
          <Link to="/seller/create-auction"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 no-underline">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Auction
          </Link>
        }
      />

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>
      )}

      <AuctionStatistics auctions={auctions} />

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" value={filters.search} onChange={(e) => set('search', e.target.value)}
              placeholder="Search by title or category…"
              className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20" />
          </div>
          <div className="flex items-center gap-2">
            <SortDropdown value={filters.sort} onChange={(v) => set('sort', v)} />
            {hasActive && (
              <button type="button" onClick={reset}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-all duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="h-px bg-bg-elevated" />

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {STATUSES.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => set('status', value)}
              className={['shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none',
                filters.status === value ? STATUS_ACTIVE[value] : 'border border-border bg-bg-card text-text-secondary hover:border-border hover:bg-bg-surface'].join(' ')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {!loading && auctions.length > 0 && (
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-text-primary">{filtered.length}</span> of{' '}
          <span className="font-semibold text-text-primary">{total}</span> auctions
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer-bg motion-safe:animate-shimmer" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasFilters={hasActive} onReset={reset} />
      ) : (
        <AuctionTable auctions={filtered} onDeleteConfirm={handleDeleteConfirm} />
      )}
    </div>
  );
}

export default MyAuctions;
