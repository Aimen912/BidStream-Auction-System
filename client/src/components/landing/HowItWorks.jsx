import { Link } from 'react-router-dom';

// ─── Step data ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number: '01',
    title: 'Create an Account',
    description:
      'Sign up in under 60 seconds. Verify your identity once and unlock full access to every live auction on the platform.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    gradient: 'from-primary-600 to-primary-400',
    accent: 'text-primary-300',
    bgAccent: 'bg-primary-600/10',
  },
  {
    number: '02',
    title: 'Browse Live Auctions',
    description:
      'Explore thousands of verified listings across dozens of categories — luxury watches, rare collectibles, art, and more.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    gradient: 'from-accent-600 to-yellow-400',
    accent: 'text-auction',
    bgAccent: 'bg-auction/10',
  },
  {
    number: '03',
    title: 'Place Your Bid',
    description:
      'Submit your bid in real time. Live counter-bids, instant confirmation, and automatic outbid alerts keep you in control.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    gradient: 'from-violet to-primary-600',
    accent: 'text-violet-light',
    bgAccent: 'bg-violet/10',
  },
  {
    number: '04',
    title: 'Win & Receive',
    description:
      'Highest bidder wins automatically. Secure payment is processed instantly and your item ships tracked and insured.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    gradient: 'from-emerald-600 to-teal-400',
    accent: 'text-success',
    bgAccent: 'bg-success/10',
  },
];

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({ number, title, description, icon, gradient, accent, bgAccent, isLast, index = 0 }) {
  return (
    <div className="relative flex flex-col">

      {/* Connector line between steps — desktop only */}
      {!isLast && (
        <div aria-hidden="true" className="absolute top-6 hidden lg:block" style={{ left: '3.5rem', width: 'calc(100% - 3.5rem)' }}>
          <div className="relative h-px">
            <div className="absolute inset-0 bg-border" />
            <div className={`absolute inset-0 w-2/3 bg-gradient-to-r ${gradient} opacity-50`} />
          </div>
        </div>
      )}

      {/* Icon circle */}
      <div className={`relative z-10 mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-card`}>
        {icon}
        {/* Step number badge */}
        <span className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-bg-card ${bgAccent} text-[10px] font-bold ${accent}`}>
          {parseInt(number)}
        </span>
      </div>

      {/* Label */}
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${accent}`}>
        Step {number}
      </p>

      {/* Title + description */}
      <h3 className="mb-2.5 text-lg font-bold text-text-primary">{title}</h3>
      <p className="text-base leading-relaxed text-text-muted">{description}</p>
    </div>
  );
}

// ─── HowItWorks ───────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <>
      {/* ── How it works ── */}
      <section id="how-it-works" className="relative overflow-hidden bg-bg-card py-24 lg:py-32">

        {/* Subtle radial pattern — background only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(79,70,229,0.07),transparent)]"
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

          {/* Section header */}
          <div className="mx-auto mb-20 max-w-4xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary-600/20 bg-primary-600/8 px-4 py-1.5 text-sm font-semibold text-primary-300">
              Simple Process
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl lg:whitespace-nowrap">
              Up and bidding in{' '}
              <span className="bg-gradient-to-r from-primary-300 to-violet-light bg-clip-text text-transparent">
                four steps
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
              Getting started takes minutes. Here's exactly how BidStream works — from account creation to winning your first auction.
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.number}
                {...step}
                index={index}
                isLast={index === STEPS.length - 1}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── Final CTA section — the closing punch ── */}
      <section className="relative overflow-hidden bg-background-primary py-28 lg:py-36">

        {/* Atmospheric glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary-600/12 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-violet/8 blur-[80px]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">

          {/* Eyebrow */}
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-bg-card px-4 py-1.5 text-sm font-semibold text-text-muted">
            Get Started Today
          </span>

          {/* Headline */}
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
            Ready to make
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-violet-light to-violet-light bg-clip-text text-transparent">
              your next bid?
            </span>
          </h2>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
            Join over 48,000 buyers and sellers on the platform built for serious auction enthusiasts. Free to join. No hidden fees.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-dropdown transition-all duration-200 hover:bg-primary-500 hover:-translate-y-0.5 no-underline"
            >
              Create Free Account
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="8" x2="13" y2="8" />
                <polyline points="9 4 13 8 9 12" />
              </svg>
            </Link>
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-bg-elevated/40 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-bg-elevated/60 hover:-translate-y-0.5 no-underline"
            >
              Browse Auctions
            </Link>
          </div>

          {/* Trust footnote */}
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SSL secured · No credit card required · Cancel any time
          </p>

        </div>
      </section>
    </>
  );
}

export default HowItWorks;
