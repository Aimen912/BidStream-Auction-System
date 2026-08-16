import { useState } from 'react';
import { createCategory } from '../../api/categories';

const CATEGORY_STATUS_OPTIONS = [
  { value: 'all',      label: 'All Statuses' },
  { value: 'active',   label: 'Active'       },
  { value: 'inactive', label: 'Inactive'     },
];
const CATEGORY_SORT_OPTIONS = [
  { value: 'name',     label: 'Name A–Z'      },
  { value: 'auctions', label: 'Most Auctions' },
  { value: 'updated',  label: 'Recently Updated' },
];

// ─── Add Category Modal ───────────────────────────────────────────────────────

function AddCategoryModal({ onClose, onAdded }) {
  const [form,    setForm]    = useState({ name: '', description: '', icon: '🏷️', gradient: 'from-secondary-600 to-primary-700' });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const inputCls = 'w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20';

  async function handleSave() {
    if (!form.name.trim())        { setError('Category name is required'); return; }
    if (!form.description.trim()) { setError('Description is required');   return; }
    setSaving(true); setError('');
    try {
      const res = await createCategory(form);
      onAdded(res.category || res);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create category');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-bold text-text-primary">Add Category</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text-secondary focus-visible:outline-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({...p, name: e.target.value}))} placeholder="e.g. Electronics" className={inputCls}/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-secondary">Description *</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({...p, description: e.target.value}))} placeholder="Brief description of this category" className={[inputCls, 'resize-none'].join(' ')}/>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-semibold text-text-secondary">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => setForm((p) => ({...p, icon: e.target.value}))} placeholder="🏷️" className={inputCls}/>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-semibold text-text-secondary">Status</label>
              <select value={form.status || 'active'} onChange={(e) => setForm((p) => ({...p, status: e.target.value}))}
                className={[inputCls, 'cursor-pointer appearance-none'].join(' ')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-border bg-bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface">Cancel</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60">
            {saving && <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
            {saving ? 'Saving…' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={[
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
      status === 'active'
        ? 'bg-success-100 text-success'
        : 'bg-bg-elevated text-text-muted',
    ].join(' ')}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({ categoryId, status, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
        Actions
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={open ? 'rotate-180' : ''} aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul className="fixed z-50 w-36 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown motion-safe:animate-scale-in motion-safe:animate-fade-in">
            {['View', 'Edit'].map((label) => (
              <li key={label}>
                <button type="button" onClick={() => setOpen(false)}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
                  {label}
                </button>
              </li>
            ))}
            <li><div className="my-1 border-t border-border-subtle" /></li>
            <li>
              <button type="button"
                onClick={() => { onToggle(categoryId); setOpen(false); }}
                className={[
                  'flex w-full items-center px-4 py-2.5 text-sm transition-colors duration-150',
                  status === 'active'
                    ? 'text-warning hover:bg-warning-100'
                    : 'text-success hover:bg-success-100',
                ].join(' ')}>
                {status === 'active' ? 'Disable' : 'Enable'}
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Mobile category card ─────────────────────────────────────────────────────

function CategoryCard({ cat, onToggle }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} text-xl`}>
          {cat.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-text-primary">{cat.name}</p>
            <StatusBadge status={cat.status} />
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-text-muted">{cat.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-bg-surface px-4 py-2.5">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Auctions</p>
          <p className="text-sm font-bold text-text-primary">{cat.auctions}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium text-text-muted">Updated</p>
          <p className="text-xs text-text-secondary">{cat.updatedAt}</p>
        </div>
        <ActionMenu categoryId={cat.id} status={cat.status} onToggle={onToggle} />
      </div>
    </div>
  );
}

// ─── CategoriesTable ──────────────────────────────────────────────────────────

const HEADERS = ['Category', 'Description', 'Auctions', 'Status', 'Last Updated', 'Actions'];

/**
 * @param {Array}    categories  – filtered + sorted category records
 * @param {function} onToggle    – (id) => void — toggles active/inactive
 * @param {object}   filters     – { search, status, sort }
 * @param {function} onChange    – (key, value) => void
 * @param {function} onClear
 * @param {boolean}  hasActive
 */
function CategoriesTable({ categories, onToggle, onAdd, filters, onChange, onClear, hasActive }) {
  const [showAddModal, setShowAddModal] = useState(false);

  // ── Shared select helper ───────────────────────────────────────────────────

  function SelectFilter({ value, onFilterChange, options }) {
    return (
      <div className="relative shrink-0">
        <select value={value} onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 hover:border-border">
          {options.map(({ value: v, label }) => <option key={v} value={v}>{label}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newCat) => { onAdd?.(newCat); setShowAddModal(false); }}
        />
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="search" value={filters.search} onChange={(e) => onChange('search', e.target.value)}
              placeholder="Search categories…"
              className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20" />
            {filters.search && (
              <button type="button" onClick={() => onChange('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SelectFilter value={filters.status} onFilterChange={(v) => onChange('status', v)} options={CATEGORY_STATUS_OPTIONS} />
            <SelectFilter value={filters.sort}   onFilterChange={(v) => onChange('sort', v)}   options={CATEGORY_SORT_OPTIONS}   />

            {hasActive && (
              <button type="button" onClick={onClear}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            )}

            {/* Add Category — opens modal */}
            <button type="button"
              onClick={() => setShowAddModal(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-primary-900 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-card shadow-card">
              <span className="text-2xl">📂</span>
            </div>
          </div>
          <p className="text-base font-bold text-text-primary">No categories found</p>
          <p className="mt-1 text-sm text-text-muted">Try adjusting your filters.</p>
        </div>
      )}

      {/* ── Desktop table ── */}
      {categories.length > 0 && (
        <div className="hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-bg-surface">
                  {HEADERS.map((h) => (
                    <th key={h} scope="col"
                      className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr key={cat.id}
                    className={['transition-colors duration-150 hover:bg-bg-surface', i !== categories.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-lg`}>
                          {cat.icon}
                        </div>
                        <p className="text-sm font-bold text-text-primary">{cat.name}</p>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="max-w-[240px] truncate text-sm text-text-muted">{cat.description}</p>
                    </td>

                    {/* Auctions */}
                    <td className="px-5 py-4 text-sm font-bold text-text-primary">{cat.auctions}</td>

                    {/* Status */}
                    <td className="px-5 py-4"><StatusBadge status={cat.status} /></td>

                    {/* Updated */}
                    <td className="px-5 py-4 text-sm text-text-muted">{cat.updatedAt}</td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <ActionMenu categoryId={cat.id} status={cat.status} onToggle={onToggle} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Mobile cards ── */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesTable;
