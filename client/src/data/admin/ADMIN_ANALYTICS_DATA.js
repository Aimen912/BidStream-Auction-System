// ─── BidStream — Admin Analytics dummy data ───────────────────────────────────

export const ADMIN_KPI = {
  totalRevenue:       312800,
  activeUsers:        1842,
  liveAuctions:       48,
  successfulAuctions: 847,
};

// Monthly revenue + auctions (current year)
export const MONTHLY_DATA = [
  { month: 'Jan', revenue: 18400,  auctions: 52  },
  { month: 'Feb', revenue: 24600,  auctions: 71  },
  { month: 'Mar', revenue: 21200,  auctions: 63  },
  { month: 'Apr', revenue: 31800,  auctions: 88  },
  { month: 'May', revenue: 28500,  auctions: 79  },
  { month: 'Jun', revenue: 38900,  auctions: 104 },
  { month: 'Jul', revenue: 46200,  auctions: 118 },
  { month: 'Aug', revenue: 39700,  auctions: 97  },
  { month: 'Sep', revenue: 33400,  auctions: 85  },
  { month: 'Oct', revenue: 42100,  auctions: 109 },
  { month: 'Nov', revenue: 51600,  auctions: 131 },
  { month: 'Dec', revenue: 61800,  auctions: 148 },
];

// User distribution
export const USER_DISTRIBUTION = [
  { label: 'Buyers',  value: 1624, pct: 67, color: 'bg-secondary-600', hex: '#6366F1' },
  { label: 'Sellers', value: 578,  pct: 24, color: 'bg-accent-500',    hex: '#F59E0B' },
  { label: 'Admins',  value: 216,  pct: 9,  color: 'bg-primary-700',   hex: '#4338CA' },
];

// Category auction volume
export const CATEGORY_VOLUMES = [
  { name: 'Fashion',      count: 214, pct: 100, color: 'bg-pink-500'      },
  { name: 'Technology',   count: 198, pct: 93,  color: 'bg-slate-600'     },
  { name: 'Photography',  count: 176, pct: 82,  color: 'bg-secondary-600'  },
  { name: 'Luxury',       count: 143, pct: 67,  color: 'bg-amber-500'     },
  { name: 'Collectibles', count: 128, pct: 60,  color: 'bg-secondary-600' },
  { name: 'Music',        count: 112, pct: 52,  color: 'bg-violet/30'         },
  { name: 'Art',          count:  94, pct: 44,  color: 'bg-emerald-500'   },
  { name: 'Other',        count:  79, pct: 37,  color: 'bg-navy-500'      },
];

// Mini insight cards
export const MINI_INSIGHTS = [
  { label: 'New Users This Month',        value: '312',    trend: '+18%', trendDir: 'up'   },
  { label: 'Average Winning Bid',         value: '$2,632', trend: '+8.4%',trendDir: 'up'   },
  { label: 'Total Completed Auctions',    value: '847',    trend: '+54',  trendDir: 'up'   },
  { label: 'Disputes Resolved',           value: '38',     trend: '89%',  trendDir: 'up'   },
];

// Marketplace activity timeline
export const ACTIVITY_TIMELINE = [
  { id: 'at1', type: 'user',     text: 'New seller "Tariq Mehmood" registered and verified.',         time: '4 mins ago'   },
  { id: 'at2', type: 'auction',  text: 'High-value auction created: Patek Philippe Nautilus — $40k start.', time: '18 mins ago' },
  { id: 'at3', type: 'sale',     text: 'Auction completed: Rolex Submariner sold for $12,500.',         time: '45 mins ago'  },
  { id: 'at4', type: 'dispute',  text: 'Dispute DSP-013 resolved by moderator Sarah K.',               time: '1 hour ago'   },
  { id: 'at5', type: 'user',     text: 'User "sara_malik" suspended for policy violations.',            time: '2 hours ago'  },
  { id: 'at6', type: 'auction',  text: 'Auction created: Banksy Flower Thrower Print — $5,000 start.', time: '3 hours ago'  },
  { id: 'at7', type: 'sale',     text: 'Record sale: Steinway Concert Grand Piano — $62,000.',          time: 'Yesterday'    },
  { id: 'at8', type: 'report',   text: 'Report RPT-006 resolved: Spam messages — user warned.',         time: 'Yesterday'    },
];
