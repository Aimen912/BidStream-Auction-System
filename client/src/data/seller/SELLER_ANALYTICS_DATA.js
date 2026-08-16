// ─── BidStream — Seller Analytics dummy data ─────────────────────────────────

// Monthly revenue for the current year
export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 4200,  auctions: 3 },
  { month: 'Feb', revenue: 6800,  auctions: 5 },
  { month: 'Mar', revenue: 5400,  auctions: 4 },
  { month: 'Apr', revenue: 9100,  auctions: 7 },
  { month: 'May', revenue: 7600,  auctions: 6 },
  { month: 'Jun', revenue: 11200, auctions: 8 },
  { month: 'Jul', revenue: 13800, auctions: 9 },
  { month: 'Aug', revenue: 10500, auctions: 7 },
  { month: 'Sep', revenue: 8900,  auctions: 6 },
  { month: 'Oct', revenue: 12400, auctions: 8 },
  { month: 'Nov', revenue: 15600, auctions: 11 },
  { month: 'Dec', revenue: 18200, auctions: 13 },
];

// Summary KPIs
export const ANALYTICS_SUMMARY = {
  totalRevenue:     123700,
  activeAuctions:   8,
  completedSales:   47,
  conversionRate:   78.3,
};

// Auction performance breakdown
export const AUCTION_PERFORMANCE = {
  totalAuctions:     62,
  successfulSales:   47,
  expiredAuctions:   9,
  cancelledAuctions: 6,
  avgBidCount:       34,
  highestWinBid:     62000,
  lowestWinBid:      320,
  avgWinBid:         2632,
};

// Category breakdown
export const TOP_CATEGORIES = [
  { name: 'Photography', auctions: 14, percentage: 22, gradient: 'from-primary-600 to-primary-400', bg: 'bg-primary-600' },
  { name: 'Luxury',      auctions: 11, percentage: 18, gradient: 'from-amber-600 to-yellow-400', bg: 'bg-amber-500'  },
  { name: 'Fashion',     auctions: 12, percentage: 19, gradient: 'from-pink-500 to-rose-400',    bg: 'bg-pink-500'   },
  { name: 'Music',       auctions: 9,  percentage: 15, gradient: 'from-violet-600 to-indigo-400', bg: 'bg-violet/30'    },
  { name: 'Technology',  auctions: 10, percentage: 16, gradient: 'from-slate-600 to-gray-500',   bg: 'bg-slate-500'  },
  { name: 'Art',         auctions: 6,  percentage: 10, gradient: 'from-emerald-600 to-teal-400', bg: 'bg-emerald-500'},
];

// Recent insights timeline
export const RECENT_INSIGHTS = [
  { id: 'i1', type: 'positive', text: 'Revenue increased by 12.4% compared to last month.',              time: 'Today'        },
  { id: 'i2', type: 'positive', text: '3 auctions received over 50 bids each this month.',               time: 'Today'        },
  { id: 'i3', type: 'positive', text: 'Highest selling category is Photography with 22% of all sales.', time: 'Yesterday'    },
  { id: 'i4', type: 'neutral',  text: 'Customer engagement improved by 8% compared to last quarter.',   time: '2 days ago'   },
  { id: 'i5', type: 'positive', text: 'Average selling price increased from $1,840 to $2,632.',          time: '3 days ago'   },
  { id: 'i6', type: 'warning',  text: '9 auctions expired without a sale. Consider lowering reserve.',   time: '4 days ago'   },
  { id: 'i7', type: 'positive', text: 'Conversion rate reached 78.3% — a record high for this year.',   time: '5 days ago'   },
  { id: 'i8', type: 'neutral',  text: 'Fashion category saw a 15% rise in watch time per listing.',      time: '1 week ago'   },
];

export const DATE_RANGES = [
  { value: 'this_month',  label: 'This Month'   },
  { value: 'last_month',  label: 'Last Month'   },
  { value: 'last_3',      label: 'Last 3 Months'},
  { value: 'last_6',      label: 'Last 6 Months'},
  { value: 'this_year',   label: 'This Year'    },
];
