// ─── Status configs ───────────────────────────────────────────────────────────

const PAYMENT_CONFIG = {
  paid:     { label: 'Paid',     cls: 'bg-success-100 text-success'       },
  pending:  { label: 'Pending',  cls: 'bg-warning-100 text-warning'       },
  refunded: { label: 'Refunded', cls: 'bg-bg-elevated text-text-muted'         },
};

const DELIVERY_CONFIG = {
  processing: { label: 'Processing', cls: 'bg-secondary-100 text-secondary-600', dot: 'bg-secondary-600' },
  shipped:    { label: 'Shipped',    cls: 'bg-secondary-100 text-secondary-600', dot: 'bg-secondary-500' },
  delivered:  { label: 'Delivered',  cls: 'bg-success-100 text-success',          dot: 'bg-success'       },
  cancelled:  { label: 'Cancelled',  cls: 'bg-danger-100 text-danger',            dot: 'bg-danger'        },
};

// ─── PaymentBadge ─────────────────────────────────────────────────────────────

/**
 * @param {'paid'|'pending'|'refunded'} status
 */
function PaymentBadge({ status }) {
  const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.pending;
  return (
    <span className={['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>
      {cfg.label}
    </span>
  );
}

// ─── DeliveryBadge ────────────────────────────────────────────────────────────

/**
 * @param {'processing'|'shipped'|'delivered'|'cancelled'} status
 */
function DeliveryBadge({ status }) {
  const cfg = DELIVERY_CONFIG[status] ?? DELIVERY_CONFIG.processing;
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>
      <span className={['h-1.5 w-1.5 rounded-full', cfg.dot].join(' ')} />
      {cfg.label}
    </span>
  );
}

// ─── OrderStatusBadge ─────────────────────────────────────────────────────────

/**
 * Unified export — pick the correct badge by type.
 *
 * @param {'payment'|'delivery'} type
 * @param {string}               status
 */
function OrderStatusBadge({ type, status }) {
  if (type === 'delivery') return <DeliveryBadge status={status} />;
  return <PaymentBadge status={status} />;
}

export { PaymentBadge, DeliveryBadge };
export default OrderStatusBadge;
