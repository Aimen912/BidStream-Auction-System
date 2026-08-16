import { Link } from 'react-router-dom';

// ─── Hero card data ───────────────────────────────────────────────────────────
//
// Images: curated Unsplash URLs — stable, no auth, no new deps.
//   Primary  → Rolex Submariner   (front / centre)
//   Left     → Vintage Leica M6   (back-left, rotated slightly CCW)
//   Right    → Air Jordan 1 OG    (back-right, rotated slightly CW)

const PRIMARY_CARD = {
  image:      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80&fit=crop',
  category:   'Luxury Timepieces',
  title:      'Rolex Submariner Date',
  subtitle:   'Ref. 126610LN · 2023 · Unworn',
  currentBid: '$12,500',
  bids:       93,
  timeLeft:   '4h 52m',
  bidder:     'A***n',
};

const SECONDARY_CARDS = [
  {
    image:    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=400&q=80&fit=crop',
    category: 'Photography',
    title:    'Vintage Leica M6',
    bid:      '$1,240',
  },
  {
    image:    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop',
    category: 'Fashion',
    title:    'Air Jordan 1 OG',
    bid:      '$3,800',
  },
];

// ─── Background cards (decorative depth layer) ───────────────────────────────
// Smaller, lower-opacity, lower-z cards that fill the empty corners of the
// cluster and give the composition more depth. They reuse the same visual
// language as secondary cards but are visually subordinate.

const BACKGROUND_CARDS = [
  {
    // Top-right — Patek Philippe Nautilus (complements the watch theme)
    image:    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=75&fit=crop',
    category: 'Luxury',
    title:    'Patek Philippe Nautilus',
    bid:      '$48,000',
  },
  {
    // Bottom-left — Gibson Les Paul (music/collectibles category)
    image:    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&q=75&fit=crop',
    category: 'Music',
    title:    'Gibson Les Paul \'59',
    bid:      '$2,150',
  },
];

function ArrowRight({ size = 14 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 16 16"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9 4 13 8 9 12" />
    </svg>
  );
}

// ─── LiveDot ──────────────────────────────────────────────────────────────────

