import { Link } from 'react-router-dom';

// "Create Auction" intentionally excluded — it lives as the page-header primary CTA.
const QUICK_ACTIONS = [
  {
    id: 'auctions',
    label: 'Manage Auctions',
    to: '/seller/my-auctions',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'View Sales',
    to: '/seller/orders',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    to: '/seller/analytics',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Edit Profile',
    to: '/seller/profile',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

function QuickActions() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-5 py-3">
        <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
      </div>
      <div className="divide-y divide-border-subtle">
        {QUICK_ACTIONS.map(({ id, label, to, icon }) => (
          <Link
            key={id}
            to={to}
            className="group flex items-center gap-3 px-4 py-2.5 no-underline transition-colors duration-150 hover:bg-bg-surface"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-400 transition-colors duration-150 group-hover:bg-primary-600/18 group-hover:text-primary-300">
              {icon}
            </span>
            <span className="flex-1 text-sm text-text-secondary transition-colors duration-150 group-hover:text-text-primary">
              {label}
            </span>
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 text-border transition-colors duration-150 group-hover:text-primary-400"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
