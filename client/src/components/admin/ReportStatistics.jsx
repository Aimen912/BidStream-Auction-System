import DashboardCard from '../layout/DashboardCard';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const PendingIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ResolvedIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const HighPriorityIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── ReportStatistics ─────────────────────────────────────────────────────────

/**
 * @param {Array} reports – the live (post-action) reports array
 */
function ReportStatistics({ reports }) {
  const total    = reports.length;
  const pending  = reports.filter((r) => r.status === 'pending').length;
  const resolved = reports.filter((r) => r.status === 'resolved').length;
  const highPrio = reports.filter((r) => r.priority === 'high' && r.status !== 'resolved').length;

  const CARDS = [
    {
      label:    'Total Reports',
      value:    String(total),
      trend:    '+3',
      trendDir: 'down',
      period:   'this week',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     TotalIcon,
    },
    {
      label:    'Pending Review',
      value:    String(pending),
      trend:    pending > 0 ? 'Needs attention' : null,
      trendDir: pending > 0 ? 'down' : null,
      period:   'unresolved',
      iconBg:   'bg-warning-100',
      iconColor:'text-warning',
      icon:     PendingIcon,
    },
    {
      label:    'Resolved',
      value:    String(resolved),
      trend:    '+4',
      trendDir: 'up',
      period:   'this week',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     ResolvedIcon,
    },
    {
      label:    'High Priority',
      value:    String(highPrio),
      trend:    highPrio > 0 ? 'Act now' : null,
      trendDir: highPrio > 0 ? 'down' : null,
      period:   'urgent & unresolved',
      iconBg:   'bg-danger-100',
      iconColor:'text-danger',
      icon:     HighPriorityIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {CARDS.map((card) => (
        <DashboardCard key={card.label} {...card} className="!p-5" />
      ))}
    </div>
  );
}

export default ReportStatistics;