function LiveDot({ size = 'md' }) {
  const dim = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  return (
    <span className={`relative flex shrink-0 ${dim}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
      <span className={`relative inline-flex ${dim} animate-live-pulse rounded-full bg-success`} />
    </span>
  );
}

// ─── PrimaryCard ─────────────────────────────────────────────────────────────
// w-[280px] — visible but not overwhelming.
// Does NOT apply any transform via className; the parent wrapper handles
// absolute positioning and the inner wrapper handles float.

function PrimaryCard() {
  return (
    <div
      className={[
        'group w-[280px] overflow-hidden rounded-2xl',
        'border border-white/12 bg-bg-card',
        'shadow-[0_24px_60px_rgba(0,0,0,0.6)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:scale-[1.02]',
        'hover:border-primary-600/30',
        'hover:shadow-[0_32px_72px_rgba(0,0,0,0.7),0_0_0_1px_rgba(79,70,229,0.18)]',
        'cursor-default',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-bg-elevated">
        <img
          src={PRIMARY_CARD.image}
          alt={PRIMARY_CARD.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.classList.add(
              'bg-gradient-to-br', 'from-primary-700', 'via-primary-600', 'to-violet'
            );
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-card/55 via-transparent to-black/15" />

        {/* Category */}
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          {PRIMARY_CARD.category}
        </span>

        {/* LIVE */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 backdrop-blur-sm">
          <LiveDot size="sm" />
          <span className="text-[10px] font-bold text-success">LIVE</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-[13px] font-bold leading-tight text-text-primary">{PRIMARY_CARD.title}</h3>
        <p className="mt-0.5 text-[10px] text-text-muted">{PRIMARY_CARD.subtitle}</p>

        <div className="my-3 h-px bg-border-subtle" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-text-muted">Current Bid</p>
            <p className="mt-0.5 text-[22px] font-bold tracking-tight text-auction">{PRIMARY_CARD.currentBid}</p>
            <p className="mt-0.5 text-[9px] text-text-muted">{PRIMARY_CARD.bids} bids</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-medium text-text-muted">Ends in</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-text-primary">{PRIMARY_CARD.timeLeft}</p>
          </div>
        </div>

        <Link
          to="/auctions"
          className={[
            'mt-3 flex h-9 w-full items-center justify-center gap-1.5',
            'rounded-xl bg-primary-600 text-xs font-semibold text-white',
            'no-underline transition-all duration-200',
            'hover:bg-primary-500 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(79,70,229,0.4)]',
            'active:translate-y-0 active:scale-[0.98]',
          ].join(' ')}
        >
          Place a Bid
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─── SecondaryCard ────────────────────────────────────────────────────────────
// w-[210px] — clearly visible, not overwhelming.

function SecondaryCard({ image, category, title, bid }) {
  return (
    <div
      className={[
        'group w-[210px] overflow-hidden rounded-xl',
        'border border-white/10 bg-bg-elevated/95',
        'shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
        'backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:scale-[1.02]',
        'hover:border-white/18',
        'hover:shadow-[0_20px_48px_rgba(0,0,0,0.65)]',
        'cursor-default',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative h-[100px] w-full overflow-hidden rounded-t-xl bg-bg-card">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-bg-card', 'to-bg-elevated');
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated/55 via-transparent to-black/10" />
        <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="p-2.5">
        <p className="text-[11px] font-semibold leading-tight text-text-primary">{title}</p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[9px] text-text-muted">Current bid</span>
          <span className="text-[11px] font-bold text-auction">{bid}</span>
        </div>
        <Link
          to="/auctions"
          className={[
            'mt-2 flex h-6 w-full items-center justify-center rounded-lg',
            'bg-primary-600/90 text-[10px] font-semibold text-white no-underline',
            'transition-all duration-150',
            'hover:bg-primary-500 hover:-translate-y-px',
            'active:translate-y-0 active:scale-[0.98]',
          ].join(' ')}
        >
          Bid Now
        </Link>
      </div>
    </div>
  );
}

// ─── BackgroundCard ───────────────────────────────────────────────────────────
// Decorative depth layer — smaller, slightly transparent, no hover CTA.
// Same visual language as SecondaryCard but clearly subordinate.

function BackgroundCard({ image, category, title, bid }) {
  return (
    <div
      className={[
        'w-[170px] overflow-hidden rounded-xl',
        'border border-white/8 bg-bg-elevated/70',
        'shadow-[0_8px_24px_rgba(0,0,0,0.45)]',
        'backdrop-blur-sm opacity-80',
        'transition-opacity duration-300 hover:opacity-95',
        'cursor-default',
      ].join(' ')}
    >
      {/* Image */}
      <div className="relative h-[80px] w-full overflow-hidden rounded-t-xl bg-bg-card">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-bg-card', 'to-bg-elevated');
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated/60 via-transparent to-black/10" />
        <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-1.5 py-px text-[8px] font-semibold text-white backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="p-2">
        <p className="text-[10px] font-semibold leading-tight text-text-primary">{title}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[8px] text-text-muted">Bid</span>
          <span className="text-[10px] font-bold text-auction">{bid}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background-primary pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">

      {/* Atmospheric glows — subtle, never dominant */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-primary-600/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-violet/8 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-auction/6 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">

          {/* ══════════════════════════════════════
              LEFT — Hero copy
          ══════════════════════════════════════ */}
          <div className="flex flex-col items-start">

            {/* Live badge */}
            <div
              className="mb-5 flex items-center gap-2 rounded-full border border-success/25 bg-success/8 px-4 py-2 animate-hero-enter"
              style={{ animationDelay: '0ms' }}
            >
              <LiveDot />
              <span className="text-sm font-semibold tracking-wide text-success">
                Live Auctions Happening Now
              </span>
            </div>

            {/* Headline
                Animation wraps the OUTER div, NOT the h1 itself.
                This prevents the scale(0.98) entrance transform from
                interfering with bg-clip-text painting inside the h1.
                Line 1: "Bid on what" — white, inherits from h1.
                Line 2: "you want."   — indigo→violet gradient span.
                The span wraps the full phrase (not just "you") so
                bg-clip-text has sufficient width to paint reliably. */}
            <div
              className="animate-hero-enter"
              style={{ animationDelay: '100ms' }}
            >
              <h1 className="font-display text-5xl font-bold leading-[1.12] tracking-tight text-white lg:text-[3.5rem]">
                Bid on what
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #A5AEFB, #A78BFA, #7C3AED)',
                  }}
                >
                  you want.
                </span>
              </h1>
            </div>

            {/* Description */}
            <p
              className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary animate-hero-enter"
              style={{ animationDelay: '200ms' }}
            >
              BidStream is a real-time auction platform where verified buyers and sellers compete
              fairly — with live bids, instant results, and every transaction secured end-to-end.
            </p>

            {/* CTAs */}
            <div
              className="mt-8 flex flex-wrap items-center gap-4 animate-hero-enter"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                to="/auctions"
                className={[
                  'inline-flex items-center gap-2.5 rounded-xl bg-primary-600',
                  'px-7 py-3.5 text-base font-semibold text-white',
                  'shadow-dropdown no-underline',
                  'transition-all duration-200',
                  'hover:bg-primary-500 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)]',
                  'active:translate-y-0 active:scale-[0.98]',
                ].join(' ')}
              >
                Explore Auctions
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className={[
                  'inline-flex items-center gap-2.5 rounded-xl',
                  'border border-white/15 bg-bg-elevated/40',
                  'px-7 py-3.5 text-base font-semibold text-white',
                  'backdrop-blur-sm no-underline',
                  'transition-all duration-200',
                  'hover:border-white/30 hover:bg-bg-elevated/60 hover:-translate-y-px',
                  'active:translate-y-0 active:scale-[0.98]',
                ].join(' ')}
              >
                Start Selling
              </Link>
            </div>

            {/* Trust metrics */}
            <div
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 animate-hero-enter"
              style={{ animationDelay: '400ms' }}
            >
              {[
                { value: '48K+',  label: 'Active Bidders'    },
                { value: '$2.4M', label: 'Monthly Volume'    },
                { value: '99.4%', label: 'Positive Feedback' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-sm text-text-muted">{label}</span>
                </div>
              ))}
              <div className="hidden h-10 w-px bg-border sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['A', 'K', 'R', 'Z'].map((initial) => (
                    <span
                      key={initial}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background-primary bg-gradient-to-br from-primary-600 to-violet text-[10px] font-bold text-white"
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-text-muted">+48K bidders</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT — Three-card cluster

              Container is 560px wide × 500px tall on desktop.
              All cards and badges are positioned absolutely WITHIN
              this container — nothing escapes it.

              Card positions (px values, relative to container top-left):

              ┌──────────────────────────────────────────┐  h=500
              │                                          │
              │  CAMERA (210px wide)                     │
              │  top:30  left:0  z:10  rotate(-4deg)     │
              │                                          │
              │         ROLEX (280px wide)               │
              │         top:80  left:110  z:30           │
              │                                          │
              │                   SNEAKER (210px wide)   │
              │                   top:220 right:0  z:20  │
              │                   rotate(4deg)           │
              │                                          │
              └──────────────────────────────────────────┘

              All three cards are FULLY visible simultaneously.
              Rolex overlaps the bottom of camera and top of sneaker
              by ~40–50px — intentional premium layering.

              Animation strategy:
              • Outer absolute div → position + z-index + entrance anim
              • Inner div → continuous float animation
              This prevents entrance/float transform conflicts.
          ══════════════════════════════════════ */}
          <div className="relative hidden lg:flex lg:justify-center">
            {/*
              Card cluster — self-contained relative box.
              Width 560px × Height 500px provides room for all three
              cards plus the overlapping badges.
            */}
            <div className="relative flex-shrink-0" style={{ width: '560px', height: '500px' }}>

              {/* Soft background glow behind the cluster only */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-8 rounded-3xl bg-primary-600/10 blur-3xl"
              />

              {/* ── BACKGROUND card A — top-right corner, z:5
                  Patek Philippe — sits behind all main cards.
                  Rotated slightly CW, partially peeking from top-right.
                  Entrance: fades in with hero-enter.
                  Float: float-4 (9s, very subtle).
              */}
              <div
                className="absolute animate-hero-enter"
                style={{ top: '0px', right: '10px', zIndex: 5, animationDelay: '300ms' }}
              >
                <div className="animate-float-4" style={{ transform: 'rotate(6deg)' }}>
                  <BackgroundCard {...BACKGROUND_CARDS[0]} />
                </div>
              </div>

              {/* ── BACKGROUND card B — bottom-left corner, z:5
                  Gibson Les Paul — sits behind all main cards.
                  Rotated slightly CCW, partially peeking from bottom-left.
                  Entrance: fades in with hero-enter.
                  Float: float-5 (8s, very subtle).
              */}
              <div
                className="absolute animate-hero-enter"
                style={{ bottom: '10px', left: '10px', zIndex: 5, animationDelay: '320ms' }}
              >
                <div className="animate-float-5" style={{ transform: 'rotate(-5deg)' }}>
                  <BackgroundCard {...BACKGROUND_CARDS[1]} />
                </div>
              </div>

              {/* ── CAMERA card — back-left, z:10
                  Entrance: cardEnterUp (slides from below)
                  Float:    float-1 (6s, −8px)
                  The outer div carries absolute position + entrance delay.
                  The inner div carries the infinite float transform.
                  The card itself carries its own hover transform.
              */}
              <div
                className="absolute animate-card-enter-up"
                style={{ top: '30px', left: '0px', zIndex: 10, animationDelay: '250ms' }}
              >
                <div className="animate-float-1" style={{ transform: 'rotate(-4deg)' }}>
                  <SecondaryCard {...SECONDARY_CARDS[0]} />
                </div>
              </div>

              {/* ── ROLEX card — front-centre, z:30
                  Entrance: cardEnterDown (slides from above)
                  Float:    float-2 (7s, +6px)
                  No rotation — this is the primary focal card.
              */}
              <div
                className="absolute animate-card-enter-down"
                style={{ top: '80px', left: '110px', zIndex: 30, animationDelay: '450ms' }}
              >
                <div className="animate-float-2">
                  <PrimaryCard />
                </div>
              </div>

              {/* ── SNEAKER card — mid-right, z:20
                  Entrance: cardEnterRight (slides from right)
                  Float:    float-3 (5s, −5px)
              */}
              <div
                className="absolute animate-card-enter-right"
                style={{ top: '220px', right: '0px', zIndex: 20, animationDelay: '350ms' }}
              >
                <div className="animate-float-3" style={{ transform: 'rotate(4deg)' }}>
                  <SecondaryCard {...SECONDARY_CARDS[1]} />
                </div>
              </div>

              {/* ── Verified Item badge — anchored near top-right of Rolex card
                  Rolex card: left:110 width:280 → right edge ~390px
                  Badge sits at right:80, top:60 → near Rolex's top-right corner.
              */}
              <div
                className="absolute z-40 flex items-center gap-1.5 rounded-full border border-success/30 bg-bg-card/90 px-3 py-1.5 shadow-dropdown backdrop-blur-sm animate-hero-enter"
                style={{ top: '60px', right: '80px', animationDelay: '520ms' }}
              >
                <svg
                  width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="text-success" aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[11px] font-semibold text-success">Verified Item</span>
              </div>

            </div>
          </div>

          {/* ── Mobile fallback — stacked vertically below left copy ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            <PrimaryCard />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {SECONDARY_CARDS.map((card) => (
                <div key={card.title} className="flex-shrink-0">
                  <SecondaryCard {...card} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
