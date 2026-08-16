import { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../../api/admin';
import { getAdminDashboard } from '../../api/admin';
import { currency, fmtPKR, USD_TO_PKR } from '../../utils/currency';

// ─── Revenue Line Chart ────────────────────────────────────────────────────────
function RevenueLineChart({ recentAuctions = [] }) {
  const [hovered, setHovered] = useState(null);

  // Group sold auctions by month to build revenue chart
  const monthlyMap = {};
  recentAuctions.forEach((a) => {
    if (!a.createdAt) return;
    const month = new Date(a.createdAt).toLocaleString('en-US', { month: 'short' });
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, auctions: 0 };
    monthlyMap[month].revenue  += a.currentBid || 0;
    monthlyMap[month].auctions += 1;
  });

  const months = Object.keys(monthlyMap);

  if (months.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card shadow-card flex items-center justify-center h-48">
        <p className="text-sm text-text-muted">No revenue data yet</p>
      </div>
    );
  }

  const W = 600, H = 160, PAD = { t: 12, r: 12, b: 32, l: 52 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const maxVal = Math.max(...months.map((m) => monthlyMap[m].revenue), 1);
  const pts = months.map((month, i) => ({
    x: PAD.l + (i / Math.max(months.length - 1, 1)) * innerW,
    y: PAD.t + innerH - (monthlyMap[month].revenue / maxVal) * innerH,
    month,
    revenue: monthlyMap[month].revenue,
  }));

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${pts[pts.length-1].x},${PAD.t+innerH} L${pts[0].x},${PAD.t+innerH} Z`;

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="flex items-start justify-between border-b border-border-subtle px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-text-primary">Revenue Overview</h3>
          <p className="text-xs text-text-muted">Platform revenue from sold auctions</p>
        </div>
      </div>
      <div className="px-4 py-4 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
          <path d={area} fill="#6366F1" fillOpacity="0.15"/>
          <path d={path} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {pts.map((p) => (
            <g key={p.month} onMouseEnter={() => setHovered(p.month)} onMouseLeave={() => setHovered(null)}>
              <circle cx={p.x} cy={p.y} r={hovered === p.month ? 5 : 3.5}
                fill={hovered === p.month ? '#6366F1' : '#121936'} stroke="#6366F1" strokeWidth="2"/>
              {hovered === p.month && (
                <g>
                  {/* token: primary-900 = #0B1120 */}
                  <rect x={p.x - 28} y={p.y - 30} width="56" height="20" rx="4" fill="#171F42"/>
                  <text x={p.x} y={p.y - 16} textAnchor="middle" fontSize="9" fill="#F1F5F9">
                    ${(p.revenue / 1000).toFixed(1)}k / ≈₨{(Math.round(p.revenue * USD_TO_PKR) / 1000).toFixed(0)}k
                  </text>
                </g>
              )}
              <text x={p.x} y={PAD.t + innerH + 16} textAnchor="middle" fontSize="9" fill="#94A3B8">{p.month}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── User Distribution Donut ───────────────────────────────────────────────────
function UserDonut({ breakdown = {} }) {
  const [hovered, setHovered] = useState(null);

  const usersByRole = breakdown.usersByRole ?? [];
  const COLORS = { buyer: '#7C3AED', seller: '#6366F1', admin: '#F59E0B' };
  const HEX    = { buyer: '#7C3AED', seller: '#6366F1', admin: '#F59E0B' };

  if (usersByRole.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card shadow-card flex items-center justify-center h-48">
        <p className="text-sm text-text-muted">No user data yet</p>
      </div>
    );
  }

  const total = usersByRole.reduce((s, d) => s + d.count, 0);
  const R = 52, cx = 70, cy = 70;

  let cumulative = 0;
  const slices = usersByRole.map((d) => {
    const pct   = total > 0 ? d.count / total : 0;
    const start = cumulative;
    const end   = cumulative + pct * 360;
    cumulative  = end;
    const toRad = (deg) => (deg - 90) * (Math.PI / 180);
    const x1 = cx + R * Math.cos(toRad(start));
    const y1 = cy + R * Math.sin(toRad(start));
    const x2 = cx + R * Math.cos(toRad(end - 0.1));
    const y2 = cy + R * Math.sin(toRad(end - 0.1));
    const large = end - start > 180 ? 1 : 0;
    return {
      label: d._id,
      value: d.count,
      pct:   Math.round(pct * 100),
      hex:   HEX[d._id] ?? '#94A3B8',
      color: `bg-[${HEX[d._id] ?? '#94A3B8'}]`,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`,
    };
  });

  const hov = slices.find((s) => s.label === hovered);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">User Distribution</h3>
        <p className="text-xs text-text-muted">Registered users by role</p>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {slices.map((s) => (
              <path key={s.label} d={s.path} fill={s.hex}
                opacity={hovered ? (hovered === s.label ? 1 : 0.35) : 0.85}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setHovered(s.label)} onMouseLeave={() => setHovered(null)}/>
            ))}
            <circle cx="70" cy="70" r="34" fill="#121936"/>
            <text x="70" y="67" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F8FAFC">
              {hov ? hov.value.toLocaleString() : total.toLocaleString()}
            </text>
            <text x="70" y="79" textAnchor="middle" fontSize="8" fill="#94A3B8">
              {hov ? hov.label : 'Total Users'}
            </text>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          {slices.map((s) => (
            <div key={s.label} className="flex items-center gap-3 capitalize cursor-pointer"
              onMouseEnter={() => setHovered(s.label)} onMouseLeave={() => setHovered(null)}>
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.hex }}/>
              <p className="text-sm text-text-secondary">{s.label}</p>
              <span className="ml-auto text-sm font-bold text-text-primary">{s.pct}%</span>
              <span className="text-xs text-text-muted">({s.value.toLocaleString()})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Category Bars ─────────────────────────────────────────────────────────────
function CategoryBars({ breakdown = {} }) {
  const topCategories = breakdown.topCategories ?? [];

  if (topCategories.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card shadow-card flex items-center justify-center h-48">
        <p className="text-sm text-text-muted">No category data yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...topCategories.map((c) => c.auctionCount ?? 1), 1);
  const COLORS   = ['bg-secondary-600', 'bg-accent-600', 'bg-success', 'bg-primary-700', 'bg-danger'];

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Top Categories</h3>
        <p className="text-xs text-text-muted">Auctions per category</p>
      </div>
      <div className="flex flex-col gap-3.5 px-6 py-5">
        {topCategories.map((cat, i) => {
          const pct = Math.round(((cat.auctionCount ?? 0) / maxCount) * 100);
          return (
            <div key={cat._id ?? i}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {cat.icon && <span>{cat.icon}</span>}
                  <p className="text-sm font-medium text-text-secondary">{cat.name}</p>
                </div>
                <span className="text-sm font-bold text-text-primary">{cat.auctionCount ?? 0}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                <div className={['h-full rounded-full transition-all duration-500', COLORS[i % COLORS.length]].join(' ')}
                  style={{ width: `${pct}%` }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Growth Stats ──────────────────────────────────────────────────────────────
function GrowthCards({ growth = {} }) {
  const cards = [
    { label: 'New Users (7d)',     value: `+${growth.newUsersLast7 ?? 0}`    },
    { label: 'New Users (30d)',    value: `+${growth.newUsersLast30 ?? 0}`   },
    { label: 'New Auctions (7d)',  value: `+${growth.newAuctionsLast7 ?? 0}` },
    { label: 'New Bids (7d)',      value: `+${growth.newBidsLast7 ?? 0}`     },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {cards.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-5 shadow-card">
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-text-primary">{value}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-semibold text-success w-fit">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            vs last period
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Recent Activity ───────────────────────────────────────────────────────────
function RecentActivityList({ recentAuctions = [], recentUsers = [] }) {
  const now = Date.now();

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = now - new Date(dateStr);
    const m = Math.floor(diff / 60_000);
    if (m < 1)  return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const events = [
    ...recentUsers.slice(0, 3).map((u) => ({
      id:   u._id,
      type: 'user',
      text: `${u.name} registered as ${u.role}`,
      time: timeAgo(u.createdAt),
    })),
    ...recentAuctions.slice(0, 3).map((a) => ({
      id:   a._id,
      type: a.status === 'sold' ? 'sale' : 'auction',
      text: a.status === 'sold'
        ? `"${a.title}" sold for $${(a.currentBid || 0).toLocaleString()}`
        : `"${a.title}" is ${a.status}`,
      time: timeAgo(a.updatedAt || a.createdAt),
    })),
  ].sort(() => Math.random() - 0.5).slice(0, 6);

  const ICONS = {
    user:    { bg: 'bg-secondary-100', color: 'text-secondary-600', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    auction: { bg: 'bg-success-100',   color: 'text-success',       icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    sale:    { bg: 'bg-accent-100',    color: 'text-accent-600',    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  };

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Recent Marketplace Activity</h3>
        <p className="text-xs text-text-muted">Latest events across the platform</p>
      </div>
      {events.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-text-muted">No activity yet</p>
        </div>
      ) : (
        <div className="relative px-6 py-5">
          <div className="absolute left-[2.6rem] top-5 bottom-5 w-px bg-bg-elevated" aria-hidden="true"/>
          <div className="flex flex-col gap-5">
            {events.map((item) => {
              const cfg = ICONS[item.type] ?? ICONS.auction;
              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  <div className={['relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-bg-card shadow-card', cfg.bg, cfg.color].join(' ')}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-snug text-text-secondary">{item.text}</p>
                      <span className="shrink-0 text-xs text-text-muted whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AnalyticsCharts — main export ────────────────────────────────────────────
function AnalyticsCharts() {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminAnalytics(), getAdminDashboard()])
      .then(([a, d]) => {
        if (!active) return;
        setAnalytics(a);
        setDashboard(d);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1,2,3].map((i) => <div key={i} className="h-48 rounded-2xl shimmer-bg motion-safe:animate-shimmer"/>)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueLineChart recentAuctions={dashboard?.recentAuctions ?? []}/>
        <UserDonut breakdown={analytics?.breakdown ?? {}}/>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CategoryBars breakdown={analytics?.breakdown ?? {}}/>
        <RecentActivityList
          recentAuctions={dashboard?.recentAuctions ?? []}
          recentUsers={dashboard?.recentUsers ?? []}
        />
      </div>
      <GrowthCards growth={analytics?.growth ?? {}}/>
    </div>
  );
}

export default AnalyticsCharts;
