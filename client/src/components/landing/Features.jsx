// ─── Feature data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: 1,
    title: 'Secure Payments',
    description:
      'Every transaction is protected by bank-grade encryption and multi-layer fraud detection. Your money moves safely — every time.',
    gradient: 'from-primary-600 to-primary-400',
    stat: '256-bit',
    statLabel: 'SSL Encryption',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Real-Time Bidding',
    description:
      'Sub-second bid updates via WebSocket. Every increment lands instantly — no refresh, no delays, no missed moments.',
    gradient: 'from-accent-600 to-yellow-400',
    stat: '<100ms',
    statLabel: 'Bid Latency',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Verified Sellers',
    description:
      'Every seller completes a rigorous identity and product verification before going live. Buy with complete confidence.',
    gradient: 'from-primary-700 to-primary-600',
    stat: '100%',
    statLabel: 'ID Verified',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

// ─── Platform metrics ─────────────────────────────────────────────────────────

const METRICS = [
  { value: '48,000+', label: 'Active Bidders'   },
  { value: '$2.4M+',  label: 'Auction Volume'   },
  { value: '12,000+', label: 'Items Sold'       },
  { value: '99.4%',   label: 'Positive Reviews' },
];

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ title, description, gradient, icon, stat, statLabel, index = 0 }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-modal"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent bar — revealed on hover */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      {/* Icon */}
      <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-card`}>
        {icon}
      </div>

      {/* Text */}
      <h3 className="mb-3 text-lg font-bold text-text-primary">{title}</h3>
      <p className="flex-1 text-base leading-relaxed text-text-muted">{description}</p>

      {/* Stat */}
      <div className="mt-8 flex items-center gap-3 border-t border-border-subtle pt-5">
        <span className={`rounded-lg bg-gradient-to-r ${gradient} px-3 py-1.5 text-sm font-bold text-white`}>
          {stat}
        </span>
        <span className="text-sm font-medium text-text-secondary">{statLabel}</span>
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section id="features" className="bg-bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary-600/20 bg-primary-600/8 px-4 py-1.5 text-sm font-semibold text-primary-300">
            Why BidStream?
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl lg:whitespace-nowrap">
            Built for{' '}
            <span className="bg-gradient-to-r from-primary-300 to-violet-light bg-clip-text text-transparent">
              serious bidders
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            BidStream is engineered for performance, trust, and a seamless experience — whether you're placing your first bid or running your hundredth auction.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} {...f} index={i} />
          ))}
        </div>

        {/* Metrics bar — no emojis, clean typography */}
        <div className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card sm:grid-cols-4">
          {METRICS.map(({ value, label }, i) => (
            <div
              key={label}
              className={[
                'flex flex-col items-center gap-1.5 px-4 py-6 text-center sm:px-6 sm:py-8',
                i > 0 ? 'border-l border-border' : '',
                i >= 2 ? 'border-t border-border sm:border-t-0' : '',
                i === 2 ? 'border-l-0 sm:border-l border-border' : '',
              ].join(' ')}
            >
              <span className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{value}</span>
              <span className="text-sm font-medium text-text-muted">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;
