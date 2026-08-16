import { useEffect, useState } from 'react';
import PageHeader      from '../../components/layout/PageHeader';
import ProfileCard     from '../../components/profile/ProfileCard';
import ProfileStats    from '../../components/profile/ProfileStats';
import ProfileTabs     from '../../components/profile/ProfileTabs';
import ActivityTimeline from '../../components/profile/ActivityTimeline';
import { useAuth }     from '../../context/AuthContext';
import { listMyBids }  from '../../api/bids';
import { getWatchlist } from '../../api/watchlist';
import { getProfile }  from '../../api/users';
import { listMyAuctions } from '../../api/auctions';
import { currency, fmtPKR } from '../../utils/currency';

// ─── Dummy profile data (fallback only when user not loaded) ──────────────────

const USER_FALLBACK = {
  name:           'BidStream User',
  username:       'user',
  email:          '',
  phone:          '—',
  location:       '—',
  bio:            'BidStream user profile.',
  role:           'Buyer',
  memberSince:    '—',
  avatarInitials: 'BS',
  avatarGradient: 'from-secondary-600 to-primary-700',
  online:         true,
};

// ─── Activity icons (inline so ActivityTimeline stays presentational) ─────────

const BidIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const WonIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const OutbidIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const WatchIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const MsgIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ACTIVITIES = [];  // populated from real API in ActivityPanel below

// ─── Achievements data ────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  {
    id: 'ach1',
    title:       'Top Bidder',
    description: 'Placed 200+ bids on the platform',
    earned:      true,
    gradient:    'from-secondary-600 to-blue-400',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'ach2',
    title:       'Fast Responder',
    description: 'Replied to messages within 1 hour on average',
    earned:      true,
    gradient:    'from-emerald-600 to-teal-400',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'ach3',
    title:       'Verified User',
    description: 'Identity verified by BidStream',
    earned:      true,
    gradient:    'from-primary-700 to-secondary-600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: 'ach4',
    title:       'Trusted Buyer',
    description: 'Completed 25+ successful purchases',
    earned:      true,
    gradient:    'from-accent-600 to-yellow-400',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'ach5',
    title:       'High Roller',
    description: 'Placed a bid over $10,000',
    earned:      true,
    gradient:    'from-violet-600 to-indigo-400',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'ach6',
    title:       'Auction Champion',
    description: 'Win 50 auctions to unlock',
    earned:      false,
    gradient:    'from-gray-400 to-gray-300',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 21h8" /><path d="M12 17v4" />
        <path d="M7 4H4a2 2 0 0 0-2 2v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V6a2 2 0 0 0-2-2h-3" />
        <path d="M20 4h-3v6a6 6 0 0 1-6 6" />
      </svg>
    ),
  },
];

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 21h8" /><path d="M12 17v4" />
        <path d="M7 4H4a2 2 0 0 0-2 2v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V6a2 2 0 0 0-2-2h-3" />
        <path d="M20 4h-3v6a6 6 0 0 1-6 6" />
      </svg>
    ),
  },
];

