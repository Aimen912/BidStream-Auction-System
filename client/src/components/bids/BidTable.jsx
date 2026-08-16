import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BidStatusBadge from './BidStatusBadge';
import { placeBid } from '../../api/auctions';

// ─── Increase Bid Modal ───────────────────────────────────────────────────────

function IncreaseBidModal({ bid, onClose, onSuccess }) {
  const [amount,  setAmount]  = useState(String(bid.currentBid + bid.minIncrement));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const minBid = bid.currentBid + bid.minIncrement;

  async function handleSubmit(e) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val < minBid) { setError(`Minimum bid is $${minBid.toFixed(2)}`); return; }
    setLoading(true); setError('');
    try {
      await placeBid(bid.auctionId, val);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">Increase Bid</h3>
            <p className="text-xs text-text-muted truncate max-w-xs">{bid.auctionTitle}</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-muted">Current bid: <span className="font-semibold text-auction">${bid.currentBid.toLocaleString()}</span></p>
            <p className="text-xs text-text-muted">Your bid was: <span className="font-semibold text-danger">${bid.yourBid.toLocaleString()}</span></p>
            <p className="text-xs text-text-muted">Min new bid: <span className="font-semibold text-auction">${minBid.toFixed(2)}</span></p>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              min={minBid} step="0.01"
              className="h-12 w-full rounded-xl border border-border bg-bg-card pl-8 pr-4 text-sm font-semibold text-text-primary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
              required autoFocus/>
          </div>
          {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-3 py-2 text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60">
              {loading ? 'Placing…' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionButtons({ bid, onBidSuccess }) {
  const navigate = useNavigate();
  const canIncrease = bid.status === 'outbid' || bid.status === 'ending_soon';
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <IncreaseBidModal
          bid={bid}
          onClose={() => setShowModal(false)}
          onSuccess={onBidSuccess}
        />
      )}
      <div className="flex items-center gap-2">
        <button type="button"
          onClick={() => navigate(`/auctions/${bid.auctionId}`)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
          View
        </button>
        {canIncrease && (
          <button type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-secondary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
            Increase
          </button>
        )}
      </div>
    </>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────

function TableRow({ bid, isLast, onBidSuccess }) {
  const { auctionTitle, category, seller, sellerAvatar, currentBid, yourBid, status, timeLeft, gradient, image } = bid;
  const isOutbid   = status === 'outbid';
  const yourBidCls = isOutbid ? 'text-danger font-bold' : 'text-text-primary font-bold';

  return (
    <tr className={['transition-colors duration-150 hover:bg-bg-surface', !isLast ? 'border-b border-border-subtle' : ''].join(' ')}>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {image
            ? <img src={image} alt={auctionTitle} className="h-10 w-10 shrink-0 rounded-xl object-cover"/>
            : <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${gradient}`}/>
          }
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary max-w-[180px]">{auctionTitle}</p>
            <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">{category}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
            {sellerAvatar}
          </span>
          <span className="text-sm text-text-secondary">{seller}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-sm font-semibold text-auction">${currentBid.toLocaleString()}</td>
      <td className={['px-5 py-4 text-sm', yourBidCls].join(' ')}>
        ${yourBid.toLocaleString()}
        {isOutbid && <p className="mt-0.5 text-[10px] font-medium text-danger">You were outbid</p>}
      </td>
      <td className="px-5 py-4"><BidStatusBadge status={status} /></td>
      <td className="px-5 py-4">
        <span className={['text-sm font-medium',
          status === 'ending_soon' ? 'text-danger' :
          status === 'won' || status === 'lost' ? 'text-text-muted' : 'text-text-secondary'].join(' ')}>
          {timeLeft}
        </span>
      </td>
      <td className="px-5 py-4">
        <ActionButtons bid={bid} onBidSuccess={onBidSuccess} />
      </td>
    </tr>
  );
}

// ─── Mobile bid card ──────────────────────────────────────────────────────────

function BidCard({ bid, onBidSuccess }) {
  const navigate = useNavigate();
  const { auctionTitle, category, seller, sellerAvatar, currentBid, yourBid, status, timeLeft, gradient, image } = bid;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <IncreaseBidModal
          bid={bid}
          onClose={() => setShowModal(false)}
          onSuccess={onBidSuccess}
        />
      )}
      <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
        <div className="flex items-start gap-3">
          {image
            ? <img src={image} alt={auctionTitle} className="h-12 w-12 shrink-0 rounded-xl object-cover"/>
            : <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${gradient}`}/>
          }
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-sm font-bold text-text-primary">{auctionTitle}</p>
              <BidStatusBadge status={status} size="sm" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[8px] font-bold text-white">
                {sellerAvatar}
              </span>
              {seller} · <span className="rounded-full bg-bg-elevated px-1.5 py-0.5">{category}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-bg-surface p-3">
          <div>
            <p className="text-[10px] font-medium text-text-muted">Current</p>
            <p className="text-sm font-bold text-auction">${currentBid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-text-muted">Your Bid</p>
            <p className={['text-sm font-bold', status === 'outbid' ? 'text-danger' : 'text-text-primary'].join(' ')}>
              ${yourBid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-text-muted">Time Left</p>
            <p className={['text-sm font-semibold',
              status === 'ending_soon' ? 'text-danger' :
              status === 'won' || status === 'lost' ? 'text-text-muted' : 'text-text-secondary'].join(' ')}>
              {timeLeft}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button"
            onClick={() => navigate(`/auctions/${bid.auctionId}`)}
            className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
            View Auction
          </button>
          {(status === 'outbid' || status === 'ending_soon') && (
            <button type="button"
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-xl bg-secondary-600 py-2 text-xs font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 focus-visible:outline-none">
              Increase Bid
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── BidTable ─────────────────────────────────────────────────────────────────

const TABLE_HEADERS = ['Auction', 'Seller', 'Current Bid', 'Your Bid', 'Status', 'Time Left', 'Action'];

function BidTable({ bids, onBidSuccess }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface">
                {TABLE_HEADERS.map((h) => (
                  <th key={h} scope="col"
                    className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, i) => (
                <TableRow key={bid.id} bid={bid} isLast={i === bids.length - 1} onBidSuccess={onBidSuccess} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} onBidSuccess={onBidSuccess} />
        ))}
      </div>
    </>
  );
}

export default BidTable;
