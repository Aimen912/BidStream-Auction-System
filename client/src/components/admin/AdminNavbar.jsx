
import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../shared/NotificationBell';

const PAGE_TITLES = {
  '/admin/dashboard':  'Dashboard',
  '/admin/users':      'Users',
  '/admin/auctions':   'Auctions',
  '/admin/categories': 'Categories',
  '/admin/reports':    'Reports',
  '/admin/disputes':   'Disputes',
  '/admin/analytics':  'Analytics',
  '/admin/settings':   'Settings',
};

function AdminNavbar({ onMenuToggle }) {
  const { pathname }       = useLocation();
  const { user, signOut }  = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] ?? 'Admin';

  const initials = (user?.name || 'SA')
    .split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  async function handleSignOut() {
    setDropdownOpen(false);
    await signOut();
    window.location.replace('/admin/login');
  }

  return (
    // bg-bg-surface = background.navy (#0B1026) — structural L2 surface, same as buyer Navbar
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-bg-surface px-4 lg:px-6">

      {/* Hamburger — mobile only */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title */}
      <div className="hidden lg:flex items-center gap-3">
        <h1 className="text-sm font-semibold text-text-primary">{pageTitle}</h1>
        <span className="h-4 w-px bg-border" />
        <span className="text-xs text-text-muted uppercase tracking-wider">Admin</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <NotificationBell notificationsPath="/admin/notifications" colorScheme="dark" />

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Admin menu"
            aria-expanded={dropdownOpen}
            // Gradient avatar matching buyer Navbar — from-primary-600 to-violet
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-violet text-sm font-bold text-white shadow-card transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]"
          >
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-xl object-cover" />
              : initials}
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} aria-hidden="true" />
              {/* Dropdown — bg-bg-elevated (L5), same as all other dropdowns */}
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-bg-elevated py-1.5 shadow-dropdown motion-safe:animate-slide-down">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
                  {/* Admin role badge — indigo tint */}
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-primary-600/20 bg-primary-600/10 px-2 py-0.5 text-[10px] font-bold text-primary-300">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Administrator
                  </span>
                </div>
                <Link
                  to="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-primary-600/10 hover:text-text-primary no-underline"
                >
                  Settings
                </Link>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger transition-colors duration-150 hover:bg-danger/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
