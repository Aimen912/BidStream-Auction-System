// ─── BidStream — Seller Dashboard dummy data ─────────────────────────────────

export const SELLER_STATS = {
  activeAuctions: 8,
  itemsSold:      47,
  revenue:        38420,
  activeBidders:  124,
};

export const SELLER_AUCTIONS = [
  {
    id: 'sa1',
    title:          'Vintage Leica M6 Film Camera',
    category:       'Photography',
    gradient:       'from-blue-600 to-cyan-400',
    currentBid:     1340,
    highestBidder:  'Ayesha M.',
    bidderAvatar:   'AM',
    timeLeft:       '2h 14m',
    status:         'live',
    bids:           23,
  },
  {
    id: 'sa2',
    title:          'Air Jordan 1 Retro High OG Chicago',
    category:       'Fashion',
    gradient:       'from-orange-500 to-yellow-300',
    currentBid:     3800,
    highestBidder:  'Kamran A.',
    bidderAvatar:   'KA',
    timeLeft:       '0h 38m',
    status:         'ending_soon',
    bids:           47,
  },
  {
    id: 'sa3',
    title:          'Rolex Submariner Date 2023',
    category:       'Luxury',
    gradient:       'from-primary-700 to-secondary-600',
    currentBid:     12500,
    highestBidder:  'Omar F.',
    bidderAvatar:   'OF',
    timeLeft:       '4h 52m',
    status:         'live',
    bids:           93,
  },
  {
    id: 'sa4',
    title:          'Gibson Les Paul Standard \'59',
    category:       'Music',
    gradient:       'from-rose-600 to-fuchsia-400',
    currentBid:     2150,
    highestBidder:  'Bilal C.',
    bidderAvatar:   'BC',
    timeLeft:       'Ended',
    status:         'sold',
    bids:           31,
  },
  {
    id: 'sa5',
    title:          'Apple Mac Pro M2 Ultra 192GB',
    category:       'Technology',
    gradient:       'from-slate-700 to-gray-500',
    currentBid:     6900,
    highestBidder:  'Nadia S.',
    bidderAvatar:   'NS',
    timeLeft:       '8h 20m',
    status:         'live',
    bids:           62,
  },
  {
    id: 'sa6',
    title:          'Original Banksy Flower Thrower Print',
    category:       'Art',
    gradient:       'from-emerald-600 to-cyan-400',
    currentBid:     8400,
    highestBidder:  'Rehan M.',
    bidderAvatar:   'RM',
    timeLeft:       '0h 22m',
    status:         'ending_soon',
    bids:           74,
  },
  {
    id: 'sa7',
    title:          'Canon EOS R5 Mirrorless Body',
    category:       'Photography',
    gradient:       'from-red-600 to-rose-400',
    currentBid:     2800,
    highestBidder:  'Sana J.',
    bidderAvatar:   'SJ',
    timeLeft:       '5h 45m',
    status:         'live',
    bids:           28,
  },
  {
    id: 'sa8',
    title:          'Fender Custom Shop Stratocaster',
    category:       'Music',
    gradient:       'from-violet-600 to-indigo-400',
    currentBid:     3200,
    highestBidder:  'Layla T.',
    bidderAvatar:   'LT',
    timeLeft:       'Starts in 1d',
    status:         'upcoming',
    bids:           0,
  },
];

export const SELLER_ACTIVITY = [
  { id: 'act1', type: 'bid',     text: 'Ayesha M. placed a bid of $1,340 on Vintage Leica M6',         time: '3 mins ago',  color: 'bg-secondary-600' },
  { id: 'act2', type: 'bid',     text: 'Kamran A. is now the highest bidder on Air Jordan 1 Retro',    time: '15 mins ago', color: 'bg-secondary-600' },
  { id: 'act3', type: 'payment', text: 'Payment of $2,150 received for Gibson Les Paul Standard',       time: '1 hour ago',  color: 'bg-success'       },
  { id: 'act4', type: 'ended',   text: 'Auction for Gibson Les Paul Standard ended successfully',       time: '1 hour ago',  color: 'bg-primary-600'   },
  { id: 'act5', type: 'bid',     text: 'Omar F. placed a bid of $12,500 on Rolex Submariner',          time: '2 hours ago', color: 'bg-secondary-600' },
  { id: 'act6', type: 'created', text: 'You created a new auction: Fender Custom Shop Stratocaster',   time: '3 hours ago', color: 'bg-accent-500'    },
  { id: 'act7', type: 'payment', text: 'Payment of $8,100 received for Sony PlayStation 5 Bundle',     time: 'Yesterday',   color: 'bg-success'       },
  { id: 'act8', type: 'bid',     text: 'Nadia S. placed a bid of $6,900 on Apple Mac Pro M2 Ultra',   time: 'Yesterday',   color: 'bg-secondary-600' },
];

export const SELLER_QUICK_ACTIONS = [
  {
    id:       'qa1',
    label:    'Create Auction',
    href:     '/seller/create-auction',
    gradient: 'from-secondary-600 to-blue-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5"  y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    id:       'qa2',
    label:    'Manage Auctions',
    href: '/seller/my-auctions',   
    gradient: 'from-primary-700 to-primary-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
      </svg>
    ),
  },
  {
    id:       'qa3',
    label:    'View Sales',
    href:     '/seller/sales',
    gradient: 'from-accent-600 to-yellow-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id:       'qa4',
    label:    'Analytics',
    href:     '/seller/analytics',
    gradient: 'from-emerald-600 to-teal-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4"  />
        <line x1="6"  y1="20" x2="6"  y2="14" />
      </svg>
    ),
  },
];
