import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './shared/NotificationBell';

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/auctions':      'Auctions',
  '/bids':          'My Bids',
  '/watchlist':     'Watchlist',
  '/messages':      'Messages',
  '/notifications': 'Notifications',
  '/profile':       'Profile',
  '/settings':      'Settings',
};

function Navbar({ onMenuToggle }) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] ?? 'BidStream';

  const initials = (user?.name || '?')
    .split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  async function handleSignOut() {
    setAvatarOpen(false);
    await signOut();
    window.location.replace('/login');
  }

  return (
    // bg-bg-surface = background.navy (#0B1026) — structural navbar surface (L2)
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-bg-surface px-4 lg:px-6">

      {/* Hamburger — mobile only */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6"  x2="21" y2="6"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title — desktop */}
      <div className="hidden lg:flex items-center gap-3">
        <h1 className="text-sm font-semibold text-text-primary">{pageTitle}</h1>
        <span className="h-4 w-px bg-border" />
        <span className="text-xs text-text-muted uppercase tracking-wider capitalize">
          {user?.role || 'buyer'}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Search button */}
        <button
          type="button"
          aria-label="Search"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-transparent text-text-muted transition-colors duration-150 hover:border-primary-600/40 hover:bg-primary-600/10 hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Notification Bell — passes colorScheme="dark" so bell uses muted styling */}
        <NotificationBell
          notificationsPath={pathname.startsWith('/seller') ? '/seller/notifications' : '/notifications'}
          colorScheme="dark"
        />

        {/* Divider */}
        <span className="hidden sm:block h-5 w-px bg-border" />

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-label="User menu"
            aria-expanded={avatarOpen}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-transparent px-2.5 py-1.5 transition-colors duration-150 hover:border-primary-600/40 hover:bg-primary-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50"
          >
            {/* Avatar initials — indigo/violet gradient */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet text-xs font-bold text-white">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-lg object-cover" />
                : initials}
            </span>
            <span className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-semibold text-text-primary leading-none">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span className="text-[10px] text-text-muted leading-none mt-0.5 capitalize">
                {user?.role || 'buyer'}
              </span>
            </span>
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round"
              className={['hidden sm:block text-text-muted transition-transform duration-200', avatarOpen ? 'rotate-180' : ''].join(' ')}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {avatarOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAvatarOpen(false)} aria-hidden="true" />
              {/* Dropdown — bg-bg-elevated (L5), border, strong shadow */}
              <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-dropdown motion-safe:animate-slide-down">

                {/* User info header */}
                <div className="border-b border-border bg-bg-card/50 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-violet text-sm font-bold text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{user?.name || 'User'}</p>
                      <p className="truncate text-xs text-text-muted">{user?.email || ''}</p>
                    </div>
                  </div>
                  {/* Role badge — indigo tint */}
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary-600/20 bg-primary-600/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary-400 capitalize">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    {user?.role || 'buyer'}
                  </span>
                </div>

                {/* Menu links */}
                <div className="py-1.5">
                  {[
                    { to: '/profile',  label: 'View Profile', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                    { to: '/settings', label: 'Settings',     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
                  ].map(({ to, label, icon }) => (
                    <Link key={to} to={to} onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-primary-600/10 hover:text-text-primary no-underline">
                      <span className="text-text-muted">{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="mx-4 h-px bg-border" />

                {/* Sign out — danger semantic */}
                <div className="py-1.5">
                  <button type="button" onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger/70 transition-colors duration-150 hover:bg-danger/10 hover:text-danger">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
