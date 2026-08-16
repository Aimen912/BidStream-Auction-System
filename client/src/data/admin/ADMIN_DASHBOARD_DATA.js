// ─── BidStream — Admin Dashboard dummy data ───────────────────────────────────

export const ADMIN_STATS = {
  totalUsers:      2418,
  activeAuctions:  48,
  pendingReports:  11,
  revenue:         312800,
};

export const SYSTEM_OVERVIEW = [
  { label: 'Server Status',       value: 'Operational',  status: 'good'    },
  { label: 'Database',            value: 'Connected',    status: 'good'    },
  { label: 'Payment Gateway',     value: 'Operational',  status: 'good'    },
  { label: 'Email Service',       value: 'Operational',  status: 'good'    },
  { label: 'Storage Usage',       value: '64% used',     status: 'warning' },
  { label: 'Active Sessions',     value: '1,284',        status: 'good'    },
  { label: 'Scheduled Jobs',      value: '12 pending',   status: 'good'    },
  { label: 'Last Backup',         value: '2 hours ago',  status: 'good'    },
];

export const RECENT_USERS = [
  { id: 'u1',  name: 'Ayesha Muneer',    email: 'ayesha@example.com',   role: 'Buyer',  status: 'active',   joinedAt: '2 mins ago',  avatar: 'AM', gradient: 'from-blue-600 to-cyan-400'      },
  { id: 'u2',  name: 'Ahmed Hassan',     email: 'ahmed@example.com',    role: 'Seller', status: 'active',   joinedAt: '18 mins ago', avatar: 'AH', gradient: 'from-secondary-600 to-primary-700' },
  { id: 'u3',  name: 'Kamran Ali',       email: 'kamran@example.com',   role: 'Buyer',  status: 'active',   joinedAt: '1 hour ago',  avatar: 'KA', gradient: 'from-orange-500 to-yellow-300'   },
  { id: 'u4',  name: 'Fatima Qureshi',   email: 'fatima@example.com',   role: 'Seller', status: 'pending',  joinedAt: '2 hours ago', avatar: 'FQ', gradient: 'from-emerald-600 to-teal-400'    },
  { id: 'u5',  name: 'Omar Farooq',      email: 'omar@example.com',     role: 'Seller', status: 'active',   joinedAt: '3 hours ago', avatar: 'OF', gradient: 'from-primary-700 to-secondary-600' },
  { id: 'u6',  name: 'Sara Malik',       email: 'sara@example.com',     role: 'Buyer',  status: 'suspended',joinedAt: 'Yesterday',   avatar: 'SM', gradient: 'from-rose-600 to-fuchsia-400'    },
  { id: 'u7',  name: 'Hassan Raza',      email: 'hassan@example.com',   role: 'Seller', status: 'active',   joinedAt: 'Yesterday',   avatar: 'HR', gradient: 'from-amber-700 to-amber-400'     },
];

export const RECENT_REPORTS = [
  { id: 'r1',  type: 'fraud',       title: 'Fake listing reported',          reporter: 'Ayesha M.', target: 'Auction #auc-07', priority: 'high',   status: 'pending',    time: '5 mins ago'  },
  { id: 'r2',  type: 'dispute',     title: 'Item not received',              reporter: 'Kamran A.', target: 'Order #ORD-2026-007', priority: 'high',   status: 'pending',    time: '22 mins ago' },
  { id: 'r3',  type: 'abuse',       title: 'Inappropriate messages',         reporter: 'Nadia S.',  target: 'User ahmed_sells', priority: 'medium', status: 'reviewing',  time: '1 hour ago'  },
  { id: 'r4',  type: 'fraud',       title: 'Counterfeit item suspected',     reporter: 'Omar F.',   target: 'Auction #auc-02', priority: 'high',   status: 'pending',    time: '2 hours ago' },
  { id: 'r5',  type: 'dispute',     title: 'Refund not processed',           reporter: 'Bilal C.',  target: 'Order #ORD-2026-012', priority: 'medium', status: 'reviewing',  time: '4 hours ago' },
  { id: 'r6',  type: 'spam',        title: 'Spam messages from buyer',       reporter: 'Zara A.',   target: 'User kamran_a', priority: 'low',    status: 'resolved',   time: 'Yesterday'   },
  { id: 'r7',  type: 'abuse',       title: 'Policy violation in listing',    reporter: 'Rehan M.',  target: 'Auction #auc-11', priority: 'medium', status: 'pending',    time: 'Yesterday'   },
];
