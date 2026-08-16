import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToWatchlist, removeFromWatchlist } from '../../api/watchlist';
import { useAuth } from '../../context/AuthContext';
import { fmtUSD, fmtPKR } from '../../utils/currency';

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:        { label: 'Live',        cls: 'bg-success text-white',    dot: true  },
  ending_soon: { label: 'Ending Soon', cls: 'bg-danger text-white',     dot: true  },
  upcoming:    { label: 'Upcoming',    cls: 'bg-accent-600 text-white', dot: false },
  sold:        { label: 'Sold',        cls: 'bg-navy-500 text-white',   dot: false },
  ended:       { label: 'Ended',       cls: 'bg-navy-500 text-white',   dot: false },
  draft:       { label: 'Draft',       cls: 'bg-navy-100 text-text-secondary',dot: false },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ended;
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', cfg.cls].join(' ')}>
      {cfg.dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bg-card" />
        </span>
      )}
      {cfg.label}
    </span>
  );
}

// ─── AuctionCard ───────────────────────────────────────────────────────────────

/**
 * @param {object} auction  – record from listAuctions API (already mapped via toCard)
 */
function AuctionCard({ auction }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [watchlisted, setWatchlisted]   = useState(auction.inWatchlist ?? false);
  const [watchLoading, setWatchLoading] = useState(false);

  const {
    id, title, category, seller, sellerAvatar,
    currentBid, startingPrice, bids,
    status, timeLeft, gradient, image,
  } = auction;

  const isSold      = status === 'sold';
  const isUpcoming  = status === 'upcoming';
  const isEnded     = status === 'ended';
  const isLive      = status === 'live' || status === 'ending_soon';
  const isBuyerUser = user?.role === 'buyer';

  async function handleWatchlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setWatchLoading(true);
    try {
      if (watchlisted) {
        await removeFromWatchlist(id);
        setWatchlisted(false);
      } else {
        await addToWatchlist(id);
        setWatchlisted(true);
      }
    } catch {
      // silent
    } finally {
      setWatchLoading(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card transition-all duration-200 hover:-translate-y-2 hover:border-secondary-600/30 hover:shadow-modal">

      {/* ── Image area ── */}
      <div className={`relative h-48 w-full overflow-hidden ${image ? 'bg-bg-card' : `bg-gradient-to-br ${gradient}`}`}>

        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <path d="M14 66 L40 14 L66 66 Z" fill="white"/>
              </svg>
            </div>
          </>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </div>

        {/* Watchlist heart */}
        <button
          type="button"
          onClick={handleWatchlist}
          disabled={watchLoading}
          aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-pressed={watchlisted}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated/60 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 disabled:opacity-50"
        >
          <svg
            width="15" height="15"
            viewBox="0 0 24 24"
            fill={watchlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={watchlisted ? 'text-danger' : 'text-white'}
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Time left pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm',
            status === 'ending_soon' ? 'bg-danger/90 text-white' :
            isSold || isEnded       ? 'bg-bg-elevated/70 text-white' :
                                      'bg-black/40 text-white',
          ].join(' ')}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {timeLeft}
          </span>
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {bids} bids
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-5">

        {/* Category + seller */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            {category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
              {sellerAvatar}
            </span>
            {seller}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 line-clamp-2 text-base font-bold leading-snug text-text-primary transition-colors duration-150 group-hover:text-secondary-600">
          {title}
        </h3>

        {/* Bid info */}
        <div className="mb-5 flex items-end justify-between rounded-xl bg-bg-surface px-4 py-3">
          <div>
            <p className="text-xs font-medium text-text-muted">
              {currentBid > 0 ? 'Current Bid' : 'Starting Price'}
            </p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-auction">
              {fmtUSD(currentBid > 0 ? currentBid : startingPrice)}
            </p>
            <p className="mt-0.5 text-[10px] text-text-muted">
              ≈ {fmtPKR(currentBid > 0 ? currentBid : startingPrice)}
            </p>
          </div>
          {currentBid > 0 && (
            <div className="text-right">
              <p className="text-xs font-medium text-text-muted">Starting</p>
              <p className="mt-0.5 text-sm font-semibold text-text-muted">
                {fmtUSD(startingPrice)}
              </p>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-auto flex gap-2">
          {/* Live → Join Live Auction */}
          {isLive && isBuyerUser && (
            <Link
              to={`/live/${id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-150 hover:opacity-90 focus-visible:outline-none no-underline"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-card opacity-75"/>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-bg-card"/>
              </span>
              Join Live
            </Link>
          )}

          {/* Upcoming → Join Waiting Room for buyer */}
          {isUpcoming && isBuyerUser && (
            <Link
              to={`/waiting/${id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-warning bg-warning/10 py-2.5 text-sm font-semibold text-warning transition-colors duration-150 hover:bg-warning hover:text-white focus-visible:outline-none no-underline"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Join Waiting Room
            </Link>
          )}

          {/* Sold / Ended / not buyer */}
          {(isSold || isEnded) && (
            <span className="flex flex-1 items-center justify-center rounded-xl shimmer-bg motion-safe:animate-shimmer py-2.5 text-sm font-semibold text-text-muted cursor-default">
              {isSold ? 'Sold' : 'Ended'}
            </span>
          )}

          {/* Not authenticated + live */}
          {isLive && !isBuyerUser && !user && (
            <Link
              to={`/auctions/${id}`}
              className="flex flex-1 items-center justify-center rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-secondary-500 no-underline"
            >
              View Details
            </Link>
          )}

          {/* Seller viewing any auction */}
          {user?.role === 'seller' && (
            <Link
              to={isLive ? `/seller/live/${id}` : `/auctions/${id}`}
              className="flex flex-1 items-center justify-center rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-500 no-underline"
            >
              {isLive ? 'Monitor' : 'View Details'}
            </Link>
          )}

          {/* Details button always */}
          <Link
            to={`/auctions/${id}`}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none no-underline"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default AuctionCard;
