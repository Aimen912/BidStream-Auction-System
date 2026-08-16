import DashboardCard from '../layout/DashboardCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const OpenIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ReviewIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ResolvedIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ─── DisputeStatistics ────────────────────────────────────────────────────────

/**
 * @param {Array} disputes – the live (post-action) disputes array
 */
function DisputeStatistics({ disputes }) {
  const total     = disputes.length;
  const open      = disputes.filter((d) => d.status === 'open').length;
  const reviewing = disputes.filter((d) => d.status === 'reviewing').length;
  const resolved  = disputes.filter((d) => d.status === 'resolved').length;

  const CARDS = [
    {
      label:    'Total Disputes',
      value:    String(total),
      trend:    null,
      trendDir: null,
      period:   'all time',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     TotalIcon,
    },
    {
      label:    'Open Cases',
      value:    String(open),
      trend:    open > 0 ? 'Needs attention' : null,
      trendDir: open > 0 ? 'down' : null,
      period:   'awaiting action',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     OpenIcon,
    },
    {
      label:    'Under Review',
      value:    String(reviewing),
      trend:    null,
      trendDir: null,
      period:   'being investigated',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     ReviewIcon,
    },
    {
      label:    'Resolved Cases',
      value:    String(resolved),
      trend:    '+4',
      trendDir: 'up',
      period:   'this week',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     ResolvedIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {CARDS.map((card) => (
        <DashboardCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default DisputeStatistics;
