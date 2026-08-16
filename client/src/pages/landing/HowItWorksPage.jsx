import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// ─── Shared utilities ─────────────────────────────────────────────────────────

function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9 4 13 8 9 12" />
    </svg>
  );
}

function SectionBadge({ children, color = 'indigo' }) {
  const colors = {
    indigo: 'border-primary-600/20 bg-primary-600/8 text-primary-300',
    amber:  'border-auction/25     bg-auction/8      text-auction',
    green:  'border-success/25     bg-success/8      text-success',
    violet: 'border-violet/20      bg-violet/8       text-violet-light',
  };
  return (
    <span className={`mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

// ─── Auction process steps (01–07) ───────────────────────────────────────────

const AUCTION_STEPS = [
  {
    number: '01',
    title: 'Create Your Account',
    body: 'Register in under a minute. Choose your role — Buyer, Seller, or both — and unlock full access to the platform.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    accent: 'from-primary-600 to-primary-500',
    label: 'text-primary-300',
  },
  {
    number: '02',
    title: 'Discover Auctions',
    body: 'Browse the auction feed, search by keyword, and filter by category, status, or price to find exactly what you want.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    accent: 'from-violet to-primary-600',
    label: 'text-violet-light',
  },
  {
    number: '03',
    title: 'Place Your Bid',
    body: 'Enter an amount greater than the current highest bid and confirm. Your bid is immediately registered and reflected in real time.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    accent: 'from-auction-dark to-auction',
    label: 'text-auction',
  },
  {
    number: '04',
    title: 'Compete in Real Time',
    body: 'Other bidders can respond while the auction is active. The live countdown and current highest bid update instantly for everyone.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: 'from-primary-700 to-violet',
    label: 'text-primary-300',
  },
  {
    number: '05',
    title: 'Anti-Sniping Protection',
    body: 'A bid placed in the final 10 seconds automatically extends the countdown to 30 seconds — giving every genuine bidder a fair chance to respond.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    accent: 'from-success/80 to-success',
    label: 'text-success',
  },
  {
    number: '06',
    title: 'Auction Ends',
    body: 'When the countdown reaches zero and no valid extension occurs, the auction closes. The highest eligible bid at that moment wins.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    ),
    accent: 'from-primary-600 to-primary-400',
    label: 'text-primary-300',
  },
  {
    number: '07',
    title: 'Winner & Order',
    body: 'The winning result is recorded. Both buyer and seller can view the outcome and associated order details directly in their dashboards.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    accent: 'from-success/80 to-success',
    label: 'text-success',
  },
];

// ─── Buyer steps ──────────────────────────────────────────────────────────────

const BUYER_STEPS = [
  { n: '01', title: 'Register / Login',        body: 'Create a Buyer account or log in to access the full auction experience.' },
  { n: '02', title: 'Browse the Auction Feed', body: 'View all active, upcoming, and ending-soon auctions on the main auction page.' },
  { n: '03', title: 'Search & Filter',         body: 'Use the search bar, category filters, and sort options to narrow down items.' },
  { n: '04', title: 'Open Auction Details',    body: 'Click any auction to view full item details, images, description, and live bid history.' },
  { n: '05', title: 'Monitor the Current Bid', body: 'Watch the live bid amount and countdown update in real time without refreshing.' },
  { n: '06', title: 'Place Your Bid',          body: 'Enter a bid above the current highest bid and confirm to enter the competition.' },
  { n: '07', title: 'Watch the Countdown',     body: 'Track the timer. If you\'re outbid, you can respond before the auction closes.' },
  { n: '08', title: 'Respond to Outbids',      body: 'If another bidder surpasses you, you receive an alert and can place a new bid while time allows.' },
  { n: '09', title: 'Win the Auction',         body: 'If your bid is the highest when the auction ends, you are declared the winner.' },
  { n: '10', title: 'View Order Result',       body: 'The winning outcome is recorded in your Orders section within the Buyer dashboard.' },
];

// ─── Seller steps ─────────────────────────────────────────────────────────────

const SELLER_STEPS = [
  { n: '01', title: 'Register / Login as Seller', body: 'Create a Seller account or log into your existing Seller profile.' },
  { n: '02', title: 'Create an Auction',           body: 'From the Seller dashboard, select Create Auction to start a new listing.' },
  { n: '03', title: 'Add Item Information',        body: 'Enter the item title, description, category, and upload relevant photos.' },
  { n: '04', title: 'Set Auction Details',         body: 'Configure the starting price, auction duration, and any relevant conditions.' },
  { n: '05', title: 'Publish the Auction',         body: 'Once ready, publish the auction so it becomes visible to all registered buyers.' },
  { n: '06', title: 'Monitor Live Bidding',        body: 'Use the Seller Live Control Room to watch bids arrive and track the countdown in real time.' },
  { n: '07', title: 'Manage the Live Auction',     body: 'The Seller Live Monitor provides a real-time view of all bidding activity for your auction.' },
  { n: '08', title: 'Watch Bids in Real Time',     body: 'See each new bid reflected instantly. The current highest bidder and amount update continuously.' },
  { n: '09', title: 'Auction Ends',                body: 'When the countdown reaches zero without extension, the auction closes automatically.' },
  { n: '10', title: 'Review Winner / Orders',      body: 'Access the winner information and order record through the Seller Orders and Analytics sections.' },
];

// ─── Admin steps ──────────────────────────────────────────────────────────────

const ADMIN_STEPS = [
  { n: '01', title: 'Admin Login',            body: 'Access the admin panel through the dedicated Admin Login route (/admin/login).' },
  { n: '02', title: 'Monitor Platform',       body: 'The Admin Dashboard provides a high-level overview of platform activity, active auctions, and user stats.' },
  { n: '03', title: 'Manage Users',           body: 'View, search, and manage all registered buyers and sellers through the Users management panel.' },
  { n: '04', title: 'Manage Auctions',        body: 'Oversee all auctions across the platform — active, upcoming, and completed.' },
  { n: '05', title: 'Manage Categories',      body: 'Create, edit, and organise the auction categories available to sellers.' },
  { n: '06', title: 'Monitor Reports',        body: 'Review user-submitted reports and platform activity flags in the Reports section.' },
  { n: '07', title: 'Handle Disputes',        body: 'Access and manage disputes raised between buyers and sellers through the Disputes panel.' },
  { n: '08', title: 'Review Analytics',       body: 'Use the Analytics section to track auction volume, bidding trends, and overall platform performance.' },
  { n: '09', title: 'Manage Settings',        body: 'Configure platform-wide settings through the Admin Settings panel.' },
];

// ─── Role comparison data ─────────────────────────────────────────────────────

const ROLES = [
  {
    title: 'Buyer',
    color: 'border-primary-600/25 bg-primary-600/5',
    badge: 'bg-primary-600/15 text-primary-300 border-primary-600/20',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    items: [
      'Discover & browse auctions',
      'Search and filter listings',
      'Place live bids',
      'Track active auctions',
      'Receive outbid alerts',
      'View winning results & orders',
    ],
    cta: { label: 'Start Bidding', to: '/register' },
  },
  {
    title: 'Seller',
    color: 'border-auction/25 bg-auction/5',
    badge: 'bg-auction/15 text-auction border-auction/20',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    items: [
      'Create & publish auctions',
      'Manage item listings',
      'Control the live auction room',
      'Monitor bidding in real time',
      'View auction outcomes',
      'Review winner & order records',
    ],
    cta: { label: 'Start Selling', to: '/register' },
  },
  {
    title: 'Admin',
    color: 'border-violet/25 bg-violet/5',
    badge: 'bg-violet/15 text-violet-light border-violet/20',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    items: [
      'Manage all users',
      'Oversee all auctions',
      'Organise categories',
      'Review reports & disputes',
      'Access analytics & insights',
      'Manage platform settings',
    ],
    cta: { label: 'Admin Login', to: '/admin/login' },
  },
];

// ─── Reusable step row (numbered timeline item) ───────────────────────────────

function TimelineStep({ n, title, body, accent = 'bg-primary-600/15 text-primary-300' }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${accent}`}>
          {n}
        </div>
        <div className="mt-2 w-px flex-1 bg-border-subtle" />
      </div>
      <div className="pb-6">
        <p className="text-sm font-bold text-text-primary">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">{body}</p>
      </div>
    </div>
  );
}

