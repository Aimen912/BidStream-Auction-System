import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {
  getBuyerOrders,
  submitPayment,
  submitShippingAddress,
  confirmDelivery,
} from '../../api/orders';
import { currency, fmtPKR } from '../../utils/currency';
import { useSocketEvent } from '../../context/SocketContext';

const STATUS_CONFIG = {
  pending_payment:   { label: 'Pending Payment',    cls: 'bg-danger-100 text-danger',              step: 1 },
  payment_submitted: { label: 'Payment Submitted',  cls: 'bg-warning-100 text-warning',            step: 2 },
  payment_confirmed: { label: 'Payment Confirmed',  cls: 'bg-secondary-100 text-secondary-600',   step: 3 },
  preparing:         { label: 'Preparing',          cls: 'bg-accent-100 text-accent-600',          step: 3 },
  shipped:           { label: 'Shipped',            cls: 'bg-secondary-100 text-secondary-600',   step: 4 },
  delivered:         { label: 'Delivered',          cls: 'bg-success-100 text-success',            step: 5 },
  completed:         { label: 'Completed',          cls: 'bg-success-100 text-success',            step: 5 },
  cancelled:         { label: 'Cancelled',          cls: 'bg-bg-elevated text-text-muted',         step: 0 },
};

const FILTER_OPTIONS = [
  { value: 'all',               label: 'All Orders'       },
  { value: 'pending_payment',   label: 'Pending Payment'  },
  { value: 'payment_submitted', label: 'Awaiting Confirm' },
  { value: 'preparing',         label: 'Preparing'        },
  { value: 'shipped',           label: 'Shipped'          },
  { value: 'completed',         label: 'Completed'        },
];

