import { useState } from 'react';
import SellerAuctionStatusBadge from './SellerAuctionStatusBadge';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Row action menu ──────────────────────────────────────────────────────────

function ActionMenu({ auctionId, status, onDelete }) {
  const [open, setOpen] = useState(false);

  const canEdit      = status !== 'sold';
  const canDuplicate = true;

  return (
    <div className="relative flex items-center gap-1.5">
      {/* View */}
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40"
      >
        View
      </button>

      {/* Three-dot menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="More actions"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted transition-colors duration-150 hover:border-border hover:text-text-secondary focus-visible:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="5"  r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
            <ul className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown">
              {canEdit && (
                <li>
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface transition-colors duration-150">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                </li>
              )}
              {canDuplicate && (
                <li>
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface transition-colors duration-150">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Duplicate
                  </button>
                </li>
              )}
              <li><div className="my-1 border-t border-border-subtle" /></li>
              <li>
                <button type="button"
                  onClick={() => { onDelete(auctionId); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger-100 transition-colors duration-150">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  Delete
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Mobile auction card ──────────────────────────────────────────────────────

function AuctionMobileCard({ auction, onDelete }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start gap-3">
        <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${auction.gradient}`} />
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-bold text-text-primary">{auction.title}</p>
            <SellerAuctionStatusBadge status={auction.status} />
          </div>
          <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">{auction.category}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-bg-surface p-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Current Bid</p>
          <p className="text-sm font-bold text-auction">
            {auction.currentBid > 0 ? currency(auction.currentBid) : '—'}
          </p>
          {auction.currentBid > 0 && (
            <p className="text-[10px] text-text-muted">≈ {fmtPKR(auction.currentBid)}</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Starting</p>
          <p className="text-sm font-semibold text-text-secondary">${auction.startingPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Time Left</p>
          <p className={['text-sm font-semibold', auction.status === 'ending_soon' ? 'text-danger' : auction.status === 'sold' ? 'text-text-muted' : 'text-text-secondary'].join(' ')}>
            {auction.endingTime}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
          View
        </button>
        {auction.status !== 'sold' && (
          <button type="button" className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-accent-600/40 hover:text-accent-600 focus-visible:outline-none">
            Edit
          </button>
        )}
        <button type="button" onClick={() => onDelete(auction.id)} className="rounded-xl border border-border px-3 py-2 text-xs text-danger transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 focus-visible:outline-none">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── SellerAuctionTable ───────────────────────────────────────────────────────

const HEADERS = ['Auction', 'Current Bid', 'Starting Price', 'Highest Bidder', 'Ending Time', 'Status', 'Actions'];

/**
 * @param {Array}    auctions  – filtered auction records
 * @param {function} onDelete  – (id) => void
 */
function SellerAuctionTable({ auctions, onDelete }) {
  return (
    <>
      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface">
                {HEADERS.map((h) => (
                  <th key={h} scope="col" className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auctions.map((a, i) => (
                <tr key={a.id}
                  className={['transition-colors duration-150 hover:bg-bg-surface', i !== auctions.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}
                >
                  {/* Auction */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${a.gradient}`} />
                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-text-primary">{a.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">{a.category}</span>
                          <span className="text-[10px] text-text-muted">{a.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current bid */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-auction">
                      {a.currentBid > 0 ? currency(a.currentBid) : '—'}
                    </p>
                    {a.currentBid > 0 && (
                      <p className="text-[10px] text-text-muted">≈ {fmtPKR(a.currentBid)}</p>
                    )}
                    <p className="text-[10px] text-text-muted">{a.bids} bids</p>
                  </td>

                  {/* Starting price */}
                  <td className="px-5 py-4 text-sm text-text-secondary">${a.startingPrice.toLocaleString()}</td>

                  {/* Highest bidder */}
                  <td className="px-5 py-4">
                    {a.highestBidder ? (
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
                          {a.bidderAvatar}
                        </span>
                        <span className="text-sm text-text-secondary">{a.highestBidder}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted">—</span>
                    )}
                  </td>

                  {/* Ending time */}
                  <td className="px-5 py-4">
                    <span className={['text-sm font-medium', a.status === 'ending_soon' ? 'text-danger' : a.status === 'sold' ? 'text-text-muted' : a.status === 'draft' ? 'text-text-muted' : 'text-text-secondary'].join(' ')}>
                      {a.endingTime}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <SellerAuctionStatusBadge status={a.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <ActionMenu auctionId={a.id} status={a.status} onDelete={onDelete} />
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
          <AuctionMobileCard key={a.id} auction={a} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}

export default SellerAuctionTable;
