import { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api/admin';

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusFromCount(count, warn, err) {
  if (count >= err)  return 'error';
  if (count >= warn) return 'warning';
  return 'good';
}

// Dot colours — only shown when status is NOT good (warnings/errors stand out).
// For healthy rows the dot is hidden; overall health is shown once in the header.
const DOT = {
  warning: 'bg-warning',
  error:   'bg-danger',
};

// ─── SystemOverview ───────────────────────────────────────────────────────────

function SystemOverview() {
  const [overview, setOverview] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then(({ stats: s }) => {
        if (!active) return;
        setOverview([
          {
            label:  'Database',
            value:  'MongoDB Atlas',
            status: 'good',
          },
          {
            label:  'Total Users',
            value:  (s?.totalUsers ?? 0).toLocaleString(),
            status: 'good',
          },
          {
            label:  'Live Auctions',
            value:  String(s?.liveAuctions ?? 0),
            status: statusFromCount(s?.liveAuctions ?? 0, 50, 200),
          },
          {
            label:  'Total Bids',
            value:  (s?.totalBids ?? 0).toLocaleString(),
            status: 'good',
          },
          {
            label:  'Categories',
            value:  String(s?.totalCategories ?? 0),
            status: (s?.totalCategories ?? 0) === 0 ? 'warning' : 'good',
          },
          {
            label:  'New Users (7d)',
            value:  `+${s?.newUsersLast7 ?? 0}`,
            status: 'good',
          },
        ]);
      })
      .catch(() => {
        setOverview([{ label: 'System', value: 'Unable to fetch status', status: 'error' }]);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const allGood = overview.length > 0 && overview.every((r) => r.status === 'good');

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-text-primary">System Overview</h3>
          <p className="mt-0.5 text-xs text-text-muted">Infrastructure &amp; platform metrics</p>
        </div>

        {/* Single status badge — replaces the per-row repetition */}
        {!loading && (
          <span className={[
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            allGood
              ? 'border border-success/25 bg-success/10 text-success'
              : 'border border-warning/25 bg-warning/10 text-warning',
          ].join(' ')}>
            <span className={[
              'relative flex h-1.5 w-1.5 shrink-0',
            ].join(' ')}>
              <span className={[
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
                allGood ? 'bg-success' : 'bg-warning',
              ].join(' ')} />
              <span className={[
                'relative inline-flex h-1.5 w-1.5 rounded-full',
                allGood ? 'bg-success' : 'bg-warning',
              ].join(' ')} />
            </span>
            {allGood ? 'All Systems Operational' : 'Attention Required'}
          </span>
        )}
      </div>

      {/* ── Rows ── */}
      {loading ? (
        <div className="space-y-2.5 p-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-7 rounded-lg shimmer-bg motion-safe:animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border-subtle px-5">
          {overview.map(({ label, value, status }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              {/* Label — left */}
              <div className="flex items-center gap-2.5">
                {/* Only show a coloured dot for warnings/errors — healthy rows are clean */}
                {status !== 'good' && (
                  <span className={['inline-flex h-1.5 w-1.5 shrink-0 rounded-full', DOT[status]].join(' ')} />
                )}
                <span className={[
                  'text-sm',
                  status !== 'good' ? 'font-medium text-text-primary' : 'text-text-secondary',
                ].join(' ')}>
                  {label}
                </span>
              </div>

              {/* Value — right, slightly muted, monospaced for numbers */}
              <span className={[
                'text-sm tabular-nums',
                status === 'error'   ? 'font-semibold text-danger'   :
                status === 'warning' ? 'font-semibold text-warning'  :
                'text-text-muted',
              ].join(' ')}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SystemOverview;
