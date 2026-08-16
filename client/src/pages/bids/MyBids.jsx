import { useEffect, useMemo, useState } from 'react';

import PageHeader      from '../../components/layout/PageHeader';
import BidSummaryCards from '../../components/bids/BidSummaryCards';
import BidFilters      from '../../components/bids/BidFilters';
import BidTable        from '../../components/bids/BidTable';
import EmptyBids       from '../../components/bids/EmptyBids';
import { listMyBids }  from '../../api/bids';
import { useSocketEvent } from '../../context/SocketContext';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  sort:   'newest',
};

// ─── Sort helper ──────────────────────────────────────────────────────────────

const STATUS_URGENCY = { ending_soon: 0, outbid: 1, winning: 2, won: 3, lost: 4 };

function applySort(list, sort) {
  const arr = [...list];
  switch (sort) {
    case 'oldest':
      return arr.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    case 'highest_bid':
      return arr.sort((a, b) => b.yourBid - a.yourBid);
    case 'lowest_bid':
      return arr.sort((a, b) => a.yourBid - b.yourBid);
    case 'ending_soon':
      return arr.sort((a, b) => (STATUS_URGENCY[a.status] ?? 9) - (STATUS_URGENCY[b.status] ?? 9));
    case 'newest':
    default:
      return arr.sort((a, b) => String(b.id).localeCompare(String(a.id)));
  }
}

// ─── MyBids page ──────────────────────────────────────────────────────────────

function MyBids() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await listMyBids({ limit: 100 });
      setBids((result.bids || []).map((bid) => ({
          id:           bid._id || bid.id,
          auctionId:    bid.auction?._id || bid.auction?.id,
          auctionTitle: bid.auction?.title || 'Unknown Auction',
          category:     bid.auction?.category?.name || 'Uncategorized',
          seller:       bid.auction?.seller?.name || bid.auction?.seller?.username || 'Unknown Seller',
          sellerAvatar: ((bid.auction?.seller?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2) || 'U').toUpperCase(),
          currentBid:   Number(bid.auction?.currentBid || 0),
          yourBid:      Number(bid.amount || 0),
          status:       bid.status,
          minIncrement: Number(bid.auction?.minIncrement || 1),
          timeLeft:     bid.auction?.endTime ? (() => {
            const diff = new Date(bid.auction.endTime).getTime() - Date.now();
            if (diff <= 0) return 'Ended';
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            return h > 0 ? `${h}h ${m}m` : `${m}m`;
          })() : '—',
          gradient:     bid.auction?.category?.gradient || 'from-secondary-600 to-primary-700',
          image:        bid.auction?.images?.[0] || null,
        })));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bids');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ── Socket: real-time bid status updates (shared socket) ─────────────────
  // When any bid_update or auction_ended fires, reload to get fresh statuses.
  useSocketEvent('bid_update', load);
  useSocketEvent('auction_ended', load);

  const handleChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear  = () => setFilters(DEFAULT_FILTERS);

  const hasActive =
    filters.search !== DEFAULT_FILTERS.search ||
    filters.status !== DEFAULT_FILTERS.status ||
    filters.sort   !== DEFAULT_FILTERS.sort;

  const filtered = useMemo(() => {
    let list = [...bids];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((b) =>
        b.auctionTitle.toLowerCase().includes(q) ||
        b.seller.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      list = list.filter((b) => b.status === filters.status);
    }

    return applySort(list, filters.sort);
  }, [bids, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="My Bids"
        subtitle="Track all of your active, won and lost bids."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'My Bids' }]}
        actions={
          <a
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Place New Bid
          </a>
        }
      />

      {/* ── Summary cards ── */}
      <BidSummaryCards bids={bids} />

      {loading && <p className="text-sm text-text-muted">Loading bids…</p>}
      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Filters ── */}
      <BidFilters
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {/* ── Results info ── */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text-primary">{filtered.length}</span>
            {' '}of{' '}
            <span className="font-semibold text-text-primary">{bids.length}</span>
            {' '}bids
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
          {filters.status !== 'all' && (
            <span className="hidden items-center gap-1 rounded-full border border-secondary-600/30 bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-600 sm:flex">
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
      )}

      {/* ── Table or empty state ── */}
      {!loading && filtered.length === 0 ? (
        <EmptyBids onReset={handleClear} />
      ) : (
      <BidTable bids={filtered} onBidSuccess={load} />
      )}

    </div>
  );
}

export default MyBids;
