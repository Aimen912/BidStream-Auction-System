import { useState } from 'react';
import { Link }     from 'react-router-dom';
import AuctionStatusBadge  from './AuctionStatusBadge';
import DeleteAuctionModal  from './DeleteAuctionModal';
import { canEdit, canDelete, lockReason } from '../../utils/auctionPermissions';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Seller View Modal ────────────────────────────────────────────────────────

function SellerViewModal({ auction, onClose }) {
  if (!auction) return null;

  const approvalColor = {
    approved: 'bg-success-100 text-success',
    pending:  'bg-warning-100 text-warning',
    rejected: 'bg-danger-100 text-danger',
  }[auction.approvalStatus] ?? 'bg-bg-elevated text-text-muted';

  const statusColor = {
    live:         'bg-success text-white',
    upcoming:     'bg-accent-600 text-white',
    ending_soon:  'bg-danger text-white',
    ended:        'bg-navy-500 text-white',
    sold:         'bg-navy-500 text-white',
    draft:        'bg-navy-100 text-text-secondary',
  }[auction.status] ?? 'bg-navy-100 text-text-secondary';

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
            {auction.image
              ? <img src={auction.image} alt={auction.title} className="h-9 w-9 rounded-lg object-cover border border-border-subtle bg-bg-card shrink-0" />
              : <div className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${auction.imageGradient || 'from-secondary-600 to-primary-700'}`} />
            }
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-text-primary truncate max-w-[220px]">{auction.title}</h3>
              <p className="text-[10px] text-text-muted">{auction.category}</p>
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
          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusColor].join(' ')}>
              {auction.status?.replace('_', ' ')}
            </span>
            {auction.approvalStatus && (
              <span className={['rounded-full px-2.5 py-1 text-xs font-semibold capitalize', approvalColor].join(' ')}>
                {auction.approvalStatus}
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Bid',    value: auction.currentBid > 0 ? `${currency(auction.currentBid)} · ≈ ${fmtPKR(auction.currentBid)}` : '—', monetary: true },
              { label: 'Starting Price', value: `${currency(auction.startingPrice ?? 0)} · ≈ ${fmtPKR(auction.startingPrice ?? 0)}`, monetary: true },
              { label: 'Total Bids',     value: `${auction.bids ?? 0} bid${auction.bids !== 1 ? 's' : ''}` },
              { label: 'End Date',       value: auction.endDate || '—' },
            ].map(({ label, value, monetary }) => (
              <div key={label} className="rounded-xl bg-bg-surface p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className={['mt-0.5 text-sm font-bold', monetary ? 'text-auction' : 'text-text-primary'].join(' ')}>{value}</p>
              </div>
            ))}
          </div>

          {/* Admin remark */}
          {auction.adminRemark && (
            <div className="rounded-xl border border-warning-100 bg-warning-100 px-4 py-3">
              <p className="text-xs font-semibold text-warning mb-1">Admin Remark</p>
              <p className="text-sm text-text-secondary">{auction.adminRemark}</p>
            </div>
          )}
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

// ─── Mobile card ──────────────────────────────────────────────────────────────

function AuctionMobileCard({ auction, onDelete, onView }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        {auction.image
          ? <img src={auction.image} alt={auction.title} className="h-12 w-12 shrink-0 rounded-xl object-cover bg-bg-card"/>
          : <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${auction.imageGradient}`}/>
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-bold text-text-primary">{auction.title}</p>
            <AuctionStatusBadge status={auction.status} size="sm" />
          </div>
          {auction.approvalStatus === 'pending' && (
            <span className="mt-1 inline-flex rounded-full bg-warning-100 px-2 py-0.5 text-[10px] font-semibold text-warning">⏳ Pending Review</span>
          )}
          {auction.approvalStatus === 'rejected' && (
            <div className="mt-1">
              <span className="inline-flex rounded-full bg-danger-100 px-2 py-0.5 text-[10px] font-semibold text-danger">✕ Rejected</span>
              {auction.adminRemark && <p className="mt-0.5 text-[10px] text-text-muted">{auction.adminRemark.slice(0, 80)}</p>}
            </div>
          )}
          <span className="mt-0.5 inline-block rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {auction.category}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-bg-surface p-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Current Bid</p>
          <p className="text-sm font-bold text-auction">
            {auction.currentBid > 0
              ? `${currency(auction.currentBid)}`
              : `${currency(auction.startingPrice ?? 0)}`
            }
          </p>
          <p className="text-[10px] text-text-muted">
            ≈ {fmtPKR(auction.currentBid > 0 ? auction.currentBid : (auction.startingPrice ?? 0))}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Bids</p>
          <p className="text-sm font-semibold text-text-secondary">{auction.bids}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">End Date</p>
          <p className="text-sm font-semibold text-text-secondary">{auction.endDate}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onView(auction)}
          className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none"
        >
          View
        </button>
        {canEdit(auction) && (
          <Link
            to={`/seller/edit-auction/${auction.id || auction._id}`}
            className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 no-underline focus-visible:outline-none"
          >
            Edit
          </Link>
        )}
        {canDelete(auction) ? (
          <button
            type="button"
            onClick={() => onDelete(auction)}
            className="rounded-xl border border-border px-3.5 py-2 text-xs text-danger transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 focus-visible:outline-none"
            aria-label="Delete"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        ) : (
          lockReason(auction) && (
            <span className="rounded-xl border border-border-subtle bg-bg-surface px-2.5 py-1.5 text-[10px] text-text-muted">
              🔒 Locked
            </span>
          )
        )}
      </div>
    </div>
  );
}

