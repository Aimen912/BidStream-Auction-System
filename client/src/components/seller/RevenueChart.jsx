import { useState } from 'react';
import { MONTHLY_REVENUE } from '../../data/seller/SELLER_ANALYTICS_DATA';
import { currency, fmtPKR } from '../../utils/currency';

// ─── RevenueChart ─────────────────────────────────────────────────────────────

/**
 * Pure SVG/CSS bar chart — no external charting library.
 * Displays monthly revenue with hover tooltips.
 */
function RevenueChart() {
  const [hovered, setHovered] = useState(null);

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const avgRevenue   = Math.round(totalRevenue / MONTHLY_REVENUE.length);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border-subtle px-6 py-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold text-text-primary">Monthly Revenue</h3>
          <p className="text-xs text-text-muted">Revenue earned per month — current year</p>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-base font-bold text-auction">{currency(totalRevenue)}</p>
            <p className="text-[10px] text-text-muted">≈ {fmtPKR(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Monthly Avg</p>
            <p className="text-base font-bold text-auction">{currency(avgRevenue)}</p>
            <p className="text-[10px] text-text-muted">≈ {fmtPKR(avgRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Chart body */}
      <div className="px-6 py-6">

        {/* Y-axis labels + bars */}
        <div className="flex gap-4">

          {/* Y-axis */}
          <div className="flex w-12 shrink-0 flex-col justify-between text-right">
            {[maxRevenue, Math.round(maxRevenue * 0.75), Math.round(maxRevenue * 0.5), Math.round(maxRevenue * 0.25), 0].map((v) => (
              <span key={v} className="text-[10px] text-text-muted">
                ${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              </span>
            ))}
          </div>

          {/* Bars area */}
          <div className="relative flex-1">

            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px w-full bg-bg-elevated" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative flex h-48 items-end justify-between gap-1">
              {MONTHLY_REVENUE.map((item) => {
                const heightPct = (item.revenue / maxRevenue) * 100;
                const isHovered = hovered === item.month;

                return (
                  <div
                    key={item.month}
                    className="group relative flex flex-1 flex-col items-center"
                    onMouseEnter={() => setHovered(item.month)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="pointer-events-none absolute -top-14 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-bg-card px-3 py-2 shadow-dropdown">
                        <p className="text-xs font-bold text-auction">{currency(item.revenue)}</p>
                        <p className="text-[9px] text-text-muted">≈ {fmtPKR(item.revenue)}</p>
                        <p className="text-[10px] text-text-muted">{item.auctions} auctions</p>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={[
                        'w-full rounded-t-lg transition-all duration-200',
                        isHovered
                          ? 'bg-secondary-600 opacity-100'
                          : 'bg-secondary-600/50 hover:bg-secondary-600/70',
                      ].join(' ')}
                      style={{ height: `${heightPct}%`, minHeight: '4px' }}
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* X-axis month labels */}
        <div className="mt-2 flex justify-between pl-16">
          {MONTHLY_REVENUE.map((item) => (
            <span
              key={item.month}
              className={[
                'flex-1 text-center text-[10px] font-medium transition-colors duration-150',
                hovered === item.month ? 'text-secondary-600' : 'text-text-muted',
              ].join(' ')}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;
