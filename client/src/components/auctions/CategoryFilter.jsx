import { useEffect, useState } from 'react';
import { listCategories } from '../../api/categories';

// ─── CategoryFilter ───────────────────────────────────────────────────────────

/**
 * Horizontal scrollable pill row for category selection.
 * Fetches categories from the backend and prepends an "All" pill.
 *
 * @param {string}   selected   – currently active category name or "All"
 * @param {function} onChange   – (category: string) => void
 */
function CategoryFilter({ selected, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    listCategories({ status: 'active' })
      .then(({ categories: cats }) => {
        if (active) setCategories(cats || []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const pills = [{ _id: 'all', name: 'All' }, ...categories];

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label="Filter by category"
    >
      {pills.map((cat) => {
        const isActive = selected === cat.name;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => onChange(cat.name)}
            aria-pressed={isActive}
            className={[
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
              isActive
                ? 'bg-secondary-600 text-white shadow-card'
                : 'border border-border bg-bg-card text-text-secondary hover:border-secondary-600/40 hover:text-secondary-600',
            ].join(' ')}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
