import { useEffect, useMemo, useState } from 'react';

import PageHeader   from '../../components/layout/PageHeader';
import UserFilters  from '../../components/admin/UserFilters';
import UsersTable   from '../../components/admin/UsersTable';
import { updateUserStatus, searchUsers } from '../../api/admin';

// ─── Default filter state ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = { search: '', role: 'all', status: 'all' };

// ─── Admin Users page ─────────────────────────────────────────────────────────

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await searchUsers({ limit: 100 });
        if (!active) return;

        setUsers((result.users || []).map((user) => ({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role === 'admin' ? 'Admin' : user.role === 'seller' ? 'Seller' : 'Buyer',
          status: user.isActive ? 'active' : 'suspended',
          joinedAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—',
          avatar: (user.name || '?').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
          gradient: 'from-secondary-600 to-primary-700',
          phone:    user.phone    || '—',
          bio:      user.bio      || '—',
          location: user.location || '—',
        })));
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load users');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleClear = () => setFilters(DEFAULT_FILTERS);

  // Toggle active ↔ suspended
  const handleToggleSuspend = async (id, currentStatus) => {
    const newIsActive = currentStatus === 'suspended'; // if suspended → activate; if active → suspend
    try {
      await updateUserStatus(id, newIsActive);
      setUsers((prev) => prev.map((u) =>
        u.id === id ? { ...u, status: newIsActive ? 'active' : 'suspended' } : u
      ));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update user status');
    }
  };

  const [viewUser, setViewUser] = useState(null);

  const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let list = [...users];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter((user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    }

    if (filters.role !== 'all') {
      list = list.filter((user) => user.role.toLowerCase() === filters.role.toLowerCase());
    }

    if (filters.status !== 'all') {
      list = list.filter((user) => user.status === filters.status);
    }

    return list;
  }, [users, filters]);

  const totalBuyers  = users.filter((user) => user.role === 'Buyer').length;
  const totalSellers = users.filter((user) => user.role === 'Seller').length;
  const suspended    = users.filter((user) => user.status === 'suspended').length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        subtitle="Manage buyers and sellers across the BidStream marketplace."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Users' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: `${users.length} Total`,      dot: 'bg-navy-500' },
              { label: `${totalBuyers} Buyers`,       dot: 'bg-accent-500' },
              { label: `${totalSellers} Sellers`,     dot: 'bg-secondary-600' },
              { label: `${suspended} Suspended`,      dot: 'bg-danger' },
            ].map(({ label, dot }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary shadow-card"
              >
                <span className={['h-1.5 w-1.5 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        }
      />

      {loading && <p className="text-sm text-text-muted">Loading users…</p>}
      {error   && <p className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">{error}</p>}

      <UserFilters
        filters={filters}
        onChange={handleChange}
        onClear={handleClear}
        hasActive={hasActive}
      />

      {!loading && filtered.length > 0 && (
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="font-semibold text-text-primary">{filtered.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-text-primary">{users.length}</span>
          {' '}users
          {hasActive && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-secondary-600 hover:text-secondary-500 focus-visible:outline-none"
            >
              (clear filters)
            </button>
          )}
        </p>
      )}

      {!loading && <UsersTable users={filtered} onView={setViewUser} onToggleSuspend={handleToggleSuspend} />}

      {/* ── View User Modal ── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
          onClick={() => setViewUser(null)} aria-hidden="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
            onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <h3 className="text-base font-bold text-text-primary">User Profile</h3>
              <button type="button" onClick={() => setViewUser(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-600 to-primary-700 text-xl font-bold text-white shadow-card">
                  {viewUser.avatar}
                </span>
                <div>
                  <p className="text-base font-bold text-text-primary">{viewUser.name}</p>
                  <p className="text-sm text-text-muted">{viewUser.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      viewUser.role === 'Seller' ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600'].join(' ')}>
                      {viewUser.role}
                    </span>
                    <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      viewUser.status === 'active' ? 'bg-success-100 text-success' : 'bg-danger-100 text-danger'].join(' ')}>
                      {viewUser.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border-subtle">
                {[
                  { label: 'Phone',    value: viewUser.phone    },
                  { label: 'Location', value: viewUser.location },
                  { label: 'Bio',      value: viewUser.bio      },
                  { label: 'Joined',   value: viewUser.joinedAt },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <p className="text-xs font-semibold text-text-muted">{label}</p>
                    <p className="text-sm font-medium text-text-primary">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setViewUser(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface">
                  Close
                </button>
                <button type="button"
                  onClick={() => { handleToggleSuspend(viewUser.id, viewUser.status); setViewUser(null); }}
                  className={['flex-1 rounded-xl py-2.5 text-sm font-semibold text-white shadow-card',
                    viewUser.status === 'active' ? 'bg-danger hover:opacity-90' : 'bg-success hover:opacity-90'].join(' ')}>
                  {viewUser.status === 'active' ? 'Suspend User' : 'Activate User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
