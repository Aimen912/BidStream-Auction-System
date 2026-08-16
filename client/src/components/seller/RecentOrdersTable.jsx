import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerDashboard } from '../../api/dashboard';
import { currency, fmtPKR } from '../../utils/currency';

const STATUS_CONFIG = {
  live:        { label: 'Live',        cls: 'bg-success text-white',      dot: true  },
  ending_soon: { label: 'Ending Soon', cls: 'bg-danger text-white',       dot: true  },
  upcoming:    { label: 'Upcoming',    cls: 'bg-accent-600 text-white',   dot: false },
  sold:        { label: 'Sold',        cls: 'bg-navy-500 text-white',     dot: false },
  ended:       { label: 'Ended',       cls: 'bg-navy-500 text-white',     dot: false },
  draft:       { label: 'Draft',       cls: 'bg-navy-100 text-text-secondary',  dot: false },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ended;
  return (
    <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', cfg.cls].join(' ')}>
      {cfg.dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

function timeLeft(endTime) {
  if (!endTime) return '—';
  const diff = new Date(endTime) - Date.now();
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 48) return `${Math.floor(h / 24)}d left`;
  return `${h}h ${m}m`;
}

// ─── Quick View Modal ─────────────────────────────────────────────────────────

function QuickViewModal({ auction, onClose }) {
  if (!auction) return null;

  const statusColor = {
    live:         'bg-success text-white',
    upcoming:     'bg-accent-600 text-white',
    ending_soon:  'bg-danger text-white',
    ended:        'bg-navy-500 text-white',
    sold:         'bg-navy-500 text-white',
    draft:        'bg-navy-100 text-text-secondary',
  }[auction.status] ?? 'bg-navy-100 text-text-secondary';

  const bid = auction.currentBid || auction.startingPrice || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal flex flex-col max-h-[90vh] motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Auction details: ${auction.title}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            {auction.images?.[0]
              ? <img src={auction.images[0]} alt={auction.title} className="h-9 w-9 rounded-lg object-cover border border-border-subtle bg-bg-card shrink-0" />
              : <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-secondary-600 to-primary-700" />
            }
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-text-primary truncate max-w-[220px]">{auction.title}</h3>
              <p className="text-[10px] text-text-muted">{auction.category?.name || '—'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none"
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusColor].join(' ')}>
              {auction.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Bid',    value: auction.currentBid > 0 ? `${currency(auction.currentBid)} · ≈ ${fmtPKR(auction.currentBid)}` : '—', monetary: true },
              { label: 'Starting Price', value: `${currency(auction.startingPrice ?? 0)} · ≈ ${fmtPKR(auction.startingPrice ?? 0)}`, monetary: true },
              { label: 'Total Bids',     value: `${auction.bids ?? 0} bid${auction.bids !== 1 ? 's' : ''}` },
              { label: 'Time Left',      value: timeLeft(auction.endTime) },
            ].map(({ label, value, monetary }) => (
              <div key={label} className="rounded-xl bg-bg-surface p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className={['mt-0.5 text-sm font-bold', monetary ? 'text-auction' : 'text-text-primary'].join(' ')}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border-subtle px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary-900 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RecentOrdersTable ────────────────────────────────────────────────────────

function RecentOrdersTable() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [viewRow,  setViewRow]  = useState(null);

  useEffect(() => {
    let active = true;
    getSellerDashboard()
      .then(({ recentAuctions }) => { if (active) setAuctions(recentAuctions || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <>
      {viewRow && <QuickViewModal auction={viewRow} onClose={() => setViewRow(null)} />}

      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Your Auctions</h3>
            <p className="mt-0.5 text-xs text-text-muted">Current and recent listings</p>
          </div>
          <Link to="/seller/my-auctions"
            className="text-xs font-medium text-primary-400 transition-colors duration-150 hover:text-primary-300 no-underline">
            Manage all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2.5 p-5">
            {[1,2,3].map((i) => <div key={i} className="h-11 rounded-lg shimmer-bg motion-safe:animate-shimmer" />)}
          </div>
        ) : auctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-text-muted">No auctions yet</p>
            <Link to="/seller/create-auction"
              className="mt-3 text-xs font-semibold text-primary-400 hover:text-primary-300 no-underline transition-colors duration-150">
              Create your first auction →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-bg-surface">
                  {['Auction', 'Current Bid', 'Bids', 'Time Left', 'Status', 'Action'].map((h) => (
                    <th key={h} scope="col"
                      className="border-b border-border-subtle px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {auctions.map((row) => (
                  <tr key={row._id}
                    className="transition-colors duration-150 hover:bg-bg-surface">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {row.images?.[0]
                          ? <img src={row.images[0]} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0 ring-1 ring-border" />
                          : <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-primary-600 to-violet" />
                        }
                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-text-primary">{row.title}</p>
                          <span className="rounded-full bg-bg-elevated border border-border px-2 py-0.5 text-[10px] font-medium text-text-muted">
                            {row.category?.name || '—'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-auction">
                        ${(row.currentBid || row.startingPrice || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-muted">{row.bids ?? 0}</td>
                    <td className="px-5 py-3">
                      <span className={['text-sm font-medium', row.status === 'ending_soon' ? 'text-danger' : row.status === 'sold' ? 'text-text-muted' : 'text-text-secondary'].join(' ')}>
                        {timeLeft(row.endTime)}
                      </span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewRow(row)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-150 hover:border-primary-600/40 hover:text-primary-300 focus-visible:outline-none"
                        >
                          View
                        </button>
                        {!['sold','ended'].includes(row.status) && (
                          <Link to={`/seller/edit-auction/${row._id}`}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-150 hover:border-auction/40 hover:text-auction no-underline">
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default RecentOrdersTable;
