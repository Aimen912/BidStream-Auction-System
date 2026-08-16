// ─── BidStream — Admin Settings dummy data ────────────────────────────────────

export const SETTINGS_CATEGORIES = [
  { id: 'profile',       label: 'Profile',       icon: '👤'  },
  { id: 'general',       label: 'General',       icon: '⚙️'  },
  { id: 'marketplace',   label: 'Marketplace',   icon: '🏪'  },
  { id: 'auctions',      label: 'Auctions',      icon: '🔨'  },
  { id: 'users',         label: 'Users',         icon: '👥'  },
  { id: 'notifications', label: 'Notifications', icon: '🔔'  },
  { id: 'security',      label: 'Security',      icon: '🔒'  },
  { id: 'appearance',    label: 'Appearance',    icon: '🎨'  },
  { id: 'system',        label: 'System',        icon: '🖥️'  },
];

export const GENERAL_DEFAULTS = {
  platformName:   'BidStream',
  supportEmail:   'support@bidstream.com',
  timezone:       'Asia/Karachi',
  currency:       'USD',
};

export const MARKETPLACE_DEFAULTS = {
  allowSellerRegistration: true,
  autoApproveSellers:      false,
  featuredAuctionsLimit:   6,
};

export const AUCTION_DEFAULTS = {
  maxAuctionDays:      30,
  minBidIncrement:     10,
  autoCloseAuctions:   true,
};

export const USER_DEFAULTS = {
  requireEmailVerification: true,
  enableUserReports:         true,
  allowAccountDeletion:      false,
};

export const NOTIFICATION_DEFAULTS = {
  emailNotifications:   true,
  pushNotifications:    true,
  weeklyAdminSummary:   true,
};

export const SECURITY_DEFAULTS = {
  twoFactorAuth:       false,
  sessionTimeoutMins:  60,
  maxLoginAttempts:    5,
};

export const APPEARANCE_DEFAULTS = {
  theme:        'light',
  compactMode:  false,
  accentColor:  'blue',
};

export const SYSTEM_INFO = {
  version:        'v2.4.1',
  lastBackup:     'Jul 7, 2026 — 03:00 UTC',
  dbStatus:       'Connected',
  serverStatus:   'Operational',
  uptime:         '99.97%',
  nodeVersion:    '18.20.2',
};

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Karachi',     label: 'PKT — Asia/Karachi'  },
  { value: 'UTC',              label: 'UTC'                  },
  { value: 'America/New_York', label: 'EST — New York'       },
  { value: 'Europe/London',    label: 'GMT — London'         },
  { value: 'Asia/Dubai',       label: 'GST — Dubai'          },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar'      },
  { value: 'EUR', label: 'EUR — Euro'           },
  { value: 'GBP', label: 'GBP — British Pound'  },
  { value: 'PKR', label: 'PKR — Pakistani Rupee'},
  { value: 'AED', label: 'AED — UAE Dirham'     },
];

export const THEME_OPTIONS = [
  { value: 'light',  label: 'Light'          },
  { value: 'dark',   label: 'Dark'           },
  { value: 'system', label: 'System Default' },
];

export const ACCENT_OPTIONS = [
  { value: 'blue',   label: 'Blue (Default)' },
  { value: 'indigo', label: 'Indigo'         },
  { value: 'violet', label: 'Violet'         },
  { value: 'emerald',label: 'Emerald'        },
];