// ─── HowItWorksPage ───────────────────────────────────────────────────────────

function HowItWorksPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-background-primary pt-32 pb-20 lg:pt-36 lg:pb-24">

          {/* Ambient glows */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet/8 blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
            <div className="animate-hero-enter" style={{ animationDelay: '0ms' }}>
              <SectionBadge color="indigo">How BidStream Works</SectionBadge>
            </div>

            <div className="animate-hero-enter" style={{ animationDelay: '80ms' }}>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Buy. Sell. Bid.
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(to right, #A5AEFB, #A78BFA, #7C3AED)' }}
                >
                  With Confidence.
                </span>
              </h1>
            </div>

            <div className="animate-hero-enter" style={{ animationDelay: '160ms' }}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                Everything you need to participate in secure, real-time auctions — from discovering
                an item to viewing the winning result.
              </p>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-hero-enter"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                to="/auctions"
                className="inline-flex items-center gap-2.5 rounded-xl bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-dropdown no-underline transition-all duration-200 hover:bg-primary-500 hover:-translate-y-px active:scale-[0.98]"
              >
                Explore Auctions <ArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-bg-elevated/40 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm no-underline transition-all duration-200 hover:border-white/30 hover:bg-bg-elevated/60 hover:-translate-y-px active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>

            {/* Quick-stats bar */}
            <div
              className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border animate-hero-enter"
              style={{ animationDelay: '320ms' }}
            >
              {[
                { v: '7 Steps',  l: 'Clear Auction Process' },
                { v: '3 Roles',  l: 'Buyer · Seller · Admin' },
                { v: '< 10 sec', l: 'Anti-Snipe Threshold'  },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center gap-1 bg-bg-card px-4 py-5">
                  <span className="text-2xl font-bold text-white">{v}</span>
                  <span className="text-xs text-text-muted">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            OVERALL AUCTION FLOW — 7 STEPS
        ════════════════════════════════════════════════════════ */}
        <section className="bg-bg-card py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">

            {/* Header — max-w-4xl gives enough room for the full heading at lg:text-4xl */}
            <div className="mx-auto mb-16 max-w-4xl text-center">
              <SectionBadge color="indigo">The Auction Process</SectionBadge>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl lg:whitespace-nowrap">
                How the Auction{' '}
                <span className="bg-gradient-to-r from-primary-300 to-violet-light bg-clip-text text-transparent">
                  Process Works
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
                A complete look at the BidStream auction lifecycle — from registration to the winning result.
              </p>
            </div>

            {/* Step grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUCTION_STEPS.slice(0, 4).map((step) => (
                <AuctionStepCard key={step.number} {...step} />
              ))}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AUCTION_STEPS.slice(4).map((step) => (
                <AuctionStepCard key={step.number} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            LIVE BIDDING
        ════════════════════════════════════════════════════════ */}
        <section className="bg-background-primary py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* Text */}
              <div>
                <SectionBadge color="green">Real-Time</SectionBadge>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl lg:whitespace-nowrap">
                  Built for Real-Time Bidding
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-text-muted">
                  BidStream uses real-time WebSocket connections so every bid update,
                  countdown tick, and state change reaches every participant instantly —
                  no page refresh required.
                </p>
                <ul className="mt-8 flex flex-col gap-4">
                  {[
                    { icon: '⚡', text: 'Bids are registered and reflected instantly across all connected clients.' },
                    { icon: '👁️', text: 'The current highest bid and bidder are always visible during an active auction.' },
                    { icon: '⏱️', text: 'A live countdown is displayed throughout the auction, ticking down in real time.' },
                    { icon: '🏆', text: 'Multiple buyers can compete simultaneously with complete fairness.' },
                  ].map(({ icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-600/15 text-sm">
                        {icon}
                      </span>
                      <span className="text-base text-text-secondary">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock live-auction card */}
              <LiveAuctionMock />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ANTI-SNIPING
        ════════════════════════════════════════════════════════ */}
        <section className="bg-bg-card py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* Anti-snipe visual */}
              <div className="order-2 lg:order-1">
                <AntiSnipeVisual />
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <SectionBadge color="amber">Fair Bidding</SectionBadge>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl lg:whitespace-nowrap">
                  No Last-Second{' '}
                  <span className="text-auction">Surprise</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-text-muted">
                  Last-second "sniping" — placing a bid in the final moments to prevent
                  fair competition — is neutralised by BidStream's built-in protection.
                </p>
                <div className="mt-6 rounded-2xl border border-auction/20 bg-auction/5 p-6">
                  <p className="text-base font-semibold text-auction">How It Works</p>
                  <p className="mt-2 text-base leading-relaxed text-text-secondary">
                    When a valid bid is placed during the final{' '}
                    <span className="font-bold text-auction">10 seconds</span> of an auction,
                    the countdown is automatically extended to{' '}
                    <span className="font-bold text-auction">30 seconds</span>. This gives
                    all genuine bidders a meaningful opportunity to respond before the auction closes.
                  </p>
                </div>
                <p className="mt-4 text-sm text-text-muted">
                  This process can repeat as many times as legitimate last-second bids arrive,
                  ensuring the auction always ends at a fair moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            BUYER WORKFLOW
        ════════════════════════════════════════════════════════ */}
        <section className="bg-background-primary py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[auto_1fr]">

              {/* Sticky heading column */}
              <div className="lg:sticky lg:top-28 lg:self-start lg:max-w-xs xl:max-w-sm">
                <SectionBadge color="indigo">Buyer Journey</SectionBadge>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl lg:whitespace-nowrap">
                  The Buyer Journey
                </h2>
                <p className="mt-4 text-base leading-relaxed text-text-muted">
                  From browsing your first auction to tracking your winning order — the complete buyer experience.
                </p>
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-primary-500 hover:-translate-y-px active:scale-[0.98]"
                >
                  Register as Buyer <ArrowRight size={13} />
                </Link>
              </div>

              {/* Timeline */}
              <div className="flex flex-col">
                {BUYER_STEPS.map((step) => (
                  <TimelineStep
                    key={step.n}
                    {...step}
                    accent="bg-primary-600/15 text-primary-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SELLER WORKFLOW
        ════════════════════════════════════════════════════════ */}
        <section className="bg-bg-card py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[auto_1fr]">

              {/* Sticky heading column */}
              <div className="lg:sticky lg:top-28 lg:self-start lg:max-w-xs xl:max-w-sm">
                <SectionBadge color="amber">Seller Journey</SectionBadge>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl lg:whitespace-nowrap">
                  For{' '}
                  <span className="text-auction">Sellers</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-text-muted">
                  Create, publish, and manage live auctions — all from a dedicated seller workspace.
                </p>
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-auction/30 bg-auction/10 px-6 py-3 text-sm font-semibold text-auction no-underline transition-all duration-200 hover:bg-auction/15 hover:-translate-y-px active:scale-[0.98]"
                >
                  Register as Seller <ArrowRight size={13} />
                </Link>
              </div>

              {/* Timeline */}
              <div className="flex flex-col">
                {SELLER_STEPS.map((step) => (
                  <TimelineStep
                    key={step.n}
                    {...step}
                    accent="bg-auction/15 text-auction"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ADMIN WORKFLOW
        ════════════════════════════════════════════════════════ */}
        <section className="bg-background-primary py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[auto_1fr]">

              {/* Sticky heading column */}
              <div className="lg:sticky lg:top-28 lg:self-start lg:max-w-xs xl:max-w-sm">
                <SectionBadge color="violet">Administrator</SectionBadge>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl lg:whitespace-nowrap">
                  For{' '}
                  <span className="text-violet-light">Admins</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-text-muted">
                  A comprehensive admin panel for overseeing every aspect of the platform.
                </p>
              </div>

              {/* Timeline */}
              <div className="flex flex-col">
                {ADMIN_STEPS.map((step) => (
                  <TimelineStep
                    key={step.n}
                    {...step}
                    accent="bg-violet/15 text-violet-light"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SECURITY / TRUST
        ════════════════════════════════════════════════════════ */}
        <section className="bg-bg-card py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-14 max-w-4xl text-center">
              <SectionBadge color="green">Trust & Security</SectionBadge>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl lg:whitespace-nowrap">
                Designed for{' '}
                <span className="text-success">Trust</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
                BidStream is built with security and access control at every layer.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '🔒',
                  title: 'Secure Authentication',
                  body: 'All user sessions are protected. Passwords are hashed and access tokens are managed securely on every request.',
                },
                {
                  icon: '🎭',
                  title: 'Role-Based Access Control',
                  body: 'Each role — Buyer, Seller, Admin — has a distinct set of permissions. Routes and actions are protected server-side.',
                },
                {
                  icon: '🛡️',
                  title: 'Protected Routes',
                  body: 'Unauthenticated or unauthorised access attempts are intercepted by route guards before any content is displayed.',
                },
                {
                  icon: '⚖️',
                  title: 'Controlled Auction State',
                  body: 'Auction state transitions (live → ended → settled) are managed server-side and cannot be manipulated by clients.',
                },
                {
                  icon: '📋',
                  title: 'Verified Auction Records',
                  body: 'Every bid, auction event, and order outcome is recorded. The winner is determined by the server, not the client.',
                },
                {
                  icon: '🔍',
                  title: 'Admin Oversight',
                  body: 'All platform activity is visible to administrators through the dashboard, reports, disputes, and analytics panels.',
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-bg-elevated p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-success/25 hover:shadow-modal"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-xl">
                    {icon}
                  </span>
                  <h3 className="mb-2 text-base font-bold text-text-primary">{title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            ROLE COMPARISON
        ════════════════════════════════════════════════════════ */}
        <section className="bg-background-primary py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto mb-14 max-w-4xl text-center">
              <SectionBadge color="indigo">Roles at a Glance</SectionBadge>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl lg:whitespace-nowrap">
                Who Does What?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
                BidStream serves three distinct roles. Here's a quick breakdown of each.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {ROLES.map(({ title, color, badge, icon, items, cta }) => (
                <div
                  key={title}
                  className={`flex flex-col rounded-2xl border p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-modal ${color}`}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${badge}`}>
                      {icon}
                    </span>
                    <span className={`rounded-full border px-3 py-0.5 text-sm font-bold ${badge}`}>
                      {title}
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                          strokeLinejoin="round" className="shrink-0 text-success" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to={cta.to}
                    className="mt-7 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-bg-elevated text-xs font-semibold text-text-primary no-underline transition-all duration-150 hover:bg-bg-card hover:text-white"
                  >
                    {cta.label} <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-bg-card py-28 lg:py-36">
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-violet/8 blur-[80px]" />

          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-bg-elevated px-4 py-1.5 text-sm font-semibold text-text-muted">
              Get Started Today
            </span>

            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl lg:whitespace-nowrap">
              Ready to Start{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(to right, #A5AEFB, #A78BFA, #7C3AED)' }}
              >
                Bidding?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              Explore live auctions or create an account and start participating in the BidStream marketplace.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/auctions"
                className="inline-flex items-center gap-2.5 rounded-xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-dropdown no-underline transition-all duration-200 hover:bg-primary-500 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Explore Auctions <ArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-bg-elevated/40 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm no-underline transition-all duration-200 hover:border-white/30 hover:bg-bg-elevated/60 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-text-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-success" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              No hidden fees · Free to register · Cancel any time
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ─── AuctionStepCard ──────────────────────────────────────────────────────────
// Used in the 7-step grid section.

function AuctionStepCard({ number, title, body, icon, accent, label }) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-bg-elevated p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/20 hover:shadow-modal">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-card`}>
          {icon}
        </div>
        <span className={`text-xs font-bold uppercase tracking-widest ${label}`}>
          Step {number}
        </span>
      </div>
      <div>
        <h3 className="mb-1.5 text-base font-bold text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-muted">{body}</p>
      </div>
    </div>
  );
}

// ─── LiveAuctionMock ──────────────────────────────────────────────────────────
// A stylised mock of a live auction card to illustrate real-time bidding.

function LiveAuctionMock() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-bg-elevated shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-bold text-success">LIVE NOW</span>
        </div>
        <span className="rounded-full border border-primary-600/20 bg-primary-600/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary-300">
          Luxury Timepieces
        </span>
      </div>

      {/* Item */}
      <div className="p-4">
        <p className="text-sm font-bold text-text-primary">Rolex Submariner Date</p>
        <p className="mt-0.5 text-[10px] text-text-muted">Ref. 126610LN · 2023 · Unworn</p>

        <div className="my-3 h-px bg-border-subtle" />

        {/* Live bid row */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-text-muted">Current Bid</p>
            <p className="mt-0.5 text-2xl font-bold text-auction">$12,500</p>
            <p className="text-[9px] text-text-muted">93 bids so far</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-text-muted">Ends in</p>
            <p className="font-mono text-lg font-bold text-white">4:52</p>
          </div>
        </div>

        {/* Bid activity */}
        <div className="rounded-xl bg-bg-card p-3">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-text-muted">Live Activity</p>
          <div className="flex flex-col gap-1.5">
            {[
              { user: 'A***n', amount: '$12,500', ms: 'just now', highlight: true },
              { user: 'K***r', amount: '$12,200', ms: '14s ago',  highlight: false },
              { user: 'Z***a', amount: '$11,800', ms: '41s ago',  highlight: false },
            ].map(({ user, amount, ms, highlight }) => (
              <div
                key={ms}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] ${highlight ? 'bg-primary-600/15 text-primary-300' : 'text-text-muted'}`}
              >
                <span className="font-semibold">{user}</span>
                <span className="font-bold text-auction">{amount}</span>
                <span className="text-[9px] opacity-60">{ms}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[9px] text-text-muted">
            <span>Auction progress</span>
            <span>78%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg-card">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-primary-600 to-violet" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AntiSnipeVisual ──────────────────────────────────────────────────────────
// Shows the anti-snipe countdown extension flow visually.

function AntiSnipeVisual() {
  const steps = [
    { label: 'Auction running',       timer: '30s', sub: 'Normal countdown', color: 'border-border bg-bg-elevated text-text-primary', timerColor: 'text-white' },
    { label: 'Final 10 seconds',      timer: '10s', sub: 'Critical threshold', color: 'border-auction/30 bg-auction/8 text-auction',   timerColor: 'text-auction' },
    { label: 'New bid arrives!',      timer: '↓',   sub: 'During final 10s',  color: 'border-success/30 bg-success/8 text-success',   timerColor: 'text-success' },
    { label: 'Countdown extended',    timer: '30s', sub: 'Reset to 30 seconds', color: 'border-primary-600/30 bg-primary-600/8 text-primary-300', timerColor: 'text-primary-300' },
    { label: 'Bidders get a chance',  timer: '…',   sub: 'Fair response window', color: 'border-violet/30 bg-violet/8 text-violet-light', timerColor: 'text-violet-light' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
      {steps.map(({ label, timer, sub, color, timerColor }, i) => (
        <div key={label}>
          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${color}`}>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] opacity-70">{sub}</p>
            </div>
            <span className={`font-mono text-2xl font-bold ${timerColor}`}>{timer}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center py-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-text-muted" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HowItWorksPage;
