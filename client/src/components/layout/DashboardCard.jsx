// ─── DashboardCard ─────────────────────────────────────────────────────────────
//
// Stat card used on Buyer, Seller, and Admin dashboards.
//
// Token reference:
//   bg-bg-card      = #121936  (L4 surface)
//   bg-bg-elevated  = #171F42  (L5 surface)
//   border-border   = #1F2D4A  (subtle border)
//   primary-600     = #4F46E5  (indigo — default accent)
//   primary-500     = #6366F1  (lighter indigo)
//   text-text-primary   = #F8FAFC
//   text-text-muted     = #94A3B8
//   success / danger / warning semantic tokens for trends

function DashboardCard({
  label,
  value,
  trend,
  trendDir       = null,
  period         = 'vs last month',
  icon,
  // iconBg / iconColor are intentionally kept as props so call-sites can
  // pass semantic accent colours (green for Winning, amber for Auctions Won, etc.)
  // Defaults changed from sky/blue → indigo tokens.
  iconBg         = 'bg-primary-600/10',
  iconColor      = 'text-primary-500',
  // accentGradient drives the top accent line colour.
  // Default changed from blue/sky → indigo.
  accentGradient = 'from-primary-600 to-primary-500',
  className      = '',
}) {
  // ── Trend colour ─────────────────────────────────────────────────────────
  // Up   → green (success semantic)
  // Down → rose (danger semantic)
  // Null → muted
  const trendColor = trendDir === 'up'   ? 'text-success'
                   : trendDir === 'down' ? 'text-danger'
                   : 'text-text-muted';

  const trendBg   = trendDir === 'up'   ? 'bg-success/10 border border-success/20'
                  : trendDir === 'down' ? 'bg-danger/10 border border-danger/20'
                  : 'bg-bg-elevated/60';

  const TrendArrow = () => {
    if (!trend) return null;
    return trendDir === 'up' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ) : trendDir === 'down' ? (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ) : null;
  };

  return (
    <div className={[
      // Surface — L4 card, rounded, consistent with Card component
      'group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6',
      'bg-bg-card border border-border',
      // Shadow — restrained dark shadow, no neon
      'shadow-card',
      // Hover — subtle lift + shadow increase + indigo border tint
      'transition-all duration-200 hover:-translate-y-1',
      'hover:shadow-dropdown hover:border-primary-600/25',
      className,
    ].filter(Boolean).join(' ')}>

      {/* Top accent line — always present at low opacity, brightens on hover */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentGradient} opacity-30 group-hover:opacity-80 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Label + icon row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">{label}</p>
        {icon && (
          <span className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            'transition-transform duration-200 group-hover:scale-105',
            iconBg, iconColor,
          ].join(' ')}>
            {icon}
          </span>
        )}
      </div>

      {/* Value + trend */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-bold tracking-tight text-text-primary tabular-nums">{value}</p>
        {trend && (
          <div className="flex items-center gap-2">
            <span className={[
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              trendBg, trendColor,
            ].join(' ')}>
              <TrendArrow />
              {trend}
            </span>
            {period && (
              <span className="text-xs text-text-muted">{period}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
