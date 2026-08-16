// ─── BidStream — Seller Settings dummy data ───────────────────────────────────

export const SELLER_ACCOUNT_DEFAULTS = {
  fullName:     'Ahmed Hassan',
  username:     'ahmed_sells',
  email:        'ahmed@bidstream.com',
  phone:        '+92 300 9876543',
  businessName: 'Hassan Premium Auctions',
};

export const NOTIFICATION_DEFAULTS = {
  emailNotifications: true,
  pushNotifications:  true,
  auctionUpdates:     true,
  newMessages:        true,
  marketingEmails:    false,
};

export const APPEARANCE_DEFAULTS = {
  theme:    'system',
  language: 'en',
  timezone: 'Asia/Karachi',
};

export const THEME_OPTIONS = [
  { value: 'light',  label: 'Light'          },
  { value: 'dark',   label: 'Dark'           },
  { value: 'system', label: 'System Default' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'Urdu'    },
  { value: 'ar', label: 'Arabic'  },
  { value: 'fr', label: 'French'  },
];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Karachi',     label: 'PKT — Asia/Karachi'  },
  { value: 'UTC',              label: 'UTC'                  },
  { value: 'America/New_York', label: 'EST — New York'       },
  { value: 'Europe/London',    label: 'GMT — London'         },
  { value: 'Asia/Dubai',       label: 'GST — Dubai'          },
];
