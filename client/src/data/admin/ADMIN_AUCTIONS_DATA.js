// ─── BidStream — Admin Auctions dummy data ────────────────────────────────────
// 18 realistic records covering all statuses and 6 categories.

const ADMIN_AUCTIONS = [
  { id: 'aa01', title: 'Vintage Leica M6 Film Camera',       category: 'Photography', seller: 'Ahmed Hassan',   sellerAvatar: 'AH', gradient: 'from-blue-600 to-cyan-400',          currentBid: 1340,  bids: 23, endTime: 'Jul 9, 2026 10:00', status: 'live'      },
  { id: 'aa02', title: 'Air Jordan 1 Retro High OG Chicago',  category: 'Fashion',     seller: 'Zara Ahmed',     sellerAvatar: 'ZA', gradient: 'from-orange-500 to-yellow-300',      currentBid: 3800,  bids: 47, endTime: 'Jul 8, 2026 18:30', status: 'live'      },
  { id: 'aa03', title: 'Rolex Submariner Date 2023',          category: 'Luxury',      seller: 'Ahmed Hassan',   sellerAvatar: 'AH', gradient: 'from-primary-700 to-secondary-600',  currentBid: 12500, bids: 93, endTime: 'Jul 10, 2026 14:00',status: 'live'      },
  { id: 'aa04', title: "Gibson Les Paul Standard '59",        category: 'Music',       seller: 'Hassan Raza',    sellerAvatar: 'HR', gradient: 'from-rose-600 to-fuchsia-400',        currentBid: 2150,  bids: 31, endTime: 'Jun 30, 2026 20:00',status: 'ended'     },
  { id: 'aa05', title: 'Apple Mac Pro M2 Ultra 192GB',        category: 'Technology',  seller: 'Tariq Mehmood',  sellerAvatar: 'TM', gradient: 'from-slate-700 to-gray-500',          currentBid: 6900,  bids: 62, endTime: 'Jul 12, 2026 08:00', status: 'live'      },
  { id: 'aa06', title: 'Banksy Flower Thrower Print',         category: 'Art',         seller: 'Zara Ahmed',     sellerAvatar: 'ZA', gradient: 'from-emerald-600 to-cyan-400',        currentBid: 8400,  bids: 74, endTime: 'Jul 8, 2026 22:00',  status: 'live'      },
  { id: 'aa07', title: 'Patek Philippe Nautilus Ref 5711',    category: 'Luxury',      seller: 'Danish Saeed',   sellerAvatar: 'DS', gradient: 'from-amber-700 to-amber-400',         currentBid: 0,     bids: 0,  endTime: 'Jul 20, 2026 10:00', status: 'scheduled' },
  { id: 'aa08', title: 'Canon EOS R5 Mirrorless Body',        category: 'Photography', seller: 'Rehan Mirza',    sellerAvatar: 'RM', gradient: 'from-red-600 to-rose-400',            currentBid: 2800,  bids: 28, endTime: 'Jul 11, 2026 16:00', status: 'live'      },
  { id: 'aa09', title: 'Fender Custom Shop Stratocaster',     category: 'Music',       seller: 'Hassan Raza',    sellerAvatar: 'HR', gradient: 'from-violet-600 to-indigo-400',       currentBid: 0,     bids: 0,  endTime: 'Jul 18, 2026 12:00', status: 'scheduled' },
  { id: 'aa10', title: 'Steinway Model D Concert Grand Piano',category: 'Music',       seller: 'Danish Saeed',   sellerAvatar: 'DS', gradient: 'from-slate-600 to-slate-400',         currentBid: 62000, bids: 14, endTime: 'Jun 28, 2026 20:00', status: 'ended'     },
  { id: 'aa11', title: "Hermès Birkin 30 Togo Leather",       category: 'Fashion',     seller: 'Amina Siddiqui', sellerAvatar: 'AS', gradient: 'from-pink-600 to-rose-400',           currentBid: 0,     bids: 0,  endTime: '—',                  status: 'removed'   },
  { id: 'aa12', title: 'Basquiat Signed Lithograph',          category: 'Art',         seller: 'Amina Siddiqui', sellerAvatar: 'AS', gradient: 'from-yellow-500 to-red-400',          currentBid: 0,     bids: 0,  endTime: '—',                  status: 'draft'     },
  { id: 'aa13', title: 'Sony PlayStation 5 Digital Bundle',   category: 'Technology',  seller: 'Tariq Mehmood',  sellerAvatar: 'TM', gradient: 'from-blue-700 to-violet-500',         currentBid: 520,   bids: 41, endTime: 'Jul 13, 2026 09:00', status: 'live'      },
  { id: 'aa14', title: 'Nikon Z9 Mirrorless with 70-200mm',   category: 'Photography', seller: 'Rehan Mirza',    sellerAvatar: 'RM', gradient: 'from-yellow-600 to-orange-400',       currentBid: 4800,  bids: 19, endTime: 'Jul 8, 2026 21:00',  status: 'live'      },
  { id: 'aa15', title: 'Supreme Box Logo Hoodie FW22',        category: 'Fashion',     seller: 'Zara Ahmed',     sellerAvatar: 'ZA', gradient: 'from-red-500 to-pink-400',            currentBid: 700,   bids: 55, endTime: 'Jul 9, 2026 15:00',  status: 'live'      },
  { id: 'aa16', title: 'Omega Seamaster Planet Ocean',        category: 'Luxury',      seller: 'Danish Saeed',   sellerAvatar: 'DS', gradient: 'from-secondary-700 to-blue-500',      currentBid: 0,     bids: 0,  endTime: 'Jul 25, 2026 12:00', status: 'scheduled' },
  { id: 'aa17', title: 'Acoustic Gibson J-45 Standard',       category: 'Music',       seller: 'Hassan Raza',    sellerAvatar: 'HR', gradient: 'from-amber-600 to-yellow-400',        currentBid: 1100,  bids: 9,  endTime: 'Jul 14, 2026 18:00', status: 'live'      },
  { id: 'aa18', title: 'DJI Mavic 3 Pro Drone',               category: 'Technology',  seller: 'Tariq Mehmood',  sellerAvatar: 'TM', gradient: 'from-gray-700 to-gray-500',           currentBid: 0,     bids: 0,  endTime: '—',                  status: 'draft'     },
];

export const ADMIN_AUCTION_CATEGORIES = [
  'All', 'Photography', 'Fashion', 'Luxury', 'Music', 'Technology', 'Art',
];

export const ADMIN_AUCTION_SELLERS = [
  'All', 'Ahmed Hassan', 'Zara Ahmed', 'Hassan Raza', 'Danish Saeed',
  'Rehan Mirza', 'Tariq Mehmood', 'Amina Siddiqui',
];

export const ADMIN_AUCTION_STATUSES = [
  { value: 'all',       label: 'All Statuses' },
  { value: 'live',      label: 'Live'         },
  { value: 'scheduled', label: 'Scheduled'    },
  { value: 'ended',     label: 'Ended'        },
  { value: 'draft',     label: 'Draft'        },
  { value: 'removed',   label: 'Removed'      },
];

export default ADMIN_AUCTIONS;
