import { useEffect, useMemo, useState } from 'react';

import PageHeader     from '../../components/layout/PageHeader';
import AuctionFilters from '../../components/auctions/AuctionFilters';
import AuctionCard    from '../../components/auctions/AuctionCard';
import EmptyState     from '../../components/auctions/EmptyState';
import { listAuctions } from '../../api/auctions';
import { useSocketEvent } from '../../context/SocketContext';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search:   '',
  category: 'All',
  status:   'all',
  sort:     'newest',
};

// ─── Sort comparators ─────────────────────────────────────────────────────────

const STATUS_URGENCY = { ending_soon: 0, live: 1, upcoming: 2, sold: 3 };

function formatMoney(value) {
  return Number(value || 0);
}

function formatEndTime(endTime) {
  if (!endTime) return '—';
  const end = new Date(endTime);
  const diff = end.getTime() - Date.now();
  if (Number.isNaN(end.getTime())) return '—';
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function toCard(auction) {
  const sellerName   = auction.seller?.name || auction.seller?.username || 'Unknown Seller';
  const sellerAvatar = (sellerName || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return {
    id:            auction._id || auction.id,
    title:         auction.title,
    category:      auction.category?.name || 'Uncategorized',
    seller:        sellerName,
    sellerAvatar,
    currentBid:    Number(auction.currentBid   || 0),
    startingPrice: Number(auction.startingPrice || 0),
    bids:          auction.bids   || 0,
    status:        auction.status,
    timeLeft:      formatEndTime(auction.endTime),
    gradient:      auction.category?.gradient || 'from-secondary-600 to-primary-700',
    image:         auction.images?.[0] || null,
  };
}

function applySort(list, sort) {
  const arr = [...list];
  switch (sort) {
    case 'ending':
    case 'ending_soon':
      return arr.sort((a, b) => (STATUS_URGENCY[a.status] ?? 9) - (STATUS_URGENCY[b.status] ?? 9));
    case 'highest_bid':
      return arr.sort((a, b) => b.currentBid - a.currentBid);
    case 'lowest_bid':
      return arr.sort((a, b) => a.currentBid - b.currentBid);
    case 'most_popular':
      return arr.sort((a, b) => b.bids - a.bids);
    case 'newest':
    default:
      // Sort by id descending (MongoDB ObjectId encodes timestamp)
      return arr.sort((a, b) => {
        const idA = String(a.id || '');
        const idB = String(b.id || '');
        return idB.localeCompare(idA);
      });
  }
}

// ─── Summary stats ────────────────────────────────────────────────────────────

function SummaryBar({ total, live, endingSoon }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {[
        { value: total,      label: 'Total',       dot: 'bg-navy-500'  },
        { value: live,       label: 'Live Now',     dot: 'bg-success'   },
        { value: endingSoon, label: 'Ending Soon',  dot: 'bg-danger'    },
      ].map(({ value, label, dot }) => (
        <span
          key={label}
          className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary shadow-card"
        >
          <span className={['h-1.5 w-1.5 rounded-full', dot].join(' ')} />
          <span className="font-bold text-text-primary">{value}</span>
          {label}
        </span>
      ))}
    </div>
  );
}

// ─── Auctions page ────────────────────────────────────────────────────────────

function Auctions() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await listAuctions({ limit: 100 });
        if (!active) return;
        setAuctions((result.auctions || []).map(toCard));
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load auctions');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // ── Socket: real-time auction updates ─────────────────────────────────────
  // bid_update  → patch currentBid + bids count in-place, no re-fetch
  useSocketEvent('bid_update', ({ auctionId, currentBid, totalBids }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, currentBid: currentBid ?? a.currentBid, bids: totalBids ?? a.bids }
        : a
    ));
  });

  // auction_ended → flip status to ended/sold in-place
  useSocketEvent('auction_ended', ({ auctionId, status }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, status: status || 'ended', timeLeft: 'Ended' }
        : a
    ));
  });

  // auction_went_live → flip upcoming → live in-place
  useSocketEvent('auction_went_live', ({ auctionId }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, status: 'live' }
        : a
    ));
  });

  // Single updater — keeps change handlers tiny in children
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => setFilters(DEFAULT_FILTERS);

  const hasActive =
    filters.search   !== DEFAULT_FILTERS.search   ||
    filters.category !== DEFAULT_FILTERS.category ||
    filters.status   !== DEFAULT_FILTERS.status   ||
    filters.sort     !== DEFAULT_FILTERS.sort;

  // Derived filtered + sorted list — NOTE: auctions must be in deps
  const filtered = useMemo(() => {
    let list = [...auctions];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.seller.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'All') {
      list = list.filter((a) => a.category === filters.category);
    }

    // Status
    if (filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status);
    }

    return applySort(list, filters.sort);
  }, [auctions, filters]);

  // Summary counts (based on full unfiltered list)
  const liveCount      = auctions.filter((a) => a.status === 'live').length;
  const endingSoonCount = auctions.filter((a) => a.status === 'ending_soon').length;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Auctions"
        subtitle="Browse and bid on active auctions."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Auctions' }]}
        actions={
          <SummaryBar
            total={auctions.length}
            live={liveCount}
            endingSoon={endingSoonCount}
          />
        }
      />

      {loading && <p className="text-sm text-text-muted">Loading auctions…</p>}
      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Filter bar ── */}
      <AuctionFilters
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {/* ── Results header ── */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text-primary">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-text-primary">{auctions.length}</span>
            {' '}auctions
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
                  className="ml-0.5 hover:text-text-primary"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6"  y1="6" x2="18" y2="18" />
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
                  className="ml-0.5 hover:text-text-primary"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6"  y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Grid or empty state ── */}
      {!loading && filtered.length === 0 ? (
        <EmptyState onReset={handleClear} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}

    </div>
  );
}

export default Auctions;
