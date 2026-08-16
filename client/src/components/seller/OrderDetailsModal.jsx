import { PaymentBadge, DeliveryBadge } from './OrderStatusBadge';

// ─── Detail row helper ────────────────────────────────────────────────────────

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border-subtle py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <div className="text-sm font-medium text-text-primary sm:text-right">
        {children}
      </div>
    </div>
  );
}

// ─── OrderDetailsModal ────────────────────────────────────────────────────────

/**
 * Full-detail modal for a single order.
 *
 * @param {object}   order     – order record
 * @param {function} onClose   – () => void
 */
function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8 motion-safe:animate-fade-in"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* Panel */}
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-bg-card shadow-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h3 id="order-modal-title" className="text-base font-bold text-text-primary">
              Order Details
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-secondary-600">{order.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-secondary focus-visible:outline-none"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Auction thumbnail strip ── */}
        <div className="flex items-center gap-4 border-b border-border-subtle px-6 py-4">
          <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${order.imageGradient}`} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-text-primary">{order.auctionTitle}</p>
            <p className="text-xs text-text-muted">{order.category} · Auction ended {order.auctionEndDate}</p>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="px-6 py-2">

          <p className="pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Order Information
          </p>
          <DetailRow label="Order Date">{order.orderDate}</DetailRow>
          <DetailRow label="Auction End Date">{order.auctionEndDate}</DetailRow>
          <DetailRow label="Winning Bid">
            <span className="text-base font-bold text-auction">
              ${order.winningBid.toLocaleString()}
            </span>
          </DetailRow>
          <DetailRow label="Payment Status">
            <PaymentBadge status={order.paymentStatus} />
          </DetailRow>
          <DetailRow label="Delivery Status">
            <DeliveryBadge status={order.deliveryStatus} />
          </DetailRow>

          <p className="pb-1 pt-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Buyer Information
          </p>
          <DetailRow label="Buyer Name">{order.buyerName}</DetailRow>
          <DetailRow label="Email">
            <a href={`mailto:${order.buyerEmail}`}
              className="text-secondary-600 hover:text-secondary-500 no-underline">
              {order.buyerEmail}
            </a>
          </DetailRow>
          <DetailRow label="Phone">{order.buyerPhone}</DetailRow>
          <DetailRow label="Shipping Address">
            <span className="text-right leading-snug">{order.shippingAddress}</span>
          </DetailRow>

          {order.notes && (
            <>
              <p className="pb-1 pt-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Notes
              </p>
              <p className="pb-4 pt-1 text-sm leading-relaxed text-text-secondary">{order.notes}</p>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-border-subtle px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className={[
              'w-full rounded-xl bg-secondary-600 py-2.5',
              'text-sm font-semibold text-white shadow-card',
              'transition-colors duration-150 hover:bg-secondary-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
            ].join(' ')}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailsModal;
