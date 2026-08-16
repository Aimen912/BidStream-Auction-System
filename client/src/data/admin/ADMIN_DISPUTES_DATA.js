// ─── BidStream — Admin Disputes dummy data ────────────────────────────────────
// 16 realistic dispute cases covering all types, priorities and statuses.

const ADMIN_DISPUTES = [
  { id: 'DSP-001', type: 'payment',  buyer: 'Ayesha Muneer',  buyerAvatar: 'AM', seller: 'Ahmed Hassan',   sellerAvatar: 'AH', subject: 'Payment not received after auction win',         priority: 'high',   status: 'open',       assignedTo: 'Sarah K.', createdAt: 'Jul 7, 2026' },
  { id: 'DSP-002', type: 'delivery', buyer: 'Kamran Ali',     buyerAvatar: 'KA', seller: 'Zara Ahmed',     sellerAvatar: 'ZA', subject: 'Item never shipped — 10 days overdue',            priority: 'high',   status: 'open',       assignedTo: 'Michael R.',createdAt: 'Jul 6, 2026' },
  { id: 'DSP-003', type: 'product',  buyer: 'Nadia Shah',     buyerAvatar: 'NS', seller: 'Hassan Raza',    sellerAvatar: 'HR', subject: 'Item received in damaged condition',              priority: 'medium', status: 'reviewing',  assignedTo: 'Sarah K.', createdAt: 'Jul 6, 2026' },
  { id: 'DSP-004', type: 'fraud',    buyer: 'Omar Farooq',    buyerAvatar: 'OF', seller: 'Rehan Mirza',    sellerAvatar: 'RM', subject: 'Seller listing counterfeit luxury watch',         priority: 'high',   status: 'reviewing',  assignedTo: 'Admin',    createdAt: 'Jul 5, 2026' },
  { id: 'DSP-005', type: 'payment',  buyer: 'Bilal Chaudhry', buyerAvatar: 'BC', seller: 'Danish Saeed',   sellerAvatar: 'DS', subject: 'Double charged on winning bid payment',           priority: 'high',   status: 'reviewing',  assignedTo: 'Michael R.',createdAt: 'Jul 5, 2026' },
  { id: 'DSP-006', type: 'product',  buyer: 'Layla Tariq',    buyerAvatar: 'LT', seller: 'Ahmed Hassan',   sellerAvatar: 'AH', subject: 'Item significantly not as described in listing',  priority: 'medium', status: 'open',       assignedTo: 'Unassigned',createdAt: 'Jul 4, 2026' },
  { id: 'DSP-007', type: 'delivery', buyer: 'Usman Tariq',    buyerAvatar: 'UT', seller: 'Tariq Mehmood',  sellerAvatar: 'TM', subject: 'Wrong item received — sent different model',      priority: 'medium', status: 'open',       assignedTo: 'Sarah K.', createdAt: 'Jul 4, 2026' },
  { id: 'DSP-008', type: 'fraud',    buyer: 'Sana Javed',     buyerAvatar: 'SJ', seller: 'Amina Siddiqui', sellerAvatar: 'AS', subject: 'Seller created fake bidding activity',            priority: 'high',   status: 'reviewing',  assignedTo: 'Admin',    createdAt: 'Jul 3, 2026' },
  { id: 'DSP-009', type: 'other',    buyer: 'Irfan Baig',     buyerAvatar: 'IB', seller: 'Hassan Raza',    sellerAvatar: 'HR', subject: 'Seller unresponsive for 5 days post-payment',     priority: 'low',    status: 'open',       assignedTo: 'Unassigned',createdAt: 'Jul 3, 2026' },
  { id: 'DSP-010', type: 'payment',  buyer: 'Mehwish Akhtar', buyerAvatar: 'MA', seller: 'Zara Ahmed',     sellerAvatar: 'ZA', subject: 'Refund not issued after cancelled auction',       priority: 'medium', status: 'resolved',   assignedTo: 'Michael R.',createdAt: 'Jul 2, 2026' },
  { id: 'DSP-011', type: 'product',  buyer: 'Danish Saeed',   buyerAvatar: 'DS', seller: 'Rehan Mirza',    sellerAvatar: 'RM', subject: 'Camera sold without promised accessories',        priority: 'low',    status: 'resolved',   assignedTo: 'Sarah K.', createdAt: 'Jul 1, 2026' },
  { id: 'DSP-012', type: 'delivery', buyer: 'Rida Fatima',    buyerAvatar: 'RF', seller: 'Danish Saeed',   sellerAvatar: 'DS', subject: 'Tracking number never provided by seller',        priority: 'low',    status: 'resolved',   assignedTo: 'Admin',    createdAt: 'Jun 30, 2026'},
  { id: 'DSP-013', type: 'fraud',    buyer: 'Hassan Raza',    buyerAvatar: 'HR', seller: 'Tariq Mehmood',  sellerAvatar: 'TM', subject: 'Seller used stolen photos from another listing',  priority: 'high',   status: 'open',       assignedTo: 'Unassigned',createdAt: 'Jun 30, 2026'},
  { id: 'DSP-014', type: 'other',    buyer: 'Fatima Qureshi', buyerAvatar: 'FQ', seller: 'Ahmed Hassan',   sellerAvatar: 'AH', subject: 'Auction ended early without notice',              priority: 'medium', status: 'resolved',   assignedTo: 'Michael R.',createdAt: 'Jun 29, 2026'},
  { id: 'DSP-015', type: 'product',  buyer: 'Sara Malik',     buyerAvatar: 'SM', seller: 'Amina Siddiqui', sellerAvatar: 'AS', subject: 'Print arrived with visible water damage',         priority: 'medium', status: 'reviewing',  assignedTo: 'Sarah K.', createdAt: 'Jun 28, 2026'},
  { id: 'DSP-016', type: 'payment',  buyer: 'Tariq Mehmood',  buyerAvatar: 'TM', seller: 'Zara Ahmed',     sellerAvatar: 'ZA', subject: 'Payment deducted but order not confirmed',        priority: 'high',   status: 'reviewing',  assignedTo: 'Admin',    createdAt: 'Jun 28, 2026'},
];

export const DISPUTE_STATUS_OPTIONS = [
  { value: 'all',       label: 'All Statuses'  },
  { value: 'open',      label: 'Open'          },
  { value: 'reviewing', label: 'Under Review'  },
  { value: 'resolved',  label: 'Resolved'      },
];

export const DISPUTE_PRIORITY_OPTIONS = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'high',   label: 'High'           },
  { value: 'medium', label: 'Medium'         },
  { value: 'low',    label: 'Low'            },
];

export const DISPUTE_TYPE_OPTIONS = [
  { value: 'all',      label: 'All Types' },
  { value: 'payment',  label: 'Payment'   },
  { value: 'delivery', label: 'Delivery'  },
  { value: 'product',  label: 'Product'   },
  { value: 'fraud',    label: 'Fraud'     },
  { value: 'other',    label: 'Other'     },
];

export default ADMIN_DISPUTES;
