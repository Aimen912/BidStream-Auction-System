// ─── ProfileStats ─────────────────────────────────────────────────────────────

/**
 * Horizontal row of 4 stat tiles.
 * Shows different stats based on role: Buyer vs Seller.
 *
 * @param {object} stats – { auctionsJoined, auctionsWon, watchlistItems, messages }
 * @param {string} role  – 'Buyer' | 'Seller' | 'Admin'
 */
function ProfileStats({ stats, role = 'Buyer' }) {
  const isSeller = role === 'Seller';

  const TILES = isSeller ? [
    {
      label: 'Auctions Listed',
      value: stats.auctionsJoined,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
    },
    {
      label: 'Items Sold',
      value: stats.auctionsWon,
      iconBg: 'bg-success-100',
      iconColor: 'text-success',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Active Auctions',
      value: stats.watchlistItems,
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      label: 'Messages',
      value: stats.messages,
      iconBg: 'bg-primary-900/30',
      iconColor: 'text-primary-300',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
  ] : [
    {
      label: 'Auctions Joined',
      value: stats.auctionsJoined,
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      label: 'Auctions Won',
      value: stats.auctionsWon,
      iconBg: 'bg-success-100',
      iconColor: 'text-success',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Watchlist Items',
      value: stats.watchlistItems,
      iconBg: 'bg-danger-100',
      iconColor: 'text-danger',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
    {
      label: 'Messages',
      value: stats.messages,
      iconBg: 'bg-primary-900/30',
      iconColor: 'text-primary-300',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {TILES.map(({ label, value, iconBg, iconColor, icon }) => (
        <div
          key={label}
          className="flex flex-col gap-2.5 rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-dropdown"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-text-muted">{label}</p>
            <span className={['flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', iconBg, iconColor].join(' ')}>
              {icon}
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-text-primary">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;
