import { useEffect, useMemo, useState } from 'react';

import PageHeader      from '../../components/layout/PageHeader';
import AuctionFilters  from '../../components/admin/AuctionFilters';
import AuctionsTable   from '../../components/admin/AuctionsTable';
import {
  deleteAuction,
  updateAuction,
  searchAuctions,
  getPendingAuctions,
  approveAuction,
  rejectAuction,
} from '../../api/admin';
import { useSocketEvent } from '../../context/SocketContext';

const DEFAULT_FILTERS = { search: '', status: 'all', category: 'All', seller: 'All' };

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ auction, onClose, onConfirm }) {
  const [remark,  setRemark]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!remark.trim()) { setError('Please provide a reason for rejection'); return; }
    setLoading(true); setError('');
    try {
      await onConfirm(remark.trim());
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reject auction');
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-danger">Reject Auction</h3>
            <p className="text-xs text-text-muted truncate max-w-xs">{auction.title}</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <p className="text-sm text-text-secondary">
            Provide a reason for rejection. The seller will see this message.
          </p>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. Product description is incomplete, images are missing, or category is incorrect."
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-all duration-150 focus:border-danger focus:ring-2 focus:ring-danger/20"
            autoFocus
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-danger py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {loading ? 'Rejecting…' : 'Reject Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Pending Review Table ─────────────────────────────────────────────────────

function PendingTable({ auctions, onApprove, onReject }) {
  if (auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card py-16 text-center">
        <span className="mb-3 text-4xl">✅</span>
        <p className="text-base font-bold text-text-primary">All caught up!</p>
        <p className="mt-1 text-sm text-text-muted">No auctions pending review.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-bg-surface">
              {['Auction', 'Seller', 'Category', 'Starting Price', 'Submitted', 'Actions'].map((h) => (
                <th key={h} scope="col"
                  className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auctions.map((a, i) => (
              <tr key={a.id}
                className={['transition-colors duration-150 hover:bg-bg-surface', i !== auctions.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}>

                {/* Auction */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {a.image
                      ? <img src={a.image} alt={a.title} className="h-10 w-10 shrink-0 rounded-xl object-cover"/>
                      : <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${a.gradient}`}/>
                    }
                    <div className="min-w-0">
                      <p className="max-w-[180px] truncate text-sm font-semibold text-text-primary">{a.title}</p>
                      <p className="text-[10px] text-text-muted">{a.bids} bids</p>
                    </div>
                  </div>
                </td>

                {/* Seller */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
                      {a.sellerAvatar}
                    </span>
                    <span className="text-sm text-text-secondary">{a.seller}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">{a.category}</span>
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-sm font-bold text-auction">
                  ${a.startingPrice.toLocaleString()}
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-sm text-text-muted">{a.endTime}</td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onApprove(a.id)}
                      className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 focus-visible:outline-none">
                      Approve
                    </button>
                    <button type="button" onClick={() => onReject(a)}
                      className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 focus-visible:outline-none">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin Auctions page ──────────────────────────────────────────────────────

function AdminAuctions() {
  const [activeTab, setActiveTab] = useState('all');   // 'all' | 'pending'

  // All auctions state
  const [auctions, setAuctions] = useState([]);
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  // Pending auctions state
  const [pending,        setPending]        = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState(null);

  // Load all auctions
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await searchAuctions({ limit: 100 });
        if (!active) return;
        setAuctions((result.auctions || []).map(mapAuction));
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

  // Load pending auctions
  useEffect(() => {
    let active = true;
    async function loadPending() {
      try {
        const result = await getPendingAuctions({ limit: 100 });
        if (!active) return;
        setPending((result.auctions || []).map(mapAuction));
      } catch {
        // silent
      } finally {
        if (active) setPendingLoading(false);
      }
    }
    loadPending();
    return () => { active = false; };
  }, []);

  // ── Socket: real-time updates ─────────────────────────────────────────────
  // Patch currentBid + bids count in the All Auctions list without re-fetching
  useSocketEvent('bid_update', ({ auctionId, currentBid, totalBids }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, currentBid: currentBid ?? a.currentBid, bids: totalBids ?? a.bids }
        : a
    ));
  });

  // When an auction ends, flip its status in the list
  useSocketEvent('auction_ended', ({ auctionId, status }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, status: status || 'ended' }
        : a
    ));
  });

  // When an upcoming auction goes live, update its status
  useSocketEvent('auction_went_live', ({ auctionId }) => {
    setAuctions((prev) => prev.map((a) =>
      String(a.id) === String(auctionId)
        ? { ...a, status: 'live' }
        : a
    ));
  });

  function mapAuction(auction) {
    return {
      id:            auction._id || auction.id,
      title:         auction.title,
      category:      auction.category?.name || 'Uncategorized',
      seller:        auction.seller?.name   || auction.seller?.username || 'Unknown',
      sellerAvatar:  ((auction.seller?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2) || 'U').toUpperCase(),
      currentBid:    Number(auction.currentBid   || 0),
      startingPrice: Number(auction.startingPrice || 0),
      bids:          auction.bids || 0,
      status:        auction.status,
      approvalStatus:auction.approvalStatus || 'pending',
      adminRemark:   auction.adminRemark || '',
      endTime:       auction.endTime ? new Date(auction.endTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
      gradient:      auction.category?.gradient || 'from-secondary-600 to-primary-700',
      image:         auction.images?.[0] || null,
    };
  }

  const handleChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const handleClear  = () => setFilters(DEFAULT_FILTERS);

  const handleRemove = async (id) => {
    await deleteAuction(id);
    setAuctions((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = async (id, fields) => {
    const result = await updateAuction(id, fields);
    const updated = mapAuction(result.auction);
    setAuctions((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a));
  };

  const handleApprove = async (id) => {
    try {
      await approveAuction(id);
      setPending((prev) => prev.filter((a) => a.id !== id));
      setAuctions((prev) => prev.map((a) =>
        a.id === id ? { ...a, approvalStatus: 'approved' } : a
      ));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to approve auction');
    }
  };

  const handleReject = async (remark) => {
    if (!rejectTarget) return;
    await rejectAuction(rejectTarget.id, remark);
    setPending((prev) => prev.filter((a) => a.id !== rejectTarget.id));
    setAuctions((prev) => prev.map((a) =>
      a.id === rejectTarget.id ? { ...a, approvalStatus: 'rejected', adminRemark: remark } : a
    ));
  };

  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let list = [...auctions];
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.seller.toLowerCase().includes(q)
      );
    }
    if (filters.status   !== 'all') list = list.filter((a) => a.status   === filters.status);
    if (filters.category !== 'All') list = list.filter((a) => a.category === filters.category);
    if (filters.seller   !== 'All') list = list.filter((a) => a.seller   === filters.seller);
    return list;
  }, [auctions, filters]);

  const live      = auctions.filter((a) => a.status === 'live').length;
  const scheduled = auctions.filter((a) => a.status === 'upcoming').length;
  const ended     = auctions.filter((a) => a.status === 'ended').length;

  return (
    <div className="flex flex-col gap-6">

      {rejectTarget && (
        <RejectModal
          auction={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
        />
      )}

      <PageHeader
        title="Auctions"
        subtitle="Monitor and manage all auctions across the BidStream marketplace."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Auctions'                        },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: `${auctions.length} Total`, dot: 'bg-navy-500' },
              { label: `${live} Live`,             dot: 'bg-success'  },
              { label: `${scheduled} Upcoming`,    dot: 'bg-accent-600'},
              { label: `${ended} Ended`,           dot: 'bg-navy-500' },
              { label: `${pending.length} Pending Review`, dot: 'bg-warning' },
            ].map(({ label, dot }) => (
              <span key={label}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary shadow-card">
                <span className={['h-1.5 w-1.5 rounded-full', dot].join(' ')}/>
                {label}
              </span>
            ))}
          </div>
        }
      />

      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Tab switcher ── */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all',     label: 'All Auctions',   count: auctions.length },
          { key: 'pending', label: 'Pending Review',  count: pending.length, highlight: true },
        ].map(({ key, label, count, highlight }) => (
          <button key={key} type="button"
            onClick={() => setActiveTab(key)}
            className={[
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150',
              activeTab === key
                ? 'bg-primary-900 text-white shadow-card'
                : 'border border-border bg-bg-card text-text-secondary hover:border-border',
            ].join(' ')}>
            {label}
            <span className={[
              'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
              activeTab === key
                ? 'bg-black/20 text-white'
                : highlight && count > 0
                ? 'bg-warning text-white'
                : 'bg-bg-elevated text-text-muted',
            ].join(' ')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'pending' ? (
        <>
          {pendingLoading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
            </div>
          ) : (
            <PendingTable
              auctions={pending}
              onApprove={handleApprove}
              onReject={(a) => setRejectTarget(a)}
            />
          )}
        </>
      ) : (
        <>
          <AuctionFilters
            filters={filters}
            onChange={handleChange}
            onClear={handleClear}
            hasActive={hasActive}
          />

          {!loading && filtered.length > 0 && (
            <p className="text-sm text-text-muted">
              Showing <span className="font-semibold text-text-primary">{filtered.length}</span> of{' '}
              <span className="font-semibold text-text-primary">{auctions.length}</span> auctions
              {hasActive && (
                <button type="button" onClick={handleClear}
                  className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none">
                  (clear filters)
                </button>
              )}
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
            </div>
          ) : (
            <AuctionsTable auctions={filtered} onRemove={handleRemove} onSave={handleSave} />
          )}
        </>
      )}
    </div>
  );
}

export default AdminAuctions;
