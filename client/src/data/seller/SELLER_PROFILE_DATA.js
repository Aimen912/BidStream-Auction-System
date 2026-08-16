// ─── BidStream — Seller Profile dummy data ────────────────────────────────────

export const SELLER_PROFILE = {
  // Personal
  fullName:       'Ahmed Hassan',
  username:       'ahmed_sells',
  email:          'ahmed@bidstream.com',
  phone:          '+92 300 9876543',
  location:       'Lahore, Pakistan',
  bio:            'Passionate collector and reseller of vintage cameras, luxury watches, and fine art. Trusted BidStream seller since 2023 with 100% positive feedback.',
  avatarInitials: 'AH',
  avatarGradient: 'from-secondary-600 to-primary-700',
  joinDate:       'March 2023',
  online:         true,

  // Business
  businessName:   'Hassan Premium Auctions',
  businessType:   'Individual Seller',
  website:        'www.hassanauctions.com',
  address:        '24-B, Gulberg III, Lahore, Punjab 54000, Pakistan',
  taxId:          'NTN-1234567-8',

  // Ratings
  sellerRating:   4.9,
  reviewCount:    142,

  // KPIs
  totalAuctions:  62,
  totalSales:     47,
  revenue:        123700,
  conversionRate: 78.3,

  // Verification
  identityVerified: true,
  emailVerified:    true,
  phoneVerified:    true,
  bankVerified:     true,
  addressVerified:  false,
};

export const SELLER_ACTIVITY = [
  { id: 'pa1', type: 'sale',    text: 'Auction for "Vintage Leica M6" ended. Won by Ayesha M. for $1,340.',    time: '2 hours ago'  },
  { id: 'pa2', type: 'payment', text: 'Payment of $1,340 received and cleared to your bank account.',           time: '2 hours ago'  },
  { id: 'pa3', type: 'bid',     text: 'New bid of $12,500 received on "Rolex Submariner Date 2023".',           time: '4 hours ago'  },
  { id: 'pa4', type: 'review',  text: 'Bilal C. left a 5-star review: "Excellent condition, fast shipping!"',   time: 'Yesterday'    },
  { id: 'pa5', type: 'created', text: 'New auction listed: "Fender Custom Shop Stratocaster" — $2,800 start.', time: '2 days ago'   },
  { id: 'pa6', type: 'sale',    text: '"Gibson Les Paul Standard \'59" sold for $2,150 to Bilal C.',            time: '3 days ago'   },
  { id: 'pa7', type: 'payment', text: 'Payment of $2,150 received for Gibson Les Paul.',                        time: '3 days ago'   },
  { id: 'pa8', type: 'review',  text: 'Usman T. left a 5-star review: "Item delivered in perfect condition!"', time: '1 week ago'   },
];
