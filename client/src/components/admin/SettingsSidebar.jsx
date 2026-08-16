import { SETTINGS_CATEGORIES } from '../../data/admin/ADMIN_SETTINGS_DATA';

// ─── SettingsSidebar ──────────────────────────────────────────────────────────

/**
 * Left navigation column for Admin Settings.
 *
 * @param {string}   active   – current category id
 * @param {function} onChange – (id) => void
 */
function SettingsSidebar({ active, onChange }) {
  return (
    <nav
      className="flex flex-col gap-1 rounded-2xl border border-border bg-bg-card p-3 shadow-card lg:sticky lg:top-4"
      aria-label="Settings navigation"
    >
      {/* Header */}
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
        Configuration
      </p>

      {SETTINGS_CATEGORIES.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left',
              'text-sm font-medium transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
              isActive
                ? 'bg-primary-900 text-white shadow-dropdown'
                : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
            ].join(' ')}
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}

export default SettingsSidebar;
