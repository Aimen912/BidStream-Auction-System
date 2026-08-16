import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getDashboardStats, getAdminReports } from '../../api/admin';

const BASE_NAV_ITEMS = [
  {
    path: '/admin/dashboard', label: 'Dashboard', badgeKey: null,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    path: '/admin/users', label: 'Users', badgeKey: 'users',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    path: '/admin/auctions', label: 'Auctions', badgeKey: 'auctions',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>,
  },
  {
    path: '/admin/categories', label: 'Categories', badgeKey: null,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  },
  {
    path: '/admin/reports', label: 'Reports', badgeKey: 'reports',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    path: '/admin/disputes', label: 'Disputes', badgeKey: 'disputes',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    path: '/admin/analytics', label: 'Analytics', badgeKey: null,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
];

const BOTTOM_ITEMS = [
  {
    path: '/admin/settings', label: 'Settings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
];

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({ path, label, icon, badge, collapsed }) {
  return (
    <NavLink to={path} title={collapsed ? label : undefined}
      className={({ isActive }) => [
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5',
        'text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40',
        isActive
          ? 'bg-primary-600/15 text-primary-300'
          : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary',
      ].join(' ')}
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator — indigo, matches buyer Sidebar */}
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-500"
              aria-hidden="true"
            />
          )}

          <span className={[
            'shrink-0 transition-colors duration-200',
            isActive ? 'text-primary-400' : 'text-text-muted group-hover:text-text-secondary',
          ].join(' ')}>
            {icon}
          </span>

          {!collapsed && <span className="flex-1 truncate">{label}</span>}

          {!collapsed && badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600/15 border border-primary-600/25 px-1.5 text-[10px] font-bold text-primary-400">
              {badge}
            </span>
          )}

          {collapsed && (
            <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg border border-border bg-bg-elevated px-2.5 py-1.5 text-xs font-medium text-text-primary shadow-dropdown group-hover:block">
              {label}
              {badge && (
                <span className="ml-1.5 rounded-full bg-primary-600/15 px-1.5 py-0.5 text-[10px] text-primary-400">{badge}</span>
              )}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────

function AdminSidebar({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }) {
  const [counts, setCounts] = useState({ users: null, auctions: null, reports: null, disputes: null });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [s, r] = await Promise.allSettled([
          getDashboardStats(),
          getAdminReports({ limit: 1 }),
        ]);
        if (!active) return;
        const total = r.status === 'fulfilled' ? (r.value.pagination?.total ?? null) : null;
        setCounts({
          users:    s.status === 'fulfilled' ? (s.value.stats?.totalUsers    ?? null) : null,
          auctions: s.status === 'fulfilled' ? (s.value.stats?.totalAuctions ?? null) : null,
          reports:  total,
          disputes: total,
        });
      } catch { /* silent */ }
    }
    load();
    return () => { active = false; };
  }, []);

  const NAV_ITEMS = BASE_NAV_ITEMS.map((item) => ({
    ...item,
    badge: item.badgeKey && counts[item.badgeKey] !== null ? String(counts[item.badgeKey]) : null,
  }));

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose} aria-hidden="true"/>
      )}

      <aside className={[
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-background-sidebar transition-all duration-200 overflow-hidden border-r border-border',
        collapsed ? 'w-[72px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto',
      ].filter(Boolean).join(' ')}>

        {/* Brand — indigo/violet gradient, matches buyer Sidebar */}
        <div className={['flex h-16 shrink-0 items-center border-b border-border', collapsed ? 'justify-center px-0' : 'gap-3 px-5'].join(' ')}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 15L9 3l6 12H3z" fill="white"/>
            </svg>
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block text-base font-bold tracking-tight text-text-primary leading-none">
                Bid<span className="text-primary-400">Stream</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-text-muted mt-0.5">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {NAV_ITEMS.map((item) => <NavItem key={item.path} {...item} collapsed={collapsed}/>)}
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-border px-3 py-4 flex flex-col gap-0.5">
          {BOTTOM_ITEMS.map((item) => <NavItem key={item.path} {...item} collapsed={collapsed}/>)}
          <button type="button" onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="mt-1 hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-text-muted transition-colors duration-200 hover:bg-primary-600/10 hover:text-text-secondary focus-visible:outline-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              className={['shrink-0 transition-transform duration-200', collapsed ? 'rotate-180' : ''].join(' ')} aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
