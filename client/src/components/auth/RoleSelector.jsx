// ─── Role definitions ─────────────────────────────────────────────────────────

const ROLES = [
  {
    id: 'buyer',
    label: 'Buyer',
    description: 'Browse & bid on items',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    id: 'seller',
    label: 'Seller',
    description: 'List & sell your items',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Platform management',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

// ─── RoleSelector ─────────────────────────────────────────────────────────────

/**
 * Segmented role picker used on both Login and Register pages.
 *
 * @param {'buyer'|'seller'|'admin'} selected   – controlled value
 * @param {function}                 onChange    – (roleId: string) => void
 * @param {string[]}                 allowedRoles – roles to render; default all three
 */
function RoleSelector({ selected, onChange, allowedRoles = ['buyer', 'seller', 'admin'] }) {
  const visible = ROLES.filter((r) => allowedRoles.includes(r.id));

  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        Select Role
      </p>
      <div className={`grid gap-2 grid-cols-${visible.length}`}>
        {visible.map(({ id, label, description, icon }) => {
          const isSelected = selected === id;
          const isAdmin = id === 'admin';

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={[
                'flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5',
                'text-center transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 focus-visible:ring-offset-1',
                isSelected && !isAdmin
                  ? 'border-secondary-600 bg-secondary-600/10 text-secondary-600 shadow-card'
                  : isSelected && isAdmin
                  ? 'border-primary-700 bg-primary-900/30 text-primary-300 shadow-card'
                  : 'border-border bg-bg-card text-text-muted hover:border-border hover:bg-bg-surface',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isSelected}
            >
              {/* Icon */}
              <span
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  isSelected && !isAdmin
                    ? 'bg-secondary-600 text-white'
                    : isSelected && isAdmin
                    ? 'bg-primary-700 text-white'
                    : 'bg-bg-elevated text-text-muted',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {icon}
              </span>

              {/* Label */}
              <span className="text-xs font-semibold">{label}</span>

              {/* Description */}
              <span className="hidden text-[10px] leading-tight text-text-muted sm:block">
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelector;
