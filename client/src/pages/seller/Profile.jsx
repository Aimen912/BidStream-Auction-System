import PageHeader              from '../../components/layout/PageHeader';
import SellerProfileCard       from '../../components/seller/SellerProfileCard';
import SellerStatistics        from '../../components/seller/SellerStatistics';
import SellerBusinessInfo      from '../../components/seller/SellerBusinessInfo';
import SellerVerificationCard  from '../../components/seller/SellerVerificationCard';
import SellerActivityTimeline  from '../../components/seller/SellerActivityTimeline';

// ─── Seller Profile page ──────────────────────────────────────────────────────

function SellerProfile() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Profile"
        subtitle="Manage your seller profile and business information."
        breadcrumbs={[
          { label: 'Home',             href: '/'                 },
          { label: 'Seller Dashboard', href: '/seller/dashboard' },
          { label: 'Profile'                                     },
        ]}
        actions={
          <a
            href="/seller/settings"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </a>
        }
      />

      {/* ── Top: Profile hero card ── */}
      <SellerProfileCard />

      {/* ── Statistics ── */}
      <SellerStatistics />

      {/* ── Middle: Business info + Verification (two-column on xl) ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
        <SellerBusinessInfo />
        <SellerVerificationCard />
      </div>

      {/* ── Bottom: Activity timeline ── */}
      <SellerActivityTimeline />

    </div>
  );
}

export default SellerProfile;
