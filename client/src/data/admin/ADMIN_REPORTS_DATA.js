// ─── BidStream — Admin Reports dummy data ────────────────────────────────────
// 18 realistic reports covering all types, priorities and statuses.

const ADMIN_REPORTS = [
  { id: 'RPT-001', type: 'auction',  title: 'Fake listing — counterfeit sneakers',       reportedBy: 'Ayesha M.',  reportedItem: 'Auction #aa02',     priority: 'high',   status: 'pending',    createdAt: 'Jul 7, 2026' },
  { id: 'RPT-002', type: 'payment',  title: 'Payment not received after auction win',     reportedBy: 'Bilal C.',   reportedItem: 'Order #ORD-2026-007', priority: 'high',   status: 'pending',    createdAt: 'Jul 7, 2026' },
  { id: 'RPT-003', type: 'user',     title: 'Abusive messages from seller',               reportedBy: 'Nadia S.',   reportedItem: 'User ahmed_sells',  priority: 'medium', status: 'reviewing',  createdAt: 'Jul 6, 2026' },
  { id: 'RPT-004', type: 'auction',  title: 'Suspected counterfeit luxury watch',         reportedBy: 'Omar F.',    reportedItem: 'Auction #aa03',     priority: 'high',   status: 'pending',    createdAt: 'Jul 6, 2026' },
  { id: 'RPT-005', type: 'payment',  title: 'Refund not processed — 7 days overdue',     reportedBy: 'Kamran A.',  reportedItem: 'Order #ORD-2026-012', priority: 'medium', status: 'reviewing',  createdAt: 'Jul 5, 2026' },
  { id: 'RPT-006', type: 'user',     title: 'Spam messages sent to multiple buyers',      reportedBy: 'Zara A.',    reportedItem: 'User kamran_a',     priority: 'low',    status: 'resolved',   createdAt: 'Jul 5, 2026' },
  { id: 'RPT-007', type: 'auction',  title: 'Policy violation — prohibited item listed',  reportedBy: 'Rehan M.',   reportedItem: 'Auction #aa11',     priority: 'medium', status: 'pending',    createdAt: 'Jul 4, 2026' },
  { id: 'RPT-008', type: 'user',     title: 'Seller misrepresented item condition',       reportedBy: 'Hassan R.',  reportedItem: 'User rehan_mirza',  priority: 'high',   status: 'pending',    createdAt: 'Jul 4, 2026' },
  { id: 'RPT-009', type: 'other',    title: 'Incorrect category placement',               reportedBy: 'Layla T.',   reportedItem: 'Auction #aa09',     priority: 'low',    status: 'resolved',   createdAt: 'Jul 3, 2026' },
  { id: 'RPT-010', type: 'payment',  title: 'Double charged on winning bid',              reportedBy: 'Usman T.',   reportedItem: 'Order #ORD-2026-004', priority: 'high',   status: 'reviewing',  createdAt: 'Jul 3, 2026' },
  { id: 'RPT-011', type: 'user',     title: 'Buyer left fraudulent negative review',      reportedBy: 'Ahmed H.',   reportedItem: 'User kamran_a',     priority: 'medium', status: 'resolved',   createdAt: 'Jul 2, 2026' },
  { id: 'RPT-012', type: 'auction',  title: 'Auction relisted after ban',                 reportedBy: 'Fatima Q.',  reportedItem: 'Auction #aa18',     priority: 'high',   status: 'pending',    createdAt: 'Jul 2, 2026' },
  { id: 'RPT-013', type: 'other',    title: 'Broken image on auction listing',            reportedBy: 'Sana J.',    reportedItem: 'Auction #aa05',     priority: 'low',    status: 'resolved',   createdAt: 'Jul 1, 2026' },
  { id: 'RPT-014', type: 'payment',  title: 'Seller did not ship after payment',          reportedBy: 'Irfan B.',   reportedItem: 'Order #ORD-2026-009', priority: 'high',   status: 'reviewing',  createdAt: 'Jul 1, 2026' },
  { id: 'RPT-015', type: 'user',     title: 'Multiple fake accounts from same IP',        reportedBy: 'System',     reportedItem: 'User tariq_m',      priority: 'high',   status: 'pending',    createdAt: 'Jun 30, 2026'},
  { id: 'RPT-016', type: 'auction',  title: 'Starting price changed mid-auction',         reportedBy: 'Mehwish A.', reportedItem: 'Auction #aa13',     priority: 'medium', status: 'resolved',   createdAt: 'Jun 29, 2026'},
  { id: 'RPT-017', type: 'other',    title: 'Inaccurate auction description',             reportedBy: 'Danish S.',  reportedItem: 'Auction #aa16',     priority: 'low',    status: 'resolved',   createdAt: 'Jun 28, 2026'},
  { id: 'RPT-018', type: 'user',     title: 'Seller not responding to buyer messages',    reportedBy: 'Rida F.',    reportedItem: 'User hassan_raza',  priority: 'medium', status: 'reviewing',  createdAt: 'Jun 28, 2026'},
];

export const REPORT_STATUS_OPTIONS = [
  { value: 'all',       label: 'All Statuses'  },
  { value: 'pending',   label: 'Pending'       },
  { value: 'reviewing', label: 'In Review'     },
  { value: 'resolved',  label: 'Resolved'      },
];

export const REPORT_TYPE_OPTIONS = [
  { value: 'all',     label: 'All Types' },
  { value: 'user',    label: 'Users'     },
  { value: 'auction', label: 'Auctions'  },
  { value: 'payment', label: 'Payments'  },
  { value: 'other',   label: 'Other'     },
];

export const REPORT_PRIORITY_OPTIONS = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'high',   label: 'High'           },
  { value: 'medium', label: 'Medium'         },
  { value: 'low',    label: 'Low'            },
];

export default ADMIN_REPORTS;
