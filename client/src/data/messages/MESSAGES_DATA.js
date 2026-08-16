// ─── BidStream — Messages dummy data ─────────────────────────────────────────
// 10 conversations, each with a thread of messages.
// MY_ID represents the logged-in user.

export const MY_ID = 'me';

const CONVERSATIONS = [
  {
    id: 'c1',
    participant: { id: 'u1', name: 'Ahmed Hassan',   avatar: 'AH', role: 'Seller', online: true  },
    auctionTitle: 'Vintage Leica M6 Film Camera',
    auctionGradient: 'from-blue-600 to-cyan-400',
    unread: 3,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hi! I noticed you\'re interested in the Leica M6.',          time: '10:02 AM' },
      { id: 'm2', senderId: MY_ID, text: 'Yes! Is there any flexibility on the starting price?',       time: '10:05 AM' },
      { id: 'm3', senderId: 'u1', text: 'The starting price is fixed, but I can offer free shipping.', time: '10:07 AM' },
      { id: 'm4', senderId: MY_ID, text: 'That sounds fair. I\'ll place a bid shortly.',               time: '10:09 AM' },
      { id: 'm5', senderId: 'u1', text: 'Great! Let me know if you have any questions about condition.', time: '10:11 AM' },
    ],
  },
  {
    id: 'c2',
    participant: { id: 'u2', name: 'Sara Malik',     avatar: 'SM', role: 'Seller', online: true  },
    auctionTitle: 'Air Jordan 1 Retro High OG',
    auctionGradient: 'from-orange-500 to-yellow-300',
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'u2', text: 'These are 100% authentic with original box and receipt.', time: '9:30 AM' },
      { id: 'm2', senderId: MY_ID, text: 'Can you share more photos of the soles?',               time: '9:33 AM' },
      { id: 'm3', senderId: 'u2', text: 'Sure, uploading now. The soles are in perfect condition.', time: '9:35 AM' },
      { id: 'm4', senderId: 'u2', text: 'Ending soon — just a heads up!',                         time: '9:50 AM' },
    ],
  },
  {
    id: 'c3',
    participant: { id: 'u3', name: 'Omar Farooq',    avatar: 'OF', role: 'Seller', online: false },
    auctionTitle: 'Rolex Submariner Date 2023',
    auctionGradient: 'from-primary-700 to-secondary-600',
    unread: 0,
    messages: [
      { id: 'm1', senderId: MY_ID, text: 'Is the watch still under warranty?',                    time: 'Yesterday' },
      { id: 'm2', senderId: 'u3', text: 'Yes, warranty card and box included. Purchased Dec 2023.', time: 'Yesterday' },
      { id: 'm3', senderId: MY_ID, text: 'Perfect. I\'ll keep watching the auction.',              time: 'Yesterday' },
    ],
  },
  {
    id: 'c4',
    participant: { id: 'u4', name: 'Bilal Chaudhry', avatar: 'BC', role: 'Buyer',  online: false },
    auctionTitle: 'Gibson Les Paul Standard',
    auctionGradient: 'from-rose-600 to-fuchsia-400',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u4', text: 'Congratulations on winning the auction!',                time: 'Mon' },
      { id: 'm2', senderId: MY_ID, text: 'Thank you! When can I expect shipping?',                 time: 'Mon' },
      { id: 'm3', senderId: 'u4', text: 'I\'ll dispatch by Wednesday. Tracking number to follow.', time: 'Mon' },
    ],
  },
  {
    id: 'c5',
    participant: { id: 'u5', name: 'Fatima Qureshi', avatar: 'FQ', role: 'Seller', online: true  },
    auctionTitle: 'Apple Mac Pro M2 Ultra',
    auctionGradient: 'from-slate-700 to-gray-500',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'u5', text: 'The Mac Pro has been factory reset and is ready to ship.', time: '8:15 AM' },
      { id: 'm2', senderId: MY_ID, text: 'Does it include the Magic Mouse and keyboard?',           time: '8:18 AM' },
      { id: 'm3', senderId: 'u5', text: 'Yes, full original accessories included.',                 time: '8:20 AM' },
      { id: 'm4', senderId: 'u5', text: 'Let me know if you\'d like the spec sheet.',               time: '8:45 AM' },
    ],
  },
  {
    id: 'c6',
    participant: { id: 'u6', name: 'Zara Ahmed',     avatar: 'ZA', role: 'Seller', online: true  },
    auctionTitle: 'Banksy Flower Thrower Print',
    auctionGradient: 'from-emerald-600 to-cyan-400',
    unread: 0,
    messages: [
      { id: 'm1', senderId: MY_ID, text: 'Does the print come with a Pest Control certificate?', time: 'Sun' },
      { id: 'm2', senderId: 'u6', text: 'Yes, full CoA included. Authenticated by Pest Control.', time: 'Sun' },
      { id: 'm3', senderId: MY_ID, text: 'Amazing. This is exactly what I was looking for.',     time: 'Sun' },
    ],
  },
  {
    id: 'c7',
    participant: { id: 'u7', name: 'Hassan Raza',    avatar: 'HR', role: 'Seller', online: false },
    auctionTitle: 'Patek Philippe Nautilus 5711',
    auctionGradient: 'from-amber-700 to-amber-400',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u7', text: 'Auction starts in two days. Pre-register your interest.', time: 'Sat' },
      { id: 'm2', senderId: MY_ID, text: 'Already on my watchlist. Full set with papers?',         time: 'Sat' },
      { id: 'm3', senderId: 'u7', text: 'Full set, 2022, never sized.',                           time: 'Sat' },
    ],
  },
  {
    id: 'c8',
    participant: { id: 'u8', name: 'Nadia Shah',     avatar: 'NS', role: 'Buyer',  online: true  },
    auctionTitle: 'Canon EOS R5 Body',
    auctionGradient: 'from-red-600 to-rose-400',
    unread: 4,
    messages: [
      { id: 'm1', senderId: 'u8', text: 'Is there a Buy It Now option?',              time: '7:00 AM' },
      { id: 'm2', senderId: MY_ID, text: 'No BIN, auction only I\'m afraid.',          time: '7:03 AM' },
      { id: 'm3', senderId: 'u8', text: 'Alright, I\'ll bid at opening.',             time: '7:05 AM' },
      { id: 'm4', senderId: 'u8', text: 'What\'s the shutter count?',                 time: '7:20 AM' },
      { id: 'm5', senderId: 'u8', text: 'Can you check before auction ends?',         time: '7:35 AM' },
    ],
  },
  {
    id: 'c9',
    participant: { id: 'u9', name: 'Kamran Ali',     avatar: 'KA', role: 'Buyer',  online: false },
    auctionTitle: 'Supreme Box Logo Hoodie',
    auctionGradient: 'from-red-500 to-pink-400',
    unread: 0,
    messages: [
      { id: 'm1', senderId: MY_ID, text: 'Size Large available?',                              time: 'Fri' },
      { id: 'm2', senderId: 'u9', text: 'Yes, Large. Worn once, no flaws.',                    time: 'Fri' },
      { id: 'm3', senderId: MY_ID, text: 'I\'ll place a bid now.',                             time: 'Fri' },
    ],
  },
  {
    id: 'c10',
    participant: { id: 'u10', name: 'Amina Siddiqui', avatar: 'AS', role: 'Seller', online: false },
    auctionTitle: 'Basquiat Lithograph',
    auctionGradient: 'from-yellow-500 to-red-400',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u10', text: 'Auction has ended. Hope you enjoyed bidding!',  time: 'Thu' },
      { id: 'm2', senderId: MY_ID,  text: 'Didn\'t win this time but loved the piece.',   time: 'Thu' },
      { id: 'm3', senderId: 'u10', text: 'I have a similar Basquiat piece coming soon.',  time: 'Thu' },
    ],
  },
];

export default CONVERSATIONS;
