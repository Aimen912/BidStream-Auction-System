import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminReports } from '../../api/admin';

const STATUS_CLS = {
  sold:      'bg-success/10 text-success',
  ended:     'bg-bg-elevated text-text-muted',
  cancelled: 'bg-danger/10 text-danger',
};

function RecentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminReports({ limit: 5 })
      .then(({ reports: r }) => { if (active) setReports(r || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Recent Reports</h3>
          <p className="mt-0.5 text-xs text-text-muted">Ended &amp; completed auctions</p>
        </div>
        <Link
          to="/admin/reports"
          className="text-xs font-medium text-primary-300 transition-colors duration-150 hover:text-primary-400 no-underline"
        >
          View all →
        </Link>
      </div>

      {/* ── States ── */}
      {loading ? (
        <div className="space-y-2.5 p-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg shimmer-bg motion-safe:animate-shimmer" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-text-muted">No reports available</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {reports.map((report) => {
            const statusCls = STATUS_CLS[report.status] ?? STATUS_CLS.ended;

            return (
              <li
                key={report._id}
                className="flex items-center gap-3 px-5 py-2.5 transition-colors duration-150 hover:bg-bg-surface"
              >
                {/* Thumbnail */}
                {report.images?.[0] ? (
                  <img
                    src={report.images[0]}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-secondary-600 to-primary-700" />
                )}

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-text-primary leading-snug">
                      {report.title}
                    </p>
                    <span className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                      statusCls,
                    ].join(' ')}>
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {report.seller?.name || '—'}
                    {' · '}
                    <span className="text-auction font-medium">
                      ${(report.currentBid || 0).toLocaleString()}
                    </span>
                    {report.bids ? ` · ${report.bids} bids` : ''}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecentReports;