// ─── AuctionTable ─────────────────────────────────────────────────────────────

const HEADERS = ['Auction', 'Category', 'Current Bid', 'Total Bids', 'End Date', 'Status', 'Approval', 'Actions'];

/**
 * @param {Array}    auctions        – filtered, sorted auction records
 * @param {function} onDeleteConfirm – (id) => void  called after modal confirm
 */
function AuctionTable({ auctions, onDeleteConfirm }) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [viewAuction,   setViewAuction]   = useState(null);

  function handleDelete(auction) { setPendingDelete(auction); }
  function handleConfirm() {
    onDeleteConfirm(pendingDelete.id || pendingDelete._id);
    setPendingDelete(null);
  }

  return (
    <>
      {/* ── View modal ── */}
      {viewAuction && (
        <SellerViewModal
          auction={viewAuction}
          onClose={() => setViewAuction(null)}
        />
      )}

      {/* ── Delete modal ── */}
      {pendingDelete && (
        <DeleteAuctionModal
          auction={pendingDelete}
          onConfirm={handleConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface">
                {HEADERS.map((h) => (
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

                  {/* Image + title */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {a.image
                        ? <img src={a.image} alt={a.title} className="h-10 w-10 shrink-0 rounded-xl object-cover bg-bg-card"/>
                        : <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${a.imageGradient}`}/>
                      }
                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-text-primary">{a.title}</p>
                        <p className="text-[10px] text-text-muted">${a.startingPrice.toLocaleString()} start</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">{a.category}</span>
                  </td>

                  {/* Current bid */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-auction">
                      {a.currentBid > 0
                        ? currency(a.currentBid)
                        : currency(a.startingPrice ?? 0)
                      }
                    </p>
                    <p className="text-[10px] text-text-muted">≈ {fmtPKR(a.currentBid > 0 ? a.currentBid : (a.startingPrice ?? 0))}</p>
                  </td>

                  {/* Bids */}
                  <td className="px-5 py-4 text-sm text-text-secondary">{a.bids}</td>

                  {/* End date */}
                  <td className="px-5 py-4 text-sm text-text-secondary">{a.endDate}</td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <AuctionStatusBadge status={a.status} />
                  </td>

                  {/* Approval */}
                  <td className="px-5 py-4">
                    {a.approvalStatus === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-1 text-xs font-semibold text-success">
                        ✓ Approved
                      </span>
                    )}
                    {a.approvalStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning">
                        ⏳ Pending Review
                      </span>
                    )}
                    {a.approvalStatus === 'rejected' && (
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-danger-100 px-2.5 py-1 text-xs font-semibold text-danger">
                          ✕ Rejected
                        </span>
                        {a.adminRemark && (
                          <p className="mt-1 max-w-[160px] text-[10px] text-text-muted leading-tight" title={a.adminRemark}>
                            {a.adminRemark.slice(0, 60)}{a.adminRemark.length > 60 ? '…' : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewAuction(a)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40"
                      >
                        View
                      </button>
                      {canEdit(a) ? (
                        <Link
                          to={`/seller/edit-auction/${a.id || a._id}`}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40"
                        >
                          Edit
                        </Link>
                      ) : (
                        <span
                          title={lockReason(a) || 'Locked'}
                          className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs font-semibold text-navy-500 cursor-not-allowed select-none"
                        >
                          🔒 Edit
                        </span>
                      )}
                      {canDelete(a) ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(a)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-danger transition-all duration-150 hover:border-danger/40 hover:bg-danger-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
                        >
                          Delete
                        </button>
                      ) : (
                        <span
                          title={lockReason(a) || 'Locked'}
                          className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs font-semibold text-navy-500 cursor-not-allowed select-none"
                        >
                          🔒 Delete
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {auctions.map((a) => (
          <AuctionMobileCard key={a.id} auction={a} onDelete={handleDelete} onView={setViewAuction} />
        ))}
      </div>
    </>
  );
}

export default AuctionTable;
