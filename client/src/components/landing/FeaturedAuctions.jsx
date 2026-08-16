import { Link } from 'react-router-dom';

// ─── Auction data ─────────────────────────────────────────────────────────────
// First item is the FEATURED hero card (larger, stronger visual weight).
// Remaining 5 are standard grid cards.
//
// `image` — Unsplash URL matched to the actual item. Stable, no-auth, no new deps.
// `gradient` — kept as CSS fallback when the image fails to load.

const FEATURED = {
  id: 1,
  title: 'Rolex Submariner Date',
  subtitle: 'Ref. 126610LN · 2023 · Unworn',
  category: 'Luxury',
  currentBid: '$12,500',
  bids: 93,
  timeLeft: '4h 52m',
  urgent: false,
  image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80&fit=crop',
  gradient: 'from-primary-700 via-primary-600 to-violet',
};

const AUCTIONS = [
  {
    id: 2,
    title: 'Air Jordan 1 Retro OG Chicago',
    category: 'Fashion',
    currentBid: '$3,800',
    bids: 47,
    timeLeft: '0h 38m',
    urgent: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop',
    gradient: 'from-orange-500 via-amber-400 to-yellow-300',
  },
  {
    id: 3,
    title: 'Vintage Leica M6 Camera',
    category: 'Photography',
    currentBid: '$1,240',
    bids: 18,
    timeLeft: '2h 14m',
    urgent: false,
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600&q=80&fit=crop',
    gradient: 'from-primary-700 via-primary-600 to-primary-500',
  },
  {
    id: 4,
    title: 'Gibson Les Paul Standard',
    category: 'Music',
    currentBid: '$2,150',
    bids: 31,
    timeLeft: '1h 05m',
    urgent: true,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80&fit=crop',
    gradient: 'from-rose-600 via-pink-500 to-fuchsia-400',
  },
  {
    id: 5,
    title: 'Apple Mac Pro M2 Ultra',
    category: 'Technology',
    currentBid: '$6,900',
    bids: 62,
    timeLeft: '8h 20m',
    urgent: false,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80&fit=crop',
    gradient: 'from-slate-700 via-slate-600 to-gray-500',
  },
  {
    id: 6,
    title: 'Original Banksy Print',
    category: 'Art',
    currentBid: '$8,400',
    bids: 74,
    timeLeft: '0h 22m',
    urgent: true,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80&fit=crop',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Featured hero card ───────────────────────────────────────────────────────
// Larger image area, stronger bid typography, horizontal layout on md+

function FeaturedCard({ title, subtitle, category, currentBid, bids, timeLeft, gradient, image }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-bg-card shadow-card transition-all duration-300 hover:border-primary-600/20 hover:shadow-modal md:col-span-2">
      <div className="flex flex-col md:flex-row">

        {/* Image area — real photo with gradient fallback */}
        <div className={`relative h-64 shrink-0 overflow-hidden bg-gradient-to-br ${gradient} md:h-auto md:w-72`}>

          {/* Product image */}
          {image && (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // Hide broken img — gradient background shows through as fallback
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Subtle dark overlay — keeps badges readable over bright images */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20 pointer-events-none" />

          {/* Category + live badge */}
          <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
            <span className="w-fit rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {category}
            </span>
            <div className="flex w-fit items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-3 py-1 backdrop-blur-sm">
              <LiveDot />
              <span className="text-xs font-bold text-success">LIVE</span>
            </div>
          </div>

          {/* Bottom gradient for legibility on mobile where body is below */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-card to-transparent md:hidden pointer-events-none" />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col justify-between p-7">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Featured Auction</span>
            <h3 className="mt-2 text-2xl font-bold text-text-primary transition-colors duration-150 group-hover:text-primary-300">
              {title}
            </h3>
            {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
          </div>

          <div className="mt-6">
            {/* Bid row */}
            <div className="flex items-end justify-between rounded-xl bg-bg-surface px-4 py-3.5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Current Bid</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-auction">{currentBid}</p>
                <p className="mt-0.5 text-xs text-text-muted">{bids} total bids</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-text-muted">Ends in</p>
                <p className="mt-1 font-mono text-xl font-bold text-text-primary">{timeLeft}</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/auctions"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:bg-primary-500 hover:-translate-y-0.5 no-underline"
            >
              Bid Now
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="8" x2="13" y2="8" />
                <polyline points="9 4 13 8 9 12" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Standard auction card ────────────────────────────────────────────────────

function AuctionCard({ title, category, currentBid, bids, timeLeft, urgent, gradient, image }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-600/20 hover:shadow-modal">

      {/* Image area — real photo with gradient fallback */}
      <div className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${gradient}`}>

        {/* Product image */}
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Hide broken img — gradient background shows through as fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Subtle overlay — keeps badges readable over any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />

        {/* Shimmer on hover — sits above image */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full pointer-events-none" aria-hidden="true" />

        {/* Category */}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {category}
        </span>

        {/* Ending soon badge */}
        {urgent && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Ending Soon
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg-card/60 to-transparent pointer-events-none" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-text-primary transition-colors duration-150 group-hover:text-primary-300">
          {title}
        </h3>

        {/* Bid info */}
        <div className="mt-3 flex items-end justify-between rounded-xl bg-bg-surface px-3 py-2.5">
          <div>
            <p className="text-[10px] font-medium text-text-muted">Current Bid</p>
            <p className="mt-0.5 text-lg font-bold text-auction">{currentBid}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium text-text-muted">Bids</p>
            <p className="mt-0.5 text-sm font-semibold text-text-secondary">{bids}</p>
          </div>
        </div>

        {/* Timer */}
        <div className={['mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold', urgent ? 'bg-danger/10 text-danger' : 'bg-bg-surface text-text-secondary'].join(' ')}>
          <ClockIcon />
          {urgent ? `⚡ ${timeLeft} left` : `${timeLeft} remaining`}
        </div>

        {/* CTA */}
        <Link
          to="/auctions"
          className="mt-3 flex h-9 items-center justify-center rounded-xl bg-primary-600 text-xs font-semibold text-white transition-colors duration-150 hover:bg-primary-500 no-underline"
        >
          Bid Now
        </Link>
      </div>
    </div>
  );
}

// ─── FeaturedAuctions ─────────────────────────────────────────────────────────

function FeaturedAuctions() {
  return (
    <section className="bg-bg-base py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* Section header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-auction/25 bg-auction/8 px-4 py-1.5 text-sm font-semibold text-auction">
              Live Right Now
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Featured{' '}
              <span className="bg-gradient-to-r from-primary-300 to-violet-light bg-clip-text text-transparent">
                Auctions
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-text-muted">
              Hand-picked items ending soon. Place your bid before it's too late.
            </p>
          </div>

          <Link
            to="/auctions"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-bg-card px-5 py-2.5 text-sm font-semibold text-text-primary shadow-card transition-all duration-150 hover:border-primary-600/40 hover:text-primary-300 no-underline"
          >
            View All Auctions
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="9 4 13 8 9 12" />
            </svg>
          </Link>
        </div>

        {/* Grid — featured card spans 2 cols on md+, standard cards fill remaining */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured hero card — spans full width on mobile, 2 cols on md+ */}
          <FeaturedCard {...FEATURED} />

          {/* Standard cards */}
          {AUCTIONS.map((auction) => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-primary-600/15 bg-bg-surface px-8 py-10 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold text-text-primary">
                Ready to start bidding?
              </h3>
              <p className="mt-2 text-base text-text-muted">
                Create your free account and join thousands of active bidders today. No listing fees. No hidden charges.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-dropdown transition-all duration-150 hover:bg-primary-500 hover:-translate-y-0.5 no-underline"
              >
                Get Started Free
              </Link>
              <Link
                to="/auctions"
                className="rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-secondary transition-all duration-150 hover:border-primary-600/40 hover:text-primary-300 no-underline"
              >
                Browse Auctions
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedAuctions;
