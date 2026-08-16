import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../api/admin';

const ROLE_BADGE = {
  seller: 'bg-secondary-100 text-secondary-600',
  buyer:  'bg-primary-600/12 text-primary-300',
  admin:  'bg-violet/12 text-violet-light',
};

function RecentUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then(({ recentUsers }) => { if (active) setUsers(recentUsers || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Recent Users</h3>
          <p className="mt-0.5 text-xs text-text-muted">Latest registrations</p>
        </div>
        <Link
          to="/admin/users"
          className="text-xs font-medium text-primary-300 transition-colors duration-150 hover:text-primary-400 no-underline"
        >
          View all →
        </Link>
      </div>

      {/* ── States ── */}
      {loading ? (
        <div className="space-y-2.5 p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg shimmer-bg motion-safe:animate-shimmer" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-text-muted">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-bg-surface">
                {['User', 'Role', 'Status', 'Joined'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="border-b border-border-subtle px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const isActive = user.isActive !== false;
                const initials = (user.name || '?')
                  .split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
                const joined = user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })
                  : '—';
                const roleCls = ROLE_BADGE[user.role] ?? 'bg-bg-elevated text-text-muted';

                return (
                  <tr
                    key={user._id}
                    className={[
                      'transition-colors duration-150 hover:bg-bg-surface',
                      i !== users.length - 1 ? 'border-b border-border-subtle' : '',
                    ].join(' ')}
                  >
                    {/* User */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt=""
                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">
                            {initials}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-primary leading-tight">
                            {user.name}
                          </p>
                          <p className="truncate text-[11px] text-text-muted leading-tight">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-2.5">
                      <span className={[
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize',
                        roleCls,
                      ].join(' ')}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5">
                      <span className={[
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger',
                      ].join(' ')}>
                        <span className={[
                          'h-1.5 w-1.5 rounded-full',
                          isActive ? 'bg-success' : 'bg-danger',
                        ].join(' ')} />
                        {isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-2.5 text-[11px] text-text-muted">
                      {joined}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentUsers;
