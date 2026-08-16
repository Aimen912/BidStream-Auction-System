import { useState }                        from 'react';
import { PaymentBadge, DeliveryBadge }     from './OrderStatusBadge';
import OrderDetailsModal                   from './OrderDetailsModal';

// ─── Mobile order card ────────────────────────────────────────────────────────

function OrderMobileCard({ order, onView }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start gap-3">
        <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${order.imageGradient}`} />
        <div className="flex-1 min-w-0">
          <p className="line-clamp-1 text-sm font-bold text-text-primary">{order.auctionTitle}</p>
          <p className="text-xs text-text-muted">{order.id}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-bg-surface p-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Buyer</p>
          <p className="text-sm font-semibold text-text-secondary">{order.buyerName}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Winning Bid</p>
          <p className="text-sm font-bold text-auction">${order.winningBid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Payment</p>
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Delivery</p>
          <DeliveryBadge status={order.deliveryStatus} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onView(order)}
        className="mt-3 w-full rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none"
      >
        View Details
      </button>
    </div>
  );
}

// ─── OrdersTable ─────────────────────────────────────────────────────────────

const HEADERS = ['Order ID', 'Auction Item', 'Buyer', 'Winning Bid', 'Order Date', 'Payment', 'Delivery', 'Actions'];

/**
 * Responsive orders table with integrated details modal.
 *
 * @param {Array} orders – filtered + sorted order records
 */
function OrdersTable({ orders }) {
  const [activeOrder, setActiveOrder] = useState(null);

  return (
    <>
      {/* ── Details modal ── */}
      {activeOrder && (
        <OrderDetailsModal order={activeOrder} onClose={() => setActiveOrder(null)} />
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
              {orders.map((order, i) => (
                <tr key={order.id}
                  className={['transition-colors duration-150 hover:bg-bg-surface', i !== orders.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}>

                  {/* Order ID */}
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-bg-elevated px-2.5 py-1 font-mono text-xs font-semibold text-text-secondary">
                      {order.id}
                    </span>
                  </td>

                  {/* Auction item */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${order.imageGradient}`} />
                      <div className="min-w-0">
                        <p className="max-w-[160px] truncate text-sm font-semibold text-text-primary">{order.auctionTitle}</p>
                        <p className="text-[10px] text-text-muted">{order.category}</p>
                      </div>
                    </div>
                  </td>

                  {/* Buyer */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-text-primary">{order.buyerName}</p>
                    <p className="text-[10px] text-text-muted">{order.buyerEmail}</p>
                  </td>

                  {/* Winning bid */}
                  <td className="px-5 py-4 text-sm font-bold text-auction">
                    ${order.winningBid.toLocaleString()}
                  </td>

                  {/* Order date */}
                  <td className="px-5 py-4 text-sm text-text-secondary">{order.orderDate}</td>

                  {/* Payment */}
                  <td className="px-5 py-4"><PaymentBadge status={order.paymentStatus} /></td>

                  {/* Delivery */}
                  <td className="px-5 py-4"><DeliveryBadge status={order.deliveryStatus} /></td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button type="button"
                      onClick={() => setActiveOrder(order)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <OrderMobileCard key={order.id} order={order} onView={setActiveOrder} />
        ))}
      </div>
    </>
  );
}

export default OrdersTable;
