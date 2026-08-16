// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  bid:       { dot: 'bg-secondary-600', iconBg: 'bg-secondary-100', iconColor: 'text-secondary-600' },
  won:       { dot: 'bg-success',       iconBg: 'bg-success-100',     iconColor: 'text-success'       },
  outbid:    { dot: 'bg-danger',        iconBg: 'bg-danger-100',       iconColor: 'text-danger'        },
  watchlist: { dot: 'bg-accent-500',    iconBg: 'bg-accent-100',    iconColor: 'text-accent-600'    },
  message:   { dot: 'bg-primary-600',   iconBg: 'bg-primary-900/30',   iconColor: 'text-primary-300'   },
};

// ─── ActivityTimeline ─────────────────────────────────────────────────────────

/**
 * Vertical timeline of recent activity events.
 *
 * @param {Array} activities – array of activity records
 */
function ActivityTimeline({ activities }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Recent Activity</h3>
        <p className="text-xs text-text-muted">Your latest actions across BidStream</p>
      </div>

      <div className="relative px-6 py-5">
        {/* Vertical track */}
        <div className="absolute left-[2.6rem] top-5 bottom-5 w-px bg-bg-elevated" aria-hidden="true" />

        <div className="flex flex-col gap-5">
          {activities.map((item, index) => {
            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.bid;
            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Icon node */}
                <div className={[
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-bg-card shadow-card',
                  cfg.iconBg, cfg.iconColor,
                ].join(' ')}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-sm text-text-muted">{item.description}</p>
                      {item.auctionTitle && (
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-text-muted">
                          {item.auctionTitle}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-text-muted whitespace-nowrap">{item.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ActivityTimeline;
