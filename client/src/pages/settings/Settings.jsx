import { useState } from 'react';

import PageHeader      from '../../components/layout/PageHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import ToggleSwitch    from '../../components/settings/ToggleSwitch';
import DangerZone      from '../../components/settings/DangerZone';
import { useAuth }     from '../../context/AuthContext';
import { updateProfile, updatePhone, changePassword, uploadAvatar } from '../../api/users';

// ─── Section icons ─────────────────────────────────────────────────────────────

const AccountIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const NotifIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const AppearanceIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);
const PrivacyIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const SecurityIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Shared helpers ────────────────────────────────────────────────────────────

const inputCls = [
  'w-full rounded-xl border border-border bg-bg-card px-4 py-2.5',
  'text-sm text-text-primary placeholder:text-text-muted outline-none',
  'transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
].join(' ');

function FieldRow({ label, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-subtle py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:max-w-xs">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      </div>
      <div className="shrink-0 sm:min-w-[260px]">{children}</div>
    </div>
  );
}

function SelectField({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// Inline editable field — shows value + Edit button, expands to input on click
function InlineEditField({ value, onSave, type = 'text', placeholder = '' }) {
  const [editing, setEditing] = useState(false);
  const [input,   setInput]   = useState(value || '');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  async function handleSave() {
    if (!input.trim() && type !== 'tel') {
      setError('This field cannot be empty');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await onSave(input.trim());
      setSuccess('Saved');
      setEditing(false);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-text-secondary">{value || '—'}</span>
        {success && <span className="text-xs font-medium text-success">{success}</span>}
        <button type="button" onClick={() => { setInput(value || ''); setEditing(true); setError(''); }}
          className="rounded-xl border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input type={type} value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
          className={inputCls}
          autoFocus
        />
        <button type="button" onClick={handleSave} disabled={saving}
          className="shrink-0 rounded-xl bg-secondary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-secondary-500 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={() => setEditing(false)}
          className="shrink-0 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
          Cancel
        </button>
      </div>
      {error   && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

// ─── Change Password inline section ───────────────────────────────────────────

function ChangePasswordSection() {
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSave() {
    if (!form.currentPassword) { setError('Current password is required'); return; }
    if (form.newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (form.newPassword !== form.confirmNewPassword) { setError('Passwords do not match'); return; }

    setSaving(true);
    setError('');
    try {
      await changePassword({
        currentPassword:    form.currentPassword,
        newPassword:        form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });
      setSuccess('Password changed successfully!');
      setOpen(false);
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <FieldRow label="Password" description="Keep your account secure with a strong password.">
      {!open ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">••••••••</span>
          {success && <span className="text-xs font-medium text-success">{success}</span>}
          <button type="button" onClick={() => { setOpen(true); setError(''); }}
            className="rounded-xl border border-primary-900/30 bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors duration-150 hover:bg-primary-900/30 focus-visible:outline-none">
            Change Password
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input type="password" value={form.currentPassword} onChange={set('currentPassword')}
            placeholder="Current password" className={inputCls} />
          <input type="password" value={form.newPassword} onChange={set('newPassword')}
            placeholder="New password (min 6 chars)" className={inputCls} />
          <input type="password" value={form.confirmNewPassword} onChange={set('confirmNewPassword')}
            placeholder="Confirm new password" className={inputCls}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }} />
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-500 disabled:opacity-60">
              {saving ? 'Saving…' : 'Update Password'}
            </button>
            <button type="button" onClick={() => { setOpen(false); setError(''); }}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-surface">
              Cancel
            </button>
          </div>
        </div>
      )}
    </FieldRow>
  );
}

// ─── Settings page ─────────────────────────────────────────────────────────────

function Settings() {
  const { user, reloadUser } = useAuth();

  const displayName    = user?.name  || '—';
  const displayEmail   = user?.email || '—';
  const displayPhone   = user?.phone || '—';
  const displayRole    = user?.role  ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : '—';
  const avatarInitials = (user?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  // ── Save helpers — call API then reload user in context ──────────────────

  async function saveName(name) {
    await updateProfile({ name });
    await reloadUser();
  }

  async function savePhone(phone) {
    await updatePhone(phone || null);
    await reloadUser();
  }

  async function saveBio(bio) {
    await updateProfile({ bio });
    await reloadUser();
  }

  async function saveLocation(location) {
    await updateProfile({ location });
    await reloadUser();
  }

  // ── Notification toggles ─────────────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState({
    email:      true,  sms:       false,
    push:       true,  marketing: false,
    outbid:     true,  auctionWon: true,
    endingSoon: true,  newMessage: true,
    payments:   true,  system:    false,
  });
  const setNotif = (key) => (val) => setNotifSettings((p) => ({ ...p, [key]: val }));

  // ── Privacy toggles ──────────────────────────────────────────────────────
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true, activityPublic: false,
    showOnlineStatus: true, showBidHistory: false,
  });
  const setPrivacy = (key) => (val) => setPrivacySettings((p) => ({ ...p, [key]: val }));

  // ── Security ─────────────────────────────────────────────────────────────
  const [twoFA, setTwoFA] = useState(false);

  // ── Appearance ───────────────────────────────────────────────────────────
  const [theme,    setTheme]    = useState('system');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Karachi');

  return (
    <div className="flex flex-col gap-6">

      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and configuration."
        breadcrumbs={[
          { label: 'Home',      href: '/'          },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings'   },
        ]}
      />

      {/* ── Account ── */}
      <SettingsSection title="Account" description="Manage your personal information." icon={AccountIcon}>

        {/* Avatar */}
        <div className="flex items-center gap-5 border-b border-border-subtle py-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-600 to-primary-700 text-xl font-bold text-white shadow-card">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-2xl object-cover"/>
              : avatarInitials
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary">{displayName}</p>
            <p className="text-xs text-text-muted">{displayEmail} · {displayRole}</p>
          </div>
        </div>

        {/* Full Name */}
        <FieldRow label="Full Name" description="Your display name on BidStream.">
          <InlineEditField
            value={displayName}
            onSave={saveName}
            placeholder="Enter your full name"
          />
        </FieldRow>

        {/* Phone */}
        <FieldRow label="Phone Number" description="Used for SMS alerts and account recovery.">
          <InlineEditField
            value={user?.phone || ''}
            onSave={savePhone}
            type="tel"
            placeholder="+92 300 1234567 (optional)"
          />
        </FieldRow>

        {/* Bio */}
        <FieldRow label="Bio" description="A short description about yourself.">
          <InlineEditField
            value={user?.bio || ''}
            onSave={saveBio}
            placeholder="Tell buyers/sellers about yourself"
          />
        </FieldRow>

        {/* Location */}
        <FieldRow label="Location" description="Your city or country.">
          <InlineEditField
            value={user?.location || ''}
            onSave={saveLocation}
            placeholder="e.g. Lahore, Pakistan"
          />
        </FieldRow>

        {/* Email — read-only (login credential) */}
        <FieldRow label="Email Address" description="Your login email. Contact support to change.">
          <span className="text-sm font-semibold text-text-muted">{displayEmail}</span>
        </FieldRow>

      </SettingsSection>

      {/* ── Security ── */}
      <SettingsSection title="Security" description="Keep your account protected." icon={SecurityIcon}>

        <ChangePasswordSection />

        <ToggleSwitch
          id="security-2fa"
          label="Two-Factor Authentication"
          description="Add an extra layer of security. A one-time code will be required at login."
          checked={twoFA}
          onChange={setTwoFA}
        />
      </SettingsSection>

      {/* ── Notification Preferences ── */}
      <SettingsSection title="Notification Preferences" description="Choose how and when you receive updates." icon={NotifIcon}>
        <p className="pb-1 pt-4 text-xs font-bold uppercase tracking-widest text-text-muted">Channels</p>
        <ToggleSwitch id="notif-email"     label="Email Notifications"  description="Receive updates to your email inbox."                  checked={notifSettings.email}     onChange={setNotif('email')}     />
        <ToggleSwitch id="notif-sms"       label="SMS Notifications"    description="Get critical alerts via text message."                 checked={notifSettings.sms}       onChange={setNotif('sms')}       />
        <ToggleSwitch id="notif-push"      label="Push Notifications"   description="Browser or mobile push notifications."                 checked={notifSettings.push}      onChange={setNotif('push')}      />
        <ToggleSwitch id="notif-marketing" label="Marketing Emails"     description="Product updates, tips, and promotional content."       checked={notifSettings.marketing} onChange={setNotif('marketing')} />
        <p className="pb-1 pt-5 text-xs font-bold uppercase tracking-widest text-text-muted">Events</p>
        <ToggleSwitch id="notif-outbid"   label="Outbid Alerts"   description="Notify me when someone places a higher bid."          checked={notifSettings.outbid}     onChange={setNotif('outbid')}     />
        <ToggleSwitch id="notif-won"      label="Auction Won"     description="Notify me when I win an auction."                    checked={notifSettings.auctionWon} onChange={setNotif('auctionWon')} />
        <ToggleSwitch id="notif-ending"   label="Ending Soon"     description="Alert me 1 hour before a watched auction ends."     checked={notifSettings.endingSoon} onChange={setNotif('endingSoon')} />
        <ToggleSwitch id="notif-message"  label="New Messages"    description="Notify me when I receive a new chat message."       checked={notifSettings.newMessage} onChange={setNotif('newMessage')} />
        <ToggleSwitch id="notif-payments" label="Payment Updates" description="Confirmations and reminders for payments."          checked={notifSettings.payments}   onChange={setNotif('payments')}   />
        <ToggleSwitch id="notif-system"   label="System Alerts"   description="Platform maintenance and security notifications."  checked={notifSettings.system}     onChange={setNotif('system')}     />
      </SettingsSection>

      {/* ── Appearance ── */}
      <SettingsSection title="Appearance" description="Customise how BidStream looks and feels." icon={AppearanceIcon}>
        <FieldRow label="Theme" description="Choose your preferred colour scheme.">
          <SelectField value={theme} onChange={setTheme} options={[
            { value: 'light',  label: 'Light'          },
            { value: 'dark',   label: 'Dark'           },
            { value: 'system', label: 'System Default' },
          ]}/>
        </FieldRow>
        <FieldRow label="Language" description="Interface language.">
          <SelectField value={language} onChange={setLanguage} options={[
            { value: 'en', label: 'English' },
            { value: 'ur', label: 'Urdu'    },
            { value: 'ar', label: 'Arabic'  },
          ]}/>
        </FieldRow>
        <FieldRow label="Timezone" description="Used for auction times and notifications.">
          <SelectField value={timezone} onChange={setTimezone} options={[
            { value: 'Asia/Karachi',     label: 'PKT — Asia/Karachi' },
            { value: 'UTC',              label: 'UTC'                 },
            { value: 'America/New_York', label: 'EST — New York'      },
            { value: 'Europe/London',    label: 'GMT — London'        },
            { value: 'Asia/Dubai',       label: 'GST — Dubai'         },
          ]}/>
        </FieldRow>
      </SettingsSection>

      {/* ── Privacy ── */}
      <SettingsSection title="Privacy" description="Control who can see your profile and activity." icon={PrivacyIcon}>
        <ToggleSwitch id="privacy-profile"  label="Public Profile"      description="Allow other users to view your profile page."            checked={privacySettings.profilePublic}    onChange={setPrivacy('profilePublic')}    />
        <ToggleSwitch id="privacy-activity" label="Public Activity"     description="Show your bid activity and won auctions to others."      checked={privacySettings.activityPublic}   onChange={setPrivacy('activityPublic')}   />
        <ToggleSwitch id="privacy-online"   label="Show Online Status"  description="Let other users see when you are online."               checked={privacySettings.showOnlineStatus} onChange={setPrivacy('showOnlineStatus')} />
        <ToggleSwitch id="privacy-bids"     label="Show Bid History"    description="Allow others to see your historical bids."              checked={privacySettings.showBidHistory}   onChange={setPrivacy('showBidHistory')}   />
      </SettingsSection>

      {/* ── Danger Zone ── */}
      <DangerZone />

    </div>
  );
}

export default Settings;
