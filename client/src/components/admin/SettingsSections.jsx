import { useState } from 'react';
import AvatarUploader from '../shared/AvatarUploader';
import { useAuth } from '../../context/AuthContext';
import { updateProfile as apiUpdateProfile } from '../../api/users';

const STORAGE_KEY = 'bs_admin_settings';

function loadSaved(key, defaults) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
}

function useSectionState(key, defaults) {
  const [form, setForm] = useState(() => loadSaved(key, defaults));
  const [saved, setSaved] = useState('');
  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const toggle = (k) => setForm((p) => ({ ...p, [k]: !p[k] }));
  function handleSave() {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(form));
    setSaved('Saved!');
    setTimeout(() => setSaved(''), 2500);
  }
  return { form, set, toggle, handleSave, saved };
}
import {
  GENERAL_DEFAULTS, MARKETPLACE_DEFAULTS, AUCTION_DEFAULTS,
  USER_DEFAULTS, NOTIFICATION_DEFAULTS, SECURITY_DEFAULTS,
  APPEARANCE_DEFAULTS, SYSTEM_INFO,
  TIMEZONE_OPTIONS, CURRENCY_OPTIONS, THEME_OPTIONS, ACCENT_OPTIONS,
} from '../../data/admin/ADMIN_SETTINGS_DATA';

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionCard({ title, description, icon, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900/30 text-xl">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-3">{children}</div>
    </div>
  );
}

function FieldRow({ label, description, children }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border-subtle py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ id, checked, onChange }) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]',
        checked ? 'bg-primary-600' : 'bg-navy-100 hover:bg-navy-300',
      ].join(' ')}>
      <span className={['inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-card transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1'].join(' ')} />
    </button>
  );
}

const inputCls = 'h-10 rounded-xl border border-border bg-bg-card px-3 text-sm text-text-primary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20';

