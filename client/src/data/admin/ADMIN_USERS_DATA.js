// ─── BidStream — Admin Users dummy data ──────────────────────────────────────
// 20 realistic users covering both roles and all statuses.

const ADMIN_USERS = [
  { id: 'u01', name: 'Ayesha Muneer',    email: 'ayesha@example.com',    role: 'Buyer',  status: 'active',    joinedAt: 'Jul 7, 2026',  avatar: 'AM', gradient: 'from-blue-600 to-cyan-400',        auctions: 0,  bids: 48  },
  { id: 'u02', name: 'Ahmed Hassan',     email: 'ahmed@example.com',     role: 'Seller', status: 'active',    joinedAt: 'Mar 12, 2023', avatar: 'AH', gradient: 'from-secondary-600 to-primary-700', auctions: 62, bids: 0   },
  { id: 'u03', name: 'Kamran Ali',       email: 'kamran@example.com',    role: 'Buyer',  status: 'active',    joinedAt: 'Jun 30, 2026', avatar: 'KA', gradient: 'from-orange-500 to-yellow-300',    auctions: 0,  bids: 31  },
  { id: 'u04', name: 'Fatima Qureshi',   email: 'fatima@example.com',    role: 'Seller', status: 'pending',   joinedAt: 'Jul 5, 2026',  avatar: 'FQ', gradient: 'from-emerald-600 to-teal-400',     auctions: 3,  bids: 0   },
  { id: 'u05', name: 'Omar Farooq',      email: 'omar@example.com',      role: 'Seller', status: 'active',    joinedAt: 'Jan 8, 2025',  avatar: 'OF', gradient: 'from-primary-700 to-secondary-600', auctions: 18, bids: 0   },
  { id: 'u06', name: 'Sara Malik',       email: 'sara@example.com',      role: 'Buyer',  status: 'suspended', joinedAt: 'May 14, 2025', avatar: 'SM', gradient: 'from-rose-600 to-fuchsia-400',     auctions: 0,  bids: 5   },
  { id: 'u07', name: 'Hassan Raza',      email: 'hassan@example.com',    role: 'Seller', status: 'active',    joinedAt: 'Feb 22, 2024', avatar: 'HR', gradient: 'from-amber-700 to-amber-400',      auctions: 11, bids: 0   },
  { id: 'u08', name: 'Nadia Shah',       email: 'nadia@example.com',     role: 'Buyer',  status: 'active',    joinedAt: 'Apr 3, 2026',  avatar: 'NS', gradient: 'from-red-600 to-rose-400',         auctions: 0,  bids: 19  },
  { id: 'u09', name: 'Bilal Chaudhry',   email: 'bilal@example.com',     role: 'Buyer',  status: 'active',    joinedAt: 'Nov 11, 2024', avatar: 'BC', gradient: 'from-violet-600 to-indigo-400',    auctions: 0,  bids: 72  },
  { id: 'u10', name: 'Zara Ahmed',       email: 'zara@example.com',      role: 'Seller', status: 'active',    joinedAt: 'Sep 5, 2023',  avatar: 'ZA', gradient: 'from-emerald-600 to-cyan-400',     auctions: 27, bids: 0   },
  { id: 'u11', name: 'Irfan Baig',       email: 'irfan@example.com',     role: 'Buyer',  status: 'active',    joinedAt: 'Jul 1, 2026',  avatar: 'IB', gradient: 'from-blue-700 to-violet-500',      auctions: 0,  bids: 14  },
  { id: 'u12', name: 'Layla Tariq',      email: 'layla@example.com',     role: 'Buyer',  status: 'active',    joinedAt: 'Mar 29, 2026', avatar: 'LT', gradient: 'from-pink-600 to-rose-400',        auctions: 0,  bids: 8   },
  { id: 'u13', name: 'Rehan Mirza',      email: 'rehan@example.com',     role: 'Seller', status: 'active',    joinedAt: 'Oct 17, 2023', avatar: 'RM', gradient: 'from-slate-600 to-slate-400',      auctions: 9,  bids: 0   },
  { id: 'u14', name: 'Amina Siddiqui',   email: 'amina@example.com',     role: 'Seller', status: 'pending',   joinedAt: 'Jul 6, 2026',  avatar: 'AS', gradient: 'from-yellow-500 to-red-400',       auctions: 1,  bids: 0   },
  { id: 'u15', name: 'Usman Tariq',      email: 'usman@example.com',     role: 'Buyer',  status: 'active',    joinedAt: 'Dec 2, 2024',  avatar: 'UT', gradient: 'from-teal-600 to-cyan-400',        auctions: 0,  bids: 33  },
  { id: 'u16', name: 'Sana Javed',       email: 'sana@example.com',      role: 'Buyer',  status: 'suspended', joinedAt: 'Feb 18, 2025', avatar: 'SJ', gradient: 'from-yellow-600 to-orange-400',    auctions: 0,  bids: 2   },
  { id: 'u17', name: 'Tariq Mehmood',    email: 'tariq@example.com',     role: 'Seller', status: 'active',    joinedAt: 'Jun 10, 2025', avatar: 'TM', gradient: 'from-green-600 to-emerald-400',    auctions: 6,  bids: 0   },
  { id: 'u18', name: 'Mehwish Akhtar',   email: 'mehwish@example.com',   role: 'Buyer',  status: 'active',    joinedAt: 'May 22, 2026', avatar: 'MA', gradient: 'from-fuchsia-600 to-pink-400',     auctions: 0,  bids: 21  },
  { id: 'u19', name: 'Danish Saeed',     email: 'danish@example.com',    role: 'Seller', status: 'active',    joinedAt: 'Aug 30, 2023', avatar: 'DS', gradient: 'from-cyan-600 to-blue-400',        auctions: 14, bids: 0   },
  { id: 'u20', name: 'Rida Fatima',      email: 'rida@example.com',      role: 'Buyer',  status: 'active',    joinedAt: 'Apr 14, 2026', avatar: 'RF', gradient: 'from-red-500 to-pink-400',         auctions: 0,  bids: 11  },
];

export default ADMIN_USERS;
