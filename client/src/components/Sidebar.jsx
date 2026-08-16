import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { listNotifications } from '../api/notifications';
import { getUnreadMessageCount } from '../api/messages';

// ─── Nav data (icons unchanged — logic only) ──────────────────────────────────

const NAV_ITEMS = [
  { path: '/dashboard',     label: 'Dashboard',     icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>) },
  { path: '/auctions',      label: 'Auctions',      icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>) },
  { path: '/live',          label: 'Live Auctions', liveDot: true, icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>) },
  { path: '/bids',          label: 'My Bids',       icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>) },
  { path: '/orders',        label: 'My Orders',     icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>) },
  { path: '/watchlist',     label: 'Watchlist',     icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>) },
  { path: '/messages',      label: 'Messages',      icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>) },
  { path: '/notifications',  label: 'Notifications', icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>) },
];

const BOTTOM_ITEMS = [
  { path: '/profile',  label: 'Profile',  icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
  { path: '/settings', label: 'Settings', icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>) },
];

const SELLER_NAV_ITEMS = [
  { path: '/seller/dashboard',      label: 'Dashboard',      icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>) },
  { path: '/seller/my-auctions',    label: 'My Auctions',    icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>) },
  { path: '/seller/create-auction', label: 'Create Auction', icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>) },
  { path: '/seller/live',           label: 'Live Auctions',  liveDot: true, icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>) },
  { path: '/seller/orders',         label: 'Orders',         icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>) },
  { path: '/seller/analytics',      label: 'Analytics',      icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>) },
  { path: '/seller/messages',       label: 'Messages',       icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>) },
  { path: '/seller/notifications',  label: 'Notifications',  icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>) },
];

const SELLER_BOTTOM_ITEMS = [
  { path: '/seller/profile',  label: 'Profile',  icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
  { path: '/seller/settings', label: 'Settings', icon: (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>) },
];

// ─── NavItem ─────────────────────────────────────────────────────────────────
//
// Active state:  indigo tint bg + indigo left indicator bar + indigo icon
// Inactive state: muted text, subtle indigo bg + slightly brighter text on hover
// No sky/blue — all primary-* tokens

function NavItem({ path, label, icon, badge, liveDot, collapsed }) {
  return (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5',
          'text-sm font-medium transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40',
          isActive
            // Active: subtle indigo fill + slightly brighter text
            ? 'bg-primary-600/15 text-primary-300'
            // Inactive: muted, indigo hover
            : 'text-text-muted hover:bg-primary-600/10 hover:text-text-secondary',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator — indigo, no glow */}
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-500"
              aria-hidden="true"
            />
          )}

          {/* Icon — slightly brighter when active, subtle transition on hover */}
          <span className={[
            'shrink-0 transition-colors duration-200',
            isActive ? 'text-primary-400' : 'text-text-muted group-hover:text-text-secondary',
          ].join(' ')}>
            {icon}
          </span>

          {/* Label */}
          {!collapsed && <span className="flex-1 truncate">{label}</span>}

          {/* Badge — indigo tint */}
          {!collapsed && badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600/15 border border-primary-600/25 px-1.5 text-[10px] font-bold text-primary-400">
              {badge}
            </span>
          )}

          {/* Live dot — danger (red) for live auction status indicator */}
          {!collapsed && liveDot && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
            </span>
          )}

          {/* Collapsed tooltip — bg-bg-elevated, border-border */}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 z-50 hidden rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary shadow-dropdown group-hover:block whitespace-nowrap">
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

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }) {
  const { pathname } = useLocation();
  const isSeller = pathname.startsWith('/seller');

  const [notifCount, setNotifCount] = useState(0);
  const [msgCount,   setMsgCount]   = useState(0);

  // ── Logic unchanged ───────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    async function loadCounts() {
      try {
        const [notifRes, msgRes] = await Promise.allSettled([
          listNotifications({ limit: 1 }),
          getUnreadMessageCount(),
        ]);
        if (!active) return;
        if (notifRes.status === 'fulfilled') setNotifCount(notifRes.value?.unreadCount ?? 0);
        if (msgRes.status   === 'fulfilled') setMsgCount(msgRes.value?.count ?? 0);
      } catch { /* silent */ }
    }
    loadCounts();
    const id = setInterval(loadCounts, 30_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const mainItems = (isSeller ? SELLER_NAV_ITEMS : NAV_ITEMS).map((item) => {
    if (item.path.endsWith('/notifications')) return { ...item, badge: notifCount > 0 ? String(notifCount) : null };
    if (item.path.endsWith('/messages'))      return { ...item, badge: msgCount   > 0 ? String(msgCount)   : null };
    if (item.path === '/auctions')            return { ...item, badge: null };
    if (item.path === '/bids')                return { ...item, badge: null };
    return { ...item, badge: item.badge && !['12','3','5','8'].includes(item.badge) ? item.badge : null };
  });

  const bottomItems = isSeller ? SELLER_BOTTOM_ITEMS : BOTTOM_ITEMS;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel — bg-bg-sidebar (#0D132D = L3 surface) */}
      <aside className={[
        'fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden transition-all duration-300',
        'bg-background-sidebar border-r border-border',
        collapsed ? 'w-[68px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto',
      ].filter(Boolean).join(' ')}>

        {/* Brand */}
        <div className={[
          'flex items-center h-16 shrink-0 border-b border-border',
          collapsed ? 'justify-center px-0' : 'gap-3 px-5',
        ].join(' ')}>
          {/* Logo mark — indigo/violet gradient, no neon glow */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 15L9 3l6 12H3z" fill="white" />
            </svg>
          </span>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-text-primary leading-none">
                Bid<span className="text-primary-400">Stream</span>
              </span>
              <span className="text-[10px] text-text-muted font-medium mt-0.5 tracking-wider uppercase">Auction Platform</span>
            </div>
          )}
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Navigation</p>
          </div>
        )}

        {/* Main nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Separator */}
        <div className="mx-4 h-px bg-border" />

        {/* Bottom nav */}
        <div className="shrink-0 px-3 py-3 flex flex-col gap-0.5">
          {bottomItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="mt-1 hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-text-muted transition-colors duration-200 hover:bg-primary-600/10 hover:text-text-secondary focus-visible:outline-none"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              className={['shrink-0 transition-transform duration-300', collapsed ? 'rotate-180' : ''].join(' ')}
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
