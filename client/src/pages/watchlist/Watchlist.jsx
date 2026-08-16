import { useEffect, useMemo, useState } from 'react';

import PageHeader            from '../../components/layout/PageHeader';
import WatchlistSummaryCards from '../../components/watchlist/WatchlistSummaryCards';
import WatchlistFilters      from '../../components/watchlist/WatchlistFilters';
import WatchlistCard         from '../../components/watchlist/WatchlistCard';
import EmptyWatchlist        from '../../components/watchlist/EmptyWatchlist';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../../api/watchlist';
import { useSocketEvent } from '../../context/SocketContext';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search:   '',
  category: 'All',
  status:   'all',
  sort:     'newest',
};

// ─── Sort helper ──────────────────────────────────────────────────────────────

const STATUS_URGENCY = { ending_soon: 0, live: 1, upcoming: 2, sold: 3 };

function applySort(list, sort) {
  const arr = [...list];
  switch (sort) {
    case 'ending_soon':
      return arr.sort((a, b) => (STATUS_URGENCY[a.status] ?? 9) - (STATUS_URGENCY[b.status] ?? 9));
    case 'highest_bid':
      return arr.sort((a, b) => b.currentBid - a.currentBid);
    case 'lowest_bid':
      return arr.sort((a, b) => a.currentBid - b.currentBid);
    case 'recently_added':
      return arr.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    case 'most_popular':
      return arr.sort((a, b) => b.bids - a.bids);
    case 'newest':
    default:
      return arr.sort((a, b) => a.id - b.id);
  }
}

// ─── Watchlist page ───────────────────────────────────────────────────────────

function Watchlist() {
  const [items,   setItems]   = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await getWatchlist();
        if (!active) return;
        setItems((result.items || []).map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category?.name || 'Uncategorized',
          seller: item.seller?.name || item.seller?.username || 'Unknown Seller',
          sellerAvatar: ((item.seller?.name || '?').split(' ').map((part) => part[0]).join('').slice(0, 2) || 'U').toUpperCase(),
          currentBid: Number(item.currentBid || 0),
          startingPrice: Number(item.startingPrice || 0),
          bids: item.bids || 0,
          status: item.status,
          timeLeft: item.endTime ? (() => { const diff = new Date(item.endTime).getTime() - Date.now(); if (diff <= 0) return 'Ended'; const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); return h > 0 ? `${h}h ${m}m` : `${m}m`; })() : '—',
          image: item.images?.[0] || item.image || null,
          gradient: item.category?.gradient || 'from-secondary-600 to-primary-700',
          addedAt: 'recently',
          addedDaysAgo: 0,
        })));
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load watchlist');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear  = () => setFilters(DEFAULT_FILTERS);

  // ── Socket: real-time watchlist updates ───────────────────────────────────
  // bid_update → patch currentBid + bids for any watchlisted auction in-place
  useSocketEvent('bid_update', ({ auctionId, currentBid, totalBids }) => {
    setItems((prev) => prev.map((item) =>
      String(item.id) === String(auctionId)
        ? { ...item, currentBid: currentBid ?? item.currentBid, bids: totalBids ?? item.bids }
        : item
    ));
  });

  // auction_ended → flip status + timeLeft
  useSocketEvent('auction_ended', ({ auctionId, status }) => {
    setItems((prev) => prev.map((item) =>
      String(item.id) === String(auctionId)
        ? { ...item, status: status || 'ended', timeLeft: 'Ended' }
        : item
    ));
  });

  // auction_went_live → upcoming → live
  useSocketEvent('auction_went_live', ({ auctionId }) => {
    setItems((prev) => prev.map((item) =>
      String(item.id) === String(auctionId)
        ? { ...item, status: 'live' }
        : item
    ));
  });

  const handleRemove = async (id) => {
    await removeFromWatchlist(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const hasActive =
    filters.search   !== DEFAULT_FILTERS.search   ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.status   !== DEFAULT_FILTERS.status   ||
    filters.sort     !== DEFAULT_FILTERS.sort;

  // Filter + sort derived list
  const filtered = useMemo(() => {
    let list = [...items];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q)    ||
          i.seller.toLowerCase().includes(q)   ||
          i.category.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'All') {
      list = list.filter((i) => i.category === filters.category);
    }

    if (filters.status !== 'all') {
      list = list.filter((i) => i.status === filters.status);
    }

    return applySort(list, filters.sort);
  }, [items, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Watchlist"
        subtitle="Keep track of auctions you're interested in."
        breadcrumbs={[
          { label: 'Home',      href: '/'          },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Watchlist' },
        ]}
        actions={
          <a
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Browse Auctions
          </a>
        }
      />

      {/* ── Summary cards — always reflects live item count ── */}
      <WatchlistSummaryCards items={items} />

      {loading && <p className="text-sm text-text-muted">Loading watchlist…</p>}
      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Filters ── */}
      <WatchlistFilters
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {/* ── Results info ── */}
      {!loading && items.length > 0 && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text-primary">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-text-primary">{items.length}</span>
            {' '}saved auctions
            {hasActive && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none"
              >
                (clear filters)
              </button>
            )}
          </p>

          {/* Active filter chips */}
          <div className="hidden items-center gap-2 sm:flex">
            {filters.category !== 'All' && (
              <span className="flex items-center gap-1 rounded-full border border-secondary-600/30 bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-600">
                {filters.category}
                <button
                  type="button"
                  onClick={() => handleChange('category', 'All')}
                  aria-label={`Remove ${filters.category} filter`}
                  className="ml-0.5 hover:text-text-primary focus-visible:outline-none"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="flex items-center gap-1 rounded-full border border-primary-600/20 bg-primary-900/30 px-2.5 py-1 text-xs font-medium text-primary-300">
                {filters.status.replace('_', ' ')}
                <button
                  type="button"
                  onClick={() => handleChange('status', 'all')}
                  aria-label="Remove status filter"
                  className="ml-0.5 hover:text-text-primary focus-visible:outline-none"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Grid or empty states ── */}
      {!loading && items.length === 0 ? (
        /* All items removed */
        <EmptyWatchlist />
      ) : filtered.length === 0 ? (
        /* Filters return nothing */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-card shadow-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 text-lg font-bold text-text-primary">No results found</h3>
          <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
            No watchlisted auctions match your filters. Try adjusting the search or clearing the filters.
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.17" />
            </svg>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <WatchlistCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Watchlist;