// ─── Payment modal ────────────────────────────────────────────────────────────
function PaymentModal({ order, onClose, onSuccess }) {
  const [method, setMethod]  = useState('jazzcash');
  const [saving, setSaving]  = useState(false);
  const [error,  setError]   = useState('');

  async function handle() {
    setSaving(true); setError('');
    try {
      await submitPayment(order.id, { paymentMethod: method });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to submit payment');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">Submit Payment</h3>
            <p className="text-xs text-text-muted truncate max-w-[240px]">{order.auction?.title}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="rounded-xl bg-bg-surface px-4 py-3 text-center">
            <p className="text-xs text-text-muted">Amount Due</p>
            <p className="text-2xl font-bold text-auction">{currency(order.winningBid)}</p>
            <p className="mt-0.5 text-xs text-text-muted">≈ {fmtPKR(order.winningBid)}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Payment Method</label>
            <div className="relative">
              <select value={method} onChange={(e) => setMethod(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-bg-card pl-3.5 pr-9 text-sm text-text-primary outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 cursor-pointer">
                {[['jazzcash','JazzCash'],['easypaisa','EasyPaisa'],['bank','Bank Transfer'],['cod','Cash on Delivery']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">Cancel</button>
            <button type="button" onClick={handle} disabled={saving}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60 focus-visible:outline-none">
              {saving ? 'Submitting…' : 'Submit Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Address modal ────────────────────────────────────────────────────────────
function AddressModal({ order, onClose, onSuccess }) {
  const existing = order.shippingAddress || {};
  const [form, setForm] = useState({
    fullName: existing.fullName || '',
    phone:    existing.phone    || '',
    address:  existing.address  || '',
    city:     existing.city     || '',
    country:  existing.country  || 'Pakistan',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handle() {
    setSaving(true); setError('');
    try {
      await submitShippingAddress(order.id, form);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save address');
    } finally { setSaving(false); }
  }

  const inputCls = 'h-10 w-full rounded-xl border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-base font-bold text-text-primary">Shipping Address</h3>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {[['fullName','Full Name'],['phone','Phone'],['address','Address'],['city','City'],['country','Country']].map(([k,l]) => (
            <div key={k} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary">{l}</label>
              <input type="text" value={form[k]} onChange={set(k)} className={inputCls} placeholder={l}/>
            </div>
          ))}
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">Cancel</button>
            <button type="button" onClick={handle} disabled={saving}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60 focus-visible:outline-none">
              {saving ? 'Saving…' : 'Save Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onRefresh }) {
  const [payModal,     setPayModal]     = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [confirming,   setConfirming]   = useState(false);

  const cfg    = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
  const auc    = order.auction || {};
  const seller = order.seller  || {};

  async function handleConfirmDelivery() {
    if (!window.confirm('Confirm that you have received the item?')) return;
    setConfirming(true);
    try { await confirmDelivery(order.id); onRefresh(); }
    catch { /* silent */ }
    finally { setConfirming(false); }
  }

  return (
    <>
      {payModal     && <PaymentModal order={order} onClose={() => setPayModal(false)} onSuccess={onRefresh}/>}
      {addressModal && <AddressModal order={order} onClose={() => setAddressModal(false)} onSuccess={onRefresh}/>}

      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <p className="text-xs text-text-muted">Order</p>
            <p className="text-sm font-bold text-text-primary">{order.orderNumber || order.id?.slice(-8)}</p>
          </div>
          <span className={['rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>{cfg.label}</span>
        </div>

        <div className="flex items-start gap-4 p-5">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bg-surface">
            {auc.images?.[0]
              ? <img src={auc.images[0]} alt={auc.title} className="h-full w-full object-cover bg-bg-card"/>
              : <div className="h-full w-full bg-gradient-to-br from-secondary-600 to-primary-700"/>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-bold text-text-primary">{auc.title || '—'}</p>
            <p className="text-xs text-text-muted">Seller: {seller.name || '—'}</p>
            <p className="mt-1 text-lg font-bold text-success">{currency(order.winningBid)}</p>
            <p className="text-[11px] text-text-muted">≈ {fmtPKR(order.winningBid)}</p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="mx-5 mb-4 rounded-xl bg-primary-900/20 border border-secondary-600/20 px-4 py-2.5">
            <p className="text-xs font-semibold text-secondary-600">📦 Shipped — {order.courier}</p>
            <p className="text-xs text-text-secondary mt-0.5">Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span></p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border-subtle px-5 py-3">
          {order.status === 'pending_payment' && (
            <>
              <button type="button" onClick={() => setAddressModal(true)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">
                Add Address
              </button>
              <button type="button" onClick={() => setPayModal(true)}
                className="rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary-500 focus-visible:outline-none">
                Pay Now
              </button>
            </>
          )}
          {order.status === 'payment_submitted' && (
            <span className="text-xs text-warning font-semibold">⏳ Waiting for seller to confirm payment…</span>
          )}
          {['preparing', 'payment_confirmed'].includes(order.status) && (
            <span className="text-xs text-accent-600 font-semibold">📦 Seller is preparing your order…</span>
          )}
          {order.status === 'shipped' && (
            <button type="button" onClick={handleConfirmDelivery} disabled={confirming}
              className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60 focus-visible:outline-none">
              {confirming ? 'Confirming…' : '✓ Confirm Delivery'}
            </button>
          )}
          {order.status === 'completed' && (
            <span className="text-xs text-success font-semibold">✅ Order completed</span>
          )}
        </div>
      </div>
    </>
  );
}

// ─── BuyerOrders page ─────────────────────────────────────────────────────────
function BuyerOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('all');

  async function load() {
    setLoading(true);
    try {
      const r = await getBuyerOrders({ status: filter, limit: 50 });
      setOrders(r.orders || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load orders');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filter]);

  // ── Socket: real-time order updates (shared socket) ───────────────────────
  // new_order  → re-fetch (new order created when buyer wins an auction)
  // order_updated → patch status/tracking in-place, no re-fetch needed
  useSocketEvent('new_order', useCallback(() => { load(); }, [filter]));
  useSocketEvent('order_updated', useCallback(({ orderId, status, trackingNumber, courier }) => {
    setOrders((prev) => prev.map((o) =>
      String(o.id) === String(orderId)
        ? { ...o, status, trackingNumber: trackingNumber ?? o.trackingNumber, courier: courier ?? o.courier }
        : o
    ));
  }, []));

  const totalSpent = orders.reduce((s, o) => s + (o.winningBid || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Orders"
        subtitle="Track your won auctions and deliveries."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Orders' }]}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Orders',    value: orders.length },
          { label: 'Total Spent',     value: `${currency(totalSpent)} · ≈ ${fmtPKR(totalSpent)}` },
          { label: 'Pending Payment', value: orders.filter((o) => o.status === 'pending_payment').length },
          { label: 'Completed',       value: orders.filter((o) => o.status === 'completed').length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-bg-card p-4 shadow-card">
            <p className="text-xs text-text-muted">{label}</p>
            <p className="mt-1 text-xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button key={value} type="button" onClick={() => setFilter(value)}
            className={['rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none',
              filter === value
                ? 'bg-secondary-600 text-white shadow-card'
                : 'border border-border bg-bg-card text-text-secondary hover:border-secondary-600/40 hover:text-secondary-600',
            ].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1,2].map((i) => <div key={i} className="h-48 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <p className="text-base font-bold text-text-primary">No orders yet</p>
          <p className="mt-1 text-sm text-text-muted">Win an auction to see your orders here.</p>
          <Link to="/live" className="mt-4 text-sm font-semibold text-secondary-600 hover:text-secondary-500 no-underline">
            Browse Live Auctions →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {orders.map((o) => <OrderCard key={o.id} order={o} onRefresh={load}/>)}
        </div>
      )}
    </div>
  );
}

export default BuyerOrders;
