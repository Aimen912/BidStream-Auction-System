import { useCallback, useEffect, useState, useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { getSellerOrders, confirmPayment, addTracking } from '../../api/orders';
import { useSocketEvent } from '../../context/SocketContext';

const STATUS_CONFIG = {
  pending_payment:   { label: 'Pending Payment',    cls: 'bg-danger-100 text-danger'              },
  payment_submitted: { label: 'Payment Submitted',  cls: 'bg-warning-100 text-warning'            },
  payment_confirmed: { label: 'Payment Confirmed',  cls: 'bg-secondary-100 text-secondary-600'   },
  preparing:         { label: 'Preparing',          cls: 'bg-accent-100 text-accent-600'          },
  shipped:           { label: 'Shipped',            cls: 'bg-secondary-100 text-secondary-600'   },
  delivered:         { label: 'Delivered',          cls: 'bg-success-100 text-success'            },
  completed:         { label: 'Completed',          cls: 'bg-success-100 text-success'            },
  cancelled:         { label: 'Cancelled',          cls: 'bg-bg-elevated text-text-muted'              },
};

const FILTER_OPTIONS = [
  { value: 'all',               label: 'All'              },
  { value: 'payment_submitted', label: 'Needs Confirm'    },
  { value: 'preparing',         label: 'Preparing'        },
  { value: 'shipped',           label: 'Shipped'          },
  { value: 'completed',         label: 'Completed'        },
];

import { currency, fmtPKR } from '../../utils/currency';

// ─── Tracking Modal ───────────────────────────────────────────────────────────
function TrackingModal({ order, onClose, onSuccess }) {
  const [tracking, setTracking] = useState('');
  const [courier,  setCourier]  = useState('TCS');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  async function handle() {
    if (!tracking.trim()) { setError('Tracking number is required'); return; }
    setSaving(true); setError('');
    try {
      await addTracking(order.id, { trackingNumber: tracking.trim(), courier });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add tracking');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">Add Tracking</h3>
            <p className="text-xs text-text-muted truncate max-w-[220px]">{order.auction?.title}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Courier</label>
            <div className="relative">
              <select value={courier} onChange={(e) => setCourier(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-bg-card pl-3.5 pr-9 text-sm text-text-primary outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 cursor-pointer">
                {['TCS','Leopards','M&P','PostEx','Other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Tracking Number</label>
            <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. TCS123456789"
              className="h-10 w-full rounded-xl border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"/>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">Cancel</button>
            <button type="button" onClick={handle} disabled={saving}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60 focus-visible:outline-none">
              {saving ? 'Saving…' : 'Mark Shipped'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OrderRow ─────────────────────────────────────────────────────────────────
function OrderRow({ order, onRefresh, isLast }) {
  const [trackModal,   setTrackModal]   = useState(false);
  const [confirming,   setConfirming]   = useState(false);

  const cfg    = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
  const auc    = order.auction  || {};
  const buyer  = order.buyer    || {};
  const addr   = order.shippingAddress || {};

  async function handleConfirmPayment() {
    setConfirming(true);
    try { await confirmPayment(order.id); onRefresh(); }
    catch { /* silent */ }
    finally { setConfirming(false); }
  }

  return (
    <>
      {trackModal && <TrackingModal order={order} onClose={() => setTrackModal(false)} onSuccess={onRefresh}/>}
      <tr className={['transition-colors duration-150 hover:bg-bg-surface', !isLast ? 'border-b border-border-subtle' : ''].join(' ')}>
        {/* Order No. */}
        <td className="px-5 py-4 text-xs font-mono font-semibold text-text-secondary">
          {order.orderNumber || order.id?.slice(-8)}
        </td>
        {/* Item */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-bg-surface">
              {auc.images?.[0]
                ? <img src={auc.images[0]} alt={auc.title} className="h-full w-full object-cover bg-bg-card"/>
                : <div className="h-full w-full bg-gradient-to-br from-secondary-600 to-primary-700"/>
              }
            </div>
            <p className="max-w-[160px] truncate text-sm font-semibold text-text-primary">{auc.title || '—'}</p>
          </div>
        </td>
        {/* Buyer */}
        <td className="px-5 py-4">
          <p className="text-sm font-semibold text-text-secondary">{buyer.name || '—'}</p>
          <p className="text-xs text-text-muted">{buyer.email || ''}</p>
        </td>
        {/* Shipping address */}
        <td className="px-5 py-4 text-xs text-text-muted">
          {addr.address
            ? <span>{addr.address}, {addr.city}</span>
            : <span className="text-navy-500">Not provided</span>
          }
        </td>
        {/* Bid */}
        <td className="px-5 py-4 text-sm font-bold text-success">
          {currency(order.winningBid)}
          <span className="block text-[10px] font-medium text-text-muted">≈ {fmtPKR(order.winningBid)}</span>
        </td>
        {/* Status */}
        <td className="px-5 py-4">
          <span className={['rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>{cfg.label}</span>
        </td>
        {/* Tracking */}
        <td className="px-5 py-4 text-xs text-text-muted font-mono">
          {order.trackingNumber || '—'}
        </td>
        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5">
            {order.status === 'payment_submitted' && (
              <button type="button" onClick={handleConfirmPayment} disabled={confirming}
                className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60 focus-visible:outline-none">
                {confirming ? '…' : 'Confirm Payment'}
              </button>
            )}
            {['preparing', 'payment_confirmed'].includes(order.status) && (
              <button type="button" onClick={() => setTrackModal(true)}
                className="rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary-500 focus-visible:outline-none">
                Add Tracking
              </button>
            )}
            {order.status === 'shipped' && (
              <span className="text-xs text-secondary-600 font-semibold">📦 Shipped</span>
            )}
            {order.status === 'completed' && (
              <span className="text-xs text-success font-semibold">✅ Done</span>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

// ─── Orders page ──────────────────────────────────────────────────────────────
function SellerOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');

  async function load() {
    setLoading(true);
    try {
      const r = await getSellerOrders({ status: filter, limit: 100 });
      setOrders(r.orders || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load orders');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filter]);

  // ── Socket: real-time order updates (shared socket) ───────────────────────
  useSocketEvent('new_order', useCallback(() => { load(); }, [filter]));
  useSocketEvent('order_updated', useCallback(({ orderId, status, trackingNumber, courier }) => {
    setOrders((prev) => prev.map((o) =>
      String(o.id) === String(orderId)
        ? { ...o, status, trackingNumber: trackingNumber ?? o.trackingNumber, courier: courier ?? o.courier }
        : o
    ));
  }, []));

  const totalRevenue = orders.reduce((s, o) => s + (o.winningBid || 0), 0);

  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) =>
      o.auction?.title?.toLowerCase().includes(q) ||
      o.buyer?.name?.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle="Manage payments, shipments and delivery."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Seller Dashboard', href: '/seller/dashboard' }, { label: 'Orders' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Orders',      value: orders.length },
          { label: 'Total Revenue',     value: `${currency(totalRevenue)} · ≈ ${fmtPKR(totalRevenue)}`, color: 'text-success' },
          { label: 'Needs Confirmation',value: orders.filter((o) => o.status === 'payment_submitted').length },
          { label: 'In Transit',        value: orders.filter((o) => o.status === 'shipped').length },
        ].map(({ label, value, color = 'text-text-primary' }) => (
          <div key={label} className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
            <p className="text-xs text-text-muted">{label}</p>
            <p className={['mt-1 text-xl font-bold', color].join(' ')}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by item or buyer…"
              className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-4 text-sm placeholder:text-text-muted outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => setFilter(value)}
                className={['rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none',
                  filter === value
                    ? 'bg-secondary-600 text-white'
                    : 'border border-border bg-bg-card text-text-secondary hover:border-secondary-600/40 hover:text-secondary-600',
                ].join(' ')}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <p className="text-base font-bold text-text-primary">No orders yet</p>
          <p className="mt-1 text-sm text-text-muted">Orders appear when your auctions end and buyers win.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-bg-surface">
                  {['Order #','Item','Buyer','Shipping Address','Winning Bid','Status','Tracking','Actions'].map((h) => (
                    <th key={h} scope="col" className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <OrderRow key={o.id} order={o} onRefresh={load} isLast={i === filtered.length - 1}/>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerOrders;
