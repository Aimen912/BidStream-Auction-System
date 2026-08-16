import { useEffect, useState } from 'react';
import { listMyAuctions } from '../../api/auctions';

const GRADIENTS = [
  'from-primary-600 to-primary-400',
  'from-orange-500 to-amber-400',
  'from-pink-500 to-rose-400',
  'from-violet-600 to-purple-400',
  'from-gray-600 to-gray-400',
  'from-emerald-600 to-teal-400',
];
const BG_BARS = [
  'bg-primary-600', 'bg-orange-400', 'bg-pink-400',
  'bg-violet', 'bg-navy-500', 'bg-emerald-500',
];

function CategoryRow({ name, auctions, percentage, gradient, bg }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-0">
      <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${gradient}`}/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">{auctions} auctions</span>
            <span className="w-10 text-right text-xs font-bold text-text-primary">{percentage}%</span>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
          <div className={['h-full rounded-full', bg].join(' ')}
            style={{ width: `${percentage}%`, transition: 'width 0.6s ease' }}/>
        </div>
      </div>
    </div>
  );
}

function TopCategories() {
  const [categories, setCategories] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    let active = true;
    listMyAuctions({ limit: 100 })
      .then(({ auctions }) => {
        if (!active) return;
        const list = auctions || [];
        setTotal(list.length);

        // Group by category name
        const map = {};
        list.forEach((a) => {
          const name = a.category?.name || 'Uncategorized';
          map[name] = (map[name] || 0) + 1;
        });

        const sorted = Object.entries(map)
          .map(([name, count]) => ({ name, auctions: count }))
          .sort((a, b) => b.auctions - a.auctions)
          .slice(0, 6);

        const totalCount = sorted.reduce((s, c) => s + c.auctions, 0);
        setCategories(sorted.map((c, i) => ({
          ...c,
          percentage: totalCount > 0 ? Math.round((c.auctions / totalCount) * 100) : 0,
          gradient:   GRADIENTS[i % GRADIENTS.length],
          bg:         BG_BARS[i % BG_BARS.length],
        })));
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-text-primary">Top Categories</h3>
          <p className="text-xs text-text-muted">Auctions by category</p>
        </div>
        <span className="rounded-xl border border-border bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">
          {total} total
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">
          {[1,2,3,4].map((i) => <div key={i} className="h-10 rounded-xl shimmer-bg motion-safe:animate-shimmer"/>)}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-text-muted">No auctions yet</p>
        </div>
      ) : (
        <div className="px-6 py-2">
          {categories.map((cat) => <CategoryRow key={cat.name} {...cat}/>)}
        </div>
      )}
    </div>
  );
}

export default TopCategories;