// ─── InfoRow helper ───────────────────────────────────────────────────────────

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-surface text-text-muted">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function OverviewPanel({ user }) {
  const infoRows = [
    {
      label: 'Full Name',
      value: user.name,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
      label: 'Email Address',
      value: user.email,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
    {
      label: 'Phone Number',
      value: user.phone,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.1 5.1l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    },
    {
      label: 'Location',
      value: user.location,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    },
    {
      label: 'Member Since',
      value: user.memberSince,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Personal info card */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-5 py-3.5">
          <h3 className="text-sm font-bold text-text-primary">Personal Information</h3>
          <p className="mt-0.5 text-xs text-text-muted">Your account details</p>
        </div>
        <div className="px-5 py-1">
          {infoRows.map(({ label, value, icon }) => (
            <InfoRow key={label} label={label} value={value} icon={icon} />
          ))}
        </div>
      </div>

      {/* Bio card */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
          <h3 className="mb-2.5 text-sm font-bold text-text-primary">About</h3>
          <p className="text-sm leading-relaxed text-text-muted">{user.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Photography', 'Luxury Watches', 'Contemporary Art', 'Vintage Audio'].map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Account status */}
        <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-text-primary">Account Status</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Account', status: 'Verified',  color: 'text-success',     bg: 'bg-success/10'     },
              { label: 'Email',   status: 'Confirmed', color: 'text-success',     bg: 'bg-success/10'     },
              { label: 'Phone',   status: 'Verified',  color: 'text-success',     bg: 'bg-success/10'     },
              { label: 'Role',    status: user.role,   color: 'text-primary-300', bg: 'bg-primary-600/12' },
            ].map(({ label, status, color, bg }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{label}</span>
                <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', bg, color].join(' ')}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const role = user?.role;

        if (role === 'seller') {
          // Sellers don't place bids — show their auction activity instead
          const res = await listMyAuctions({ limit: 10, sort: 'newest' });
          if (!active) return;
          const mapped = (res.auctions || []).map((a) => ({
            id:           a._id,
            type:         a.status === 'sold' ? 'won' : 'bid',
            icon:         a.status === 'sold' ? WonIcon : BidIcon,
            title:        a.status === 'sold' ? 'Auction sold' : `Auction ${a.status}`,
            description:  a.status === 'sold'
              ? `"${a.title}" sold for ${currency(a.currentBid || 0)} · ≈ ${fmtPKR(a.currentBid || 0)}`
              : `"${a.title}" is ${a.status}`,
            auctionTitle: a.title,
            time:         a.updatedAt
              ? (() => {
                  const diff = Date.now() - new Date(a.updatedAt);
                  const m = Math.floor(diff / 60_000);
                  if (m < 1) return 'Just now';
                  if (m < 60) return `${m}m ago`;
                  const h = Math.floor(m / 60);
                  if (h < 24) return `${h}h ago`;
                  return `${Math.floor(h / 24)}d ago`;
                })()
              : '—',
          }));
          setActivities(mapped);
        } else {
          // Buyers — show bid history
          const res = await listMyBids({ limit: 10 });
          if (!active) return;
          const mapped = (res.bids || []).map((bid) => ({
            id:           bid._id,
            type:         bid.status === 'won' ? 'won' : bid.status === 'outbid' ? 'outbid' : 'bid',
            icon:         bid.status === 'won' ? WonIcon : bid.status === 'outbid' ? OutbidIcon : BidIcon,
            title:        bid.status === 'won' ? 'Auction won' : bid.status === 'outbid' ? 'Outbid' : 'Bid placed',
            description:  bid.status === 'won'
              ? `Won with bid of ${currency(bid.amount || 0)} · ≈ ${fmtPKR(bid.amount || 0)}`
              : bid.status === 'outbid'
              ? `Someone bid higher on ${bid.auction?.title || 'this auction'}`
              : `You placed a bid of ${currency(bid.amount || 0)} · ≈ ${fmtPKR(bid.amount || 0)}`,
            auctionTitle: bid.auction?.title || '—',
            time:         bid.createdAt
              ? (() => {
                  const diff = Date.now() - new Date(bid.createdAt);
                  const m = Math.floor(diff / 60_000);
                  if (m < 1) return 'Just now';
                  if (m < 60) return `${m}m ago`;
                  const h = Math.floor(m / 60);
                  if (h < 24) return `${h}h ago`;
                  return `${Math.floor(h / 24)}d ago`;
                })()
              : '—',
          }));
          setActivities(mapped);
        }
      } catch {
        // silent
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [user?.role]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card p-6 shadow-card space-y-3">
        {[1,2,3,4].map((i) => <div key={i} className="h-10 rounded-lg shimmer-bg motion-safe:animate-shimmer" />)}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card py-16 shadow-card text-center">
        <p className="text-sm text-text-muted">No activity yet</p>
        <p className="mt-1 text-xs text-text-muted">Your bid history will appear here</p>
      </div>
    );
  }

  return <ActivityTimeline activities={activities} />;
}

function AchievementsPanel() {
  const earned  = ACHIEVEMENTS.filter((a) => a.earned);
  const locked  = ACHIEVEMENTS.filter((a) => !a.earned);

  return (
    <div className="flex flex-col gap-5">
      {/* Earned */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Your Badges</h3>
              <p className="mt-0.5 text-xs text-text-muted">Achievements unlocked</p>
            </div>
            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-bold text-success">
              {earned.length} / {ACHIEVEMENTS.length} earned
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={[
                'flex items-start gap-4 rounded-2xl border p-4 transition-all duration-150',
                ach.earned
                  ? 'border-border bg-bg-card hover:shadow-dropdown hover:-translate-y-0.5'
                  : 'border-dashed border-border bg-bg-surface opacity-50',
              ].join(' ')}
            >
              {/* Icon */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${ach.gradient} text-white shadow-card`}>
                {ach.icon}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-text-primary">{ach.title}</p>
                  {ach.earned && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{ach.description}</p>
                {!ach.earned && (
                  <span className="mt-1.5 inline-block rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user: authUser } = useAuth();

  // Fresh profile data from backend (always up to date)
  const [freshUser, setFreshUser] = useState(null);
  const [stats, setStats] = useState({ auctionsJoined: 0, auctionsWon: 0, watchlistItems: 0, messages: 0 });

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        // 1. Always fetch fresh profile from backend
        const profileRes = await getProfile();
        const serverUser = profileRes.user || profileRes;
        if (active) setFreshUser(serverUser);

        const role = serverUser?.role || authUser?.role;

        // 2. Load stats based on role
        if (role === 'buyer') {
          const [bidsRes, watchlistRes] = await Promise.all([
            listMyBids({ limit: 100 }),
            getWatchlist(),
          ]);
          if (!active) return;
          const bids = bidsRes.bids || [];
          setStats({
            auctionsJoined: bids.length,
            auctionsWon:    bids.filter((b) => b.status === 'won').length,
            watchlistItems: Array.isArray(watchlistRes.auctions)
              ? watchlistRes.auctions.length
              : (watchlistRes.watchlist?.length ?? 0),
            messages: 0,
          });
        } else if (role === 'seller') {
          const auctionsRes = await listMyAuctions({ limit: 100 });
          if (!active) return;
          const auctions = auctionsRes.auctions || [];
          setStats({
            auctionsJoined: auctions.length,
            auctionsWon:    auctions.filter((a) => a.status === 'sold').length,
            watchlistItems: 0,
            messages:       0,
          });
        }
      } catch {
        // Keep zeroes silently — auth user data still shown
      }
    }

    loadAll();
    return () => { active = false; };
  }, []);

  // Use freshUser from API, fallback to authUser from context
  const src = freshUser || authUser;

  const profileUser = src ? {
    name:           src.name,
    username:       src.username || src.email?.split('@')[0] || 'user',
    email:          src.email,
    phone:          src.phone    || '—',
    location:       src.location || '—',
    bio:            src.bio      || 'BidStream user.',
    role:           src.role === 'seller' ? 'Seller' : src.role === 'admin' ? 'Admin' : 'Buyer',
    memberSince:    src.createdAt
      ? new Date(src.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '—',
    avatarInitials: (src.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
    avatarGradient: 'from-secondary-600 to-primary-700',
    online: true,
  } : USER_FALLBACK;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ── */}
      <PageHeader
        title="Profile"
        subtitle="View and manage your profile information."
        breadcrumbs={[
          { label: 'Home',      href: '/'          },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile'   },
        ]}
      />

      {/* ── Profile hero card ── */}
      <ProfileCard user={profileUser} />

      {/* ── Stats row ── */}
      <ProfileStats stats={stats} role={profileUser.role} />

      {/* ── Tabs ── */}
      <ProfileTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* ── Tab content ── */}
      {activeTab === 'overview'      && <OverviewPanel      user={profileUser} />}
      {activeTab === 'activity'      && <ActivityPanel      />}
      {activeTab === 'achievements'  && <AchievementsPanel  />}

    </div>
  );
}

export default Profile;
