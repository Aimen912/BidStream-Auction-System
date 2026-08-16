// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:    { label: 'Active',    cls: 'bg-success-100 text-success'       },
  pending:   { label: 'Pending',   cls: 'bg-warning-100 text-warning'       },
  suspended: { label: 'Suspended', cls: 'bg-danger-100 text-danger'         },
};

// ─── Mobile user card ─────────────────────────────────────────────────────────

function UserCard({ user, onView, onToggleSuspend }) {
  const sc = STATUS_CONFIG[user.status] ?? STATUS_CONFIG.pending;
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.gradient} text-xs font-bold text-white`}>
          {user.avatar}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-text-primary">{user.name}</p>
            <span className={['shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold', sc.cls].join(' ')}>{sc.label}</span>
          </div>
          <p className="text-xs text-text-muted">{user.email}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', user.role === 'Seller' ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600'].join(' ')}>
              {user.role}
            </span>
            <span className="text-[10px] text-text-muted">Joined {user.joinedAt}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onView?.(user)}
          className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
          View
        </button>
        <button type="button" onClick={() => onToggleSuspend?.(user.id, user.status)}
          className={['flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none',
            user.status === 'active'
              ? 'border-border text-danger hover:border-danger/40 hover:bg-danger-100'
              : 'border-border text-success hover:border-success/40 hover:bg-success-100',
          ].join(' ')}>
          {user.status === 'active' ? 'Suspend' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// ─── UsersTable ───────────────────────────────────────────────────────────────

const HEADERS = ['User', 'Role', 'Status', 'Joined', 'Actions'];

/**
 * @param {Array}    users      – filtered user records
 * @param {function} onSuspend  – (id) => void
 */
function UsersTable({ users, onView, onToggleSuspend }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-card shadow-card">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <p className="text-base font-bold text-text-primary">No users found</p>
        <p className="mt-1 text-sm text-text-muted">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ── */}
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
              {users.map((user, i) => {
                const sc = STATUS_CONFIG[user.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr key={user.id}
                    className={['transition-colors duration-150 hover:bg-bg-surface', i !== users.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}>

                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.gradient} text-xs font-bold text-white`}>
                          {user.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">{user.name}</p>
                          <p className="truncate text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold', user.role === 'Seller' ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600'].join(' ')}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold', sc.cls].join(' ')}>
                        {sc.label}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-sm text-text-muted">{user.joinedAt}</td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button type="button"
                          onClick={() => onView?.(user)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
                          View
                        </button>
                        <button type="button"
                          onClick={() => onToggleSuspend?.(user.id, user.status)}
                          className={['rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
                            user.status === 'active'
                              ? 'border-border text-danger hover:border-danger/40 hover:bg-danger-100 focus-visible:ring-danger/30'
                              : 'border-border text-success hover:border-success/40 hover:bg-success-100 focus-visible:ring-success/30',
                          ].join(' ')}>
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <UserCard key={user.id} user={user} onView={onView} onToggleSuspend={onToggleSuspend} />
        ))}
      </div>
    </>
  );
}

export default UsersTable;
