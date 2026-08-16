import { useEffect, useState } from 'react';
import DashboardCard    from '../layout/DashboardCard';
import { listCategories } from '../../api/categories';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TotalIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6"  x2="21" y2="6"  />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6"  x2="3.01" y2="6"  />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const ActiveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AuctionsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const PopularIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4"  />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

// ─── CategoryStats ────────────────────────────────────────────────────────────

/**
 * Four KPI cards for the Admin Categories page.
 */
function CategoryStats() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let active = true;
    listCategories()
      .then(({ categories: cats }) => { if (active) setCategories(cats || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const total   = categories.length;
  const active  = categories.filter((c) => c.status === 'active').length;
  const listed  = categories.reduce((sum, c) => sum + (c.auctionCount || 0), 0);
  const popular = [...categories].sort((a, b) => (b.auctionCount || 0) - (a.auctionCount || 0))[0];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
            <div className="h-4 w-28 rounded shimmer-bg motion-safe:animate-shimmer mb-3"/><div className="h-8 w-16 rounded shimmer-bg motion-safe:animate-shimmer"/>
          </div>
        ))}
      </div>
    );
  }

  const CARDS = [
    {
      label:    'Total Categories',
      value:    String(total),
      trend:    null,
      trendDir: null,
      period:   'platform-wide',
      iconBg:   'bg-primary-900/30',
      iconColor:'text-primary-300',
      icon:     TotalIcon,
    },
    {
      label:    'Active Categories',
      value:    String(active),
      trend:    null,
      trendDir: null,
      period:   'currently live',
      iconBg:   'bg-success-100',
      iconColor:'text-success',
      icon:     ActiveIcon,
    },
    {
      label:    'Auctions Listed',
      value:    String(listed),
      trend:    '+12',
      trendDir: 'up',
      period:   'this week',
      iconBg:   'bg-secondary-100',
      iconColor:'text-secondary-600',
      icon:     AuctionsIcon,
    },
    {
      label:    'Most Popular',
      value:    popular?.name ?? '—',
      trend:    popular ? `${popular.auctionCount || 0} auctions` : null,
      trendDir: 'up',
      period:   'highest volume',
      iconBg:   'bg-accent-100',
      iconColor:'text-accent-600',
      icon:     PopularIcon,
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

export default CategoryStats;
