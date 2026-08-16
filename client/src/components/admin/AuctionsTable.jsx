import { useState, useRef } from 'react';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:         { label: 'Live',         cls: 'bg-success text-white',           pulse: true  },
  ending_soon:  { label: 'Ending Soon',  cls: 'bg-danger text-white',            pulse: true  },
  upcoming:     { label: 'Upcoming',     cls: 'bg-accent-600 text-white',        pulse: false },
  scheduled:    { label: 'Scheduled',   cls: 'bg-accent-600 text-white',        pulse: false },
  ended:        { label: 'Ended',       cls: 'bg-navy-500 text-white',          pulse: false },
  sold:         { label: 'Sold',        cls: 'bg-primary-700 text-white',       pulse: false },
  draft:        { label: 'Draft',       cls: 'bg-navy-100 text-text-secondary',       pulse: false },
  cancelled:    { label: 'Cancelled',   cls: 'bg-danger-100 text-danger',        pulse: false },
  removed:      { label: 'Removed',     cls: 'bg-danger text-white',            pulse: false },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ended;
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>
      {cfg.pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

function ViewModal({ auction, onClose }) {
  if (!auction) return null;

  const approvalColor = {
    approved: 'bg-success-100 text-success',
    rejected: 'bg-danger-100 text-danger',
    pending:  'bg-warning-100 text-warning',
  }[auction.approvalStatus] ?? 'bg-bg-elevated text-text-muted';

  const statusColor = {
    live:     'bg-success text-white',
    upcoming: 'bg-accent-600 text-white',
    ended:    'bg-navy-500 text-white',
    draft:    'bg-navy-100 text-text-secondary',
  }[auction.status] ?? 'bg-navy-100 text-text-secondary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal flex flex-col max-h-[90vh] motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()} role="dialog">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            {auction.image && (
              <img src={auction.image} alt={auction.title}
                className="h-9 w-9 rounded-lg object-cover border border-border-subtle bg-bg-card shrink-0"/>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-text-primary truncate max-w-[220px]">{auction.title}</h3>
              <p className="text-[10px] text-text-muted">{auction.seller}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Status + Approval badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold capitalize', statusColor].join(' ')}>
              {auction.status}
            </span>
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold capitalize', approvalColor].join(' ')}>
              {auction.approvalStatus}
            </span>
            <span className="rounded-full bg-bg-elevated px-2.5 py-1 text-xs font-medium text-text-secondary">
              {auction.category}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Bid',    value: auction.currentBid > 0 ? `${currency(auction.currentBid)} · ≈ ${fmtPKR(auction.currentBid)}` : '—', monetary: true },
              { label: 'Starting Price', value: `${currency(auction.startingPrice ?? 0)} · ≈ ${fmtPKR(auction.startingPrice ?? 0)}`, monetary: true },
              { label: 'Total Bids',     value: `${auction.bids ?? 0} bid${auction.bids !== 1 ? 's' : ''}` },
              { label: 'End Time',       value: auction.endTime },
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
          <button type="button" onClick={onClose}
            className="w-full rounded-xl bg-primary-900 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ auction, onClose, onSave }) {
  const [title,   setTitle]   = useState(auction?.title   ?? '');
  const [status,  setStatus]  = useState(auction?.status  ?? 'live');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  if (!auction) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      await onSave(auction.id, { title: title.trim(), status });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update auction');
    } finally { setLoading(false); }
  }

  const STATUS_OPTIONS = [
    { value: 'live',     label: 'Live'     },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ended',    label: 'Ended'    },
    { value: 'draft',    label: 'Draft'    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()} role="dialog">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">Edit Auction</h3>
            <p className="text-xs text-text-muted truncate max-w-[260px]">{auction.title}</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">

          {/* Title field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none transition-all focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 placeholder:text-text-muted"
              placeholder="Auction title"
            />
          </div>

          {/* Status field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-bg-card pl-3.5 pr-9 text-sm text-text-primary outline-none transition-all focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 cursor-pointer">
                {STATUS_OPTIONS.map(({ value: v, label }) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
              {/* Chevron */}
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-danger/20 bg-danger-100 px-3 py-2 text-xs text-danger">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-surface focus-visible:outline-none">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-secondary-500 disabled:opacity-60 focus-visible:outline-none">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({ auction, onView, onEdit, onRemove }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  function toggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuH = 130;
      if (spaceBelow < menuH) {
        setMenuStyle({ bottom: window.innerHeight - rect.top, right: window.innerWidth - rect.right });
      } else {
        setMenuStyle({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      }
    }
    setOpen((v) => !v);
  }
  return (
    <div className="relative">
      <button type="button" ref={btnRef} onClick={toggleOpen}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
        Actions
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={open ? 'rotate-180' : ''} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul className="fixed z-50 w-36 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown motion-safe:animate-scale-in motion-safe:animate-fade-in" style={menuStyle}>
            <li>
              <button type="button"
                onClick={() => { setOpen(false); onView(auction); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
                View
              </button>
            </li>
            <li>
              <button type="button"
                onClick={() => { setOpen(false); onEdit(auction); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
                Edit
              </button>
            </li>
            <li><div className="my-1 border-t border-border-subtle" /></li>
            <li>
              <button type="button"
                onClick={() => { onRemove(auction.id); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-danger transition-colors duration-150 hover:bg-danger-100">
                Remove
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function AuctionCard({ auction, onView, onEdit, onRemove }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        {auction.image
          ? <img src={auction.image} alt={auction.title} className="h-12 w-12 shrink-0 rounded-xl object-cover bg-bg-card"/>
          : <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${auction.gradient || 'from-secondary-600 to-primary-700'}`}/>
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-bold text-text-primary">{auction.title}</p>
            <StatusBadge status={auction.status} />
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{auction.category}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-bg-surface p-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Seller</p>
          <p className="text-xs font-semibold text-text-secondary">{auction.seller.split(' ')[0]}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Current Bid</p>
          <p className="text-xs font-bold text-auction">
            {auction.currentBid > 0 ? currency(auction.currentBid) : '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Ends</p>
          <p className="text-xs text-text-secondary leading-tight">{auction.endTime}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onView(auction)}
          className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-text-secondary hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
          View
        </button>
        <button type="button" onClick={() => onEdit(auction)}
          className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-text-secondary hover:border-border focus-visible:outline-none">
          Edit
        </button>
        <button type="button" onClick={() => onRemove(auction.id)} className="rounded-xl border border-border px-3.5 py-2 text-xs text-danger hover:border-danger/40 hover:bg-danger-100 focus-visible:outline-none">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── AuctionsTable ────────────────────────────────────────────────────────────

const HEADERS = ['Auction', 'Seller', 'Category', 'Current Bid', 'End Time', 'Status', 'Actions'];

/**
 * @param {Array}    auctions  – filtered auction records
 * @param {function} onRemove  – (id) => void
 * @param {function} onSave    – (id, fields) => Promise — called from Edit modal
 */
function AuctionsTable({ auctions, onRemove, onSave }) {
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  if (auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-card shadow-card">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </div>
        <p className="text-base font-bold text-text-primary">No auctions found</p>
        <p className="mt-1 text-sm text-text-muted">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      {viewTarget && <ViewModal auction={viewTarget} onClose={() => setViewTarget(null)} />}
      {editTarget && (
        <EditModal
          auction={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={onSave || (() => Promise.resolve())}
        />
      )}

      {/* Desktop table */}
      <div className="hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse" style={{ borderRadius: '1rem' }}>
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

                  {/* Auction */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {a.image
                        ? <img src={a.image} alt={a.title} className="h-10 w-10 shrink-0 rounded-xl object-cover bg-bg-card"/>
                        : <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${a.gradient || 'from-secondary-600 to-primary-700'}`}/>
                      }
                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-text-primary">{a.title}</p>
                        <p className="text-[10px] text-text-muted">{a.bids} bid{a.bids !== 1 ? 's' : ''}</p>
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
                    <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                      {a.category}
                    </span>
                  </td>

                  {/* Current bid */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-auction">
                      {a.currentBid > 0 ? currency(a.currentBid) : '—'}
                    </p>
                    {a.currentBid > 0 && <p className="text-[10px] text-text-muted">≈ {fmtPKR(a.currentBid)}</p>}
                  </td>

                  {/* End time */}
                  <td className="px-5 py-4 text-sm text-text-muted">{a.endTime}</td>

                  {/* Status */}
                  <td className="px-5 py-4"><StatusBadge status={a.status} /></td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <ActionMenu
                      auction={a}
                      onView={setViewTarget}
                      onEdit={setEditTarget}
                      onRemove={onRemove}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {auctions.map((a) => (
          <AuctionCard
            key={a.id}
            auction={a}
            onView={setViewTarget}
            onEdit={setEditTarget}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  );
}

export default AuctionsTable;
