// ─── DeleteAuctionModal ───────────────────────────────────────────────────────

/**
 * Confirmation dialog for deleting an auction.
 * UI only — calls onConfirm() when the user confirms.
 *
 * @param {object}   auction    – auction record being deleted
 * @param {function} onConfirm  – () => void
 * @param {function} onCancel   – () => void
 */
function DeleteAuctionModal({ auction, onConfirm, onCancel }) {
  if (!auction) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onCancel}
      aria-hidden="true"
    >
      {/* Panel */}
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Icon header */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>

          <h2 id="delete-modal-title" className="text-lg font-bold text-text-primary">
            Delete Auction?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            You are about to permanently delete{' '}
            <span className="font-semibold text-text-primary">"{auction.title}"</span>.
            This action cannot be undone.
          </p>
        </div>

        {/* Auction info chip */}
        <div className="mx-6 mb-6 flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
          <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${auction.imageGradient}`} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{auction.title}</p>
            <p className="text-xs text-text-muted">
              {auction.category} · {auction.bids} bids
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className={[
              'rounded-xl border border-border bg-bg-card px-5 py-2.5',
              'text-sm font-semibold text-text-secondary',
              'transition-colors duration-150 hover:bg-bg-surface',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
            ].join(' ')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              'rounded-xl bg-danger px-5 py-2.5',
              'text-sm font-semibold text-white shadow-card',
              'transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40',
            ].join(' ')}
          >
            Delete Auction
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAuctionModal;
