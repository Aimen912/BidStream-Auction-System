import { useEffect, useMemo, useState } from 'react';

import PageHeader       from '../../components/layout/PageHeader';
import CategoryStats    from '../../components/admin/CategoryStats';
import CategoriesTable  from '../../components/admin/CategoriesTable';
import { deleteCategory, listCategories } from '../../api/categories';

// ─── Default filters ──────────────────────────────────────────────────────────

const DEFAULT_FILTERS = { search: '', status: 'all', sort: 'name' };

// ─── Admin Categories page ────────────────────────────────────────────────────

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [filters,    setFilters]    = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await listCategories();
        if (!active) return;
        setCategories((result.categories || []).map((category) => ({
          id:          category._id || category.id,
          name:        category.name,
          description: category.description,
          icon:        category.icon,
          gradient:    category.gradient,
          status:      category.status,
          auctions:    category.auctionCount || 0,
          updatedAt:   category.updatedAt
            ? new Date(category.updatedAt).toLocaleDateString()
            : '—',
        })));
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load categories');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleChange = (key, value) => setFilters((p) => ({ ...p, [key]: value }));
  const handleClear  = () => setFilters(DEFAULT_FILTERS);

  // Toggle active / inactive — UI only
  const handleToggle = async (id) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Add new category to list instantly after creation
  const handleAdd = (newCat) => {
    setCategories((prev) => [
      {
        id:          newCat._id || newCat.id,
        name:        newCat.name,
        description: newCat.description,
        icon:        newCat.icon,
        gradient:    newCat.gradient,
        status:      newCat.status || 'active',
        auctions:    newCat.auctionCount || 0,
        updatedAt:   new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
  };

  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  // Derived summary counts (from live categories array)
  const activeCount  = categories.filter((c) => c.status === 'active').length;
  const inactiveCount = categories.filter((c) => c.status === 'inactive').length;

  const filtered = useMemo(() => {
    let list = [...categories];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status);
    }

    switch (filters.sort) {
      case 'auctions':
        list = [...list].sort((a, b) => b.auctions - a.auctions);
        break;
      case 'updated':
        list = [...list].reverse();
        break;
      case 'name':
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [categories, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Categories"
        subtitle="Organize and manage auction categories across the BidStream marketplace."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Categories'                      },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: `${categories.length} Total`, dot: 'bg-navy-500'  },
              { label: `${activeCount} Active`,       dot: 'bg-success'   },
              { label: `${inactiveCount} Inactive`,   dot: 'bg-navy-300'  },
            ].map(({ label, dot }) => (
              <span key={label}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary shadow-card">
                <span className={['h-1.5 w-1.5 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        }
      />

      {loading && <p className="text-sm text-text-muted">Loading categories…</p>}
      {error && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      {/* ── Summary stats ── */}
      <CategoryStats categories={categories} />

      {/* ── Results count ── */}
      {!loading && filtered.length > 0 && (
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-text-primary">{filtered.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-text-primary">{categories.length}</span>
          {' '}categories
          {hasActive && (
            <button type="button" onClick={handleClear}
              className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none">
              (clear filters)
            </button>
          )}
        </p>
      )}

      {/* ── Table (toolbar embedded inside) ── */}
        {!loading && <CategoriesTable
        categories={filtered}
        onToggle={handleToggle}
        onAdd={handleAdd}
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />}

    </div>
  );
}

export default AdminCategories;
