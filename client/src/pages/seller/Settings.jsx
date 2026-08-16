import PageHeader              from '../../components/layout/PageHeader';
import AccountSettings        from '../../components/seller/AccountSettings';
import NotificationSettings   from '../../components/seller/NotificationSettings';
import SecuritySettings       from '../../components/seller/SecuritySettings';
import AppearanceSettings     from '../../components/seller/AppearanceSettings';
import DangerZone             from '../../components/seller/DangerZone';

// ─── Seller Settings page ─────────────────────────────────────────────────────

function SellerSettings() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Settings"
        subtitle="Manage your account, preferences and security."
        breadcrumbs={[
          { label: 'Home',             href: '/'                 },
          { label: 'Seller Dashboard', href: '/seller/dashboard' },
          { label: 'Settings'                                    },
        ]}
        actions={
          <a
            href="/seller/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 no-underline"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            View Profile
          </a>
        }
      />

      {/* ── Account ── */}
      <AccountSettings />

      {/* ── Notifications ── */}
      <NotificationSettings />

      {/* ── Security ── */}
      <SecuritySettings />

      {/* ── Appearance ── */}
      <AppearanceSettings />

      {/* ── Danger Zone ── */}
      <DangerZone />

    </div>
  );
}

export default SellerSettings;