function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={[inputCls, 'appearance-none cursor-pointer pr-8'].join(' ')}>
        {options.map(({ value: v, label }) => <option key={v} value={v}>{label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={[inputCls, 'w-56'].join(' ')} />
  );
}

function NumberInput({ value, onChange, min, max }) {
  return (
    <input type="number" value={value} min={min} max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className={[inputCls, 'w-24 text-center'].join(' ')} />
  );
}

function SaveButton({ onClick, saved }) {
  return (
    <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4 -mx-0">
      <span className="text-sm font-medium text-success">{saved}</span>
      <button type="button" onClick={onClick}
        className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-primary-700 focus-visible:outline-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
        </svg>
        Save Changes
      </button>
    </div>
  );
}

function InfoBadge({ status }) {
  const ok = status === 'Connected' || status === 'Operational';
  return (
    <span className={['rounded-full px-3 py-1 text-xs font-semibold', ok ? 'bg-success-100 text-success' : 'bg-danger-100 text-danger'].join(' ')}>
      {status}
    </span>
  );
}

// ─── Section panels ───────────────────────────────────────────────────────────

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection() {
  const { user } = useAuth();
  const [name,     setName]     = useState(user?.name     ?? '');
  const [bio,      setBio]      = useState(user?.bio      ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState('');
  const [err,      setErr]      = useState('');

  async function handleSave() {
    setSaving(true); setSaved(''); setErr('');
    try {
      await apiUpdateProfile({ name: name.trim(), bio: bio.trim(), location: location.trim() });
      setSaved('Saved!');
      setTimeout(() => setSaved(''), 3000);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  }

  const inputCls = 'h-10 w-full rounded-xl border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none transition-all focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20';

  return (
    <SectionCard title="My Profile" description="Update your admin profile photo and personal details." icon="👤">
      {/* Avatar uploader */}
      <div className="border-b border-border-subtle py-5">
        <p className="mb-3 text-sm font-semibold text-text-secondary">Profile Photo</p>
        <AvatarUploader size="md" />
      </div>

      {/* Name */}
      <FieldRow label="Display Name" description="Your name shown in the admin panel.">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          className={[inputCls, 'w-56'].join(' ')} placeholder="Admin name"/>
      </FieldRow>

      {/* Bio */}
      <FieldRow label="Bio" description="Short description about yourself (optional).">
        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)}
          className={[inputCls, 'w-56'].join(' ')} placeholder="Short bio"/>
      </FieldRow>

      {/* Location */}
      <FieldRow label="Location" description="Your city or region (optional).">
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
          className={[inputCls, 'w-56'].join(' ')} placeholder="City, Country"/>
      </FieldRow>

      {err && <p className="px-0 pb-2 text-xs text-danger">{err}</p>}
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function GeneralSection() {
  const { form, set, handleSave, saved } = useSectionState('general', GENERAL_DEFAULTS);
  return (
    <SectionCard title="General" description="Core platform identity and locale settings." icon="⚙️">
      <FieldRow label="Platform Name" description="Displayed in the browser tab and emails.">
        <TextInput value={form.platformName} onChange={set('platformName')} />
      </FieldRow>
      <FieldRow label="Support Email" description="Shown on error pages and transactional emails.">
        <TextInput value={form.supportEmail} onChange={set('supportEmail')} />
      </FieldRow>
      <FieldRow label="Time Zone" description="Default timezone for auction scheduling.">
        <SelectInput value={form.timezone} onChange={set('timezone')} options={TIMEZONE_OPTIONS} />
      </FieldRow>
      <FieldRow label="Currency" description="Primary currency for all auction bids and prices.">
        <SelectInput value={form.currency} onChange={set('currency')} options={CURRENCY_OPTIONS} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function MarketplaceSection() {
  const { form, toggle, handleSave, saved, set } = useSectionState('marketplace', MARKETPLACE_DEFAULTS);
  return (
    <SectionCard title="Marketplace" description="Control seller onboarding and featured content." icon="🏪">
      <FieldRow label="Allow New Seller Registration" description="Permit new sellers to sign up on the platform.">
        <Toggle id="mp-sellers" checked={form.allowSellerRegistration} onChange={() => toggle('allowSellerRegistration')} />
      </FieldRow>
      <FieldRow label="Auto Approve Sellers" description="Skip manual review for new seller accounts.">
        <Toggle id="mp-auto" checked={form.autoApproveSellers} onChange={() => toggle('autoApproveSellers')} />
      </FieldRow>
      <FieldRow label="Featured Auctions Limit" description="Max auctions shown in the featured section.">
        <NumberInput value={form.featuredAuctionsLimit} onChange={set('featuredAuctionsLimit')} min={1} max={24} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function AuctionsSection() {
  const { form, toggle, handleSave, saved, set } = useSectionState('auctions', AUCTION_DEFAULTS);
  return (
    <SectionCard title="Auctions" description="Configure global auction rules and constraints." icon="🔨">
      <FieldRow label="Maximum Auction Duration (days)" description="Sellers cannot list auctions longer than this.">
        <NumberInput value={form.maxAuctionDays} onChange={set('maxAuctionDays')} min={1} max={90} />
      </FieldRow>
      <FieldRow label="Minimum Bid Increment ($)" description="The smallest amount a new bid can exceed the last.">
        <NumberInput value={form.minBidIncrement} onChange={set('minBidIncrement')} min={1} max={1000} />
      </FieldRow>
      <FieldRow label="Auto Close Auctions" description="Automatically end auctions when the time expires.">
        <Toggle id="auc-autoclose" checked={form.autoCloseAuctions} onChange={() => toggle('autoCloseAuctions')} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function UsersSection() {
  const { form, toggle, handleSave, saved } = useSectionState('users', USER_DEFAULTS);
  return (
    <SectionCard title="Users" description="Manage user registration and safety policies." icon="👥">
      <FieldRow label="Require Email Verification" description="New accounts must verify their email before bidding.">
        <Toggle id="usr-email" checked={form.requireEmailVerification} onChange={() => toggle('requireEmailVerification')} />
      </FieldRow>
      <FieldRow label="Enable User Reports" description="Allow users to report suspicious activity and accounts.">
        <Toggle id="usr-reports" checked={form.enableUserReports} onChange={() => toggle('enableUserReports')} />
      </FieldRow>
      <FieldRow label="Allow Account Deletion" description="Permit users to permanently delete their own accounts.">
        <Toggle id="usr-delete" checked={form.allowAccountDeletion} onChange={() => toggle('allowAccountDeletion')} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function NotificationsSection() {
  const { form, toggle, handleSave, saved } = useSectionState('notifications', NOTIFICATION_DEFAULTS);
  return (
    <SectionCard title="Notifications" description="Control platform-wide notification channels." icon="🔔">
      <FieldRow label="Email Notifications" description="Send transactional and activity emails to users.">
        <Toggle id="notif-email" checked={form.emailNotifications} onChange={() => toggle('emailNotifications')} />
      </FieldRow>
      <FieldRow label="Push Notifications" description="Enable browser push alerts for real-time events.">
        <Toggle id="notif-push" checked={form.pushNotifications} onChange={() => toggle('pushNotifications')} />
      </FieldRow>
      <FieldRow label="Weekly Admin Summary" description="Send a weekly activity digest to admin accounts.">
        <Toggle id="notif-weekly" checked={form.weeklyAdminSummary} onChange={() => toggle('weeklyAdminSummary')} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function SecuritySection() {
  const { form, toggle, handleSave, saved, set } = useSectionState('security', SECURITY_DEFAULTS);
  return (
    <SectionCard title="Security" description="Harden authentication and session policies." icon="🔒">
      <FieldRow label="Two-Factor Authentication" description="Require 2FA for all admin accounts.">
        <Toggle id="sec-2fa" checked={form.twoFactorAuth} onChange={() => toggle('twoFactorAuth')} />
      </FieldRow>
      <FieldRow label="Session Timeout (minutes)" description="Auto-logout after this many minutes of inactivity.">
        <NumberInput value={form.sessionTimeoutMins} onChange={set('sessionTimeoutMins')} min={5} max={1440} />
      </FieldRow>
      <FieldRow label="Max Login Attempts" description="Lock account after this many failed login attempts.">
        <NumberInput value={form.maxLoginAttempts} onChange={set('maxLoginAttempts')} min={1} max={20} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function AppearanceSection() {
  const { form, toggle, handleSave, saved, set } = useSectionState('appearance', APPEARANCE_DEFAULTS);
  return (
    <SectionCard title="Appearance" description="Customise the admin panel's look and feel." icon="🎨">
      <FieldRow label="Theme" description="Light, dark, or system default.">
        <SelectInput value={form.theme} onChange={set('theme')} options={THEME_OPTIONS} />
      </FieldRow>
      <FieldRow label="Compact Mode" description="Reduce spacing for higher information density.">
        <Toggle id="app-compact" checked={form.compactMode} onChange={() => toggle('compactMode')} />
      </FieldRow>
      <FieldRow label="Accent Color" description="Primary interactive color throughout the admin panel.">
        <SelectInput value={form.accentColor} onChange={set('accentColor')} options={ACCENT_OPTIONS} />
      </FieldRow>
      <SaveButton onClick={handleSave} saved={saved} />
    </SectionCard>
  );
}

function SystemSection() {
  const { version, lastBackup, dbStatus, serverStatus, uptime, nodeVersion } = SYSTEM_INFO;
  const rows = [
    { label: 'Platform Version',  value: version,       badge: false },
    { label: 'Node.js Version',   value: nodeVersion,    badge: false },
    { label: 'Last Backup',       value: lastBackup,     badge: false },
    { label: 'System Uptime',     value: uptime,         badge: false },
    { label: 'Database Status',   value: dbStatus,       badge: true  },
    { label: 'Server Status',     value: serverStatus,   badge: true  },
  ];
  return (
    <SectionCard title="System" description="Read-only platform diagnostics and infrastructure info." icon="🖥️">
      {rows.map(({ label, value, badge }) => (
        <FieldRow key={label} label={label}>
          {badge
            ? <InfoBadge status={value} />
            : <span className="rounded-lg shimmer-bg motion-safe:animate-shimmer px-3 py-1 font-mono text-xs font-semibold text-text-secondary">{value}</span>
          }
        </FieldRow>
      ))}
    </SectionCard>
  );
}

// ─── SettingsSections ─────────────────────────────────────────────────────────

/**
 * Renders the settings panel for the given active category.
 *
 * @param {string} active – category id
 */
function SettingsSections({ active }) {
  const map = {
    profile:       <ProfileSection       />,
    general:       <GeneralSection       />,
    marketplace:   <MarketplaceSection   />,
    auctions:      <AuctionsSection      />,
    users:         <UsersSection         />,
    notifications: <NotificationsSection />,
    security:      <SecuritySection      />,
    appearance:    <AppearanceSection    />,
    system:        <SystemSection        />,
  };
  return map[active] ?? <ProfileSection />;
}

export default SettingsSections;
