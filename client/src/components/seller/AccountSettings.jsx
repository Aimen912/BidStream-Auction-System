import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePhone } from '../../api/users';
import AvatarUploader from '../shared/AvatarUploader';

const inputCls = [
  'w-full rounded-xl border border-border bg-bg-card px-4 py-2.5',
  'text-sm text-text-primary placeholder:text-text-muted',
  'outline-none transition-all duration-150',
  'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
].join(' ');

function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-text-secondary">{label}</label>
      {children}
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

function AccountSettings() {
  const { user, reloadUser } = useAuth();

  const [form, setForm] = useState({
    fullName:     user?.name     || '',
    username:     user?.username || '',
    email:        user?.email    || '',
    phone:        user?.phone    || '',
    businessName: user?.bio      || '',
  });

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  // Sync form when user loads
  useEffect(() => {
    if (!user) return;
    setForm({
      fullName:     user.name     || '',
      username:     user.username || '',
      email:        user.email    || '',
      phone:        user.phone    || '',
      businessName: user.bio      || '',
    });
  }, [user]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateProfile({ name: form.fullName, bio: form.businessName });
      if (form.phone !== user?.phone) await updatePhone(form.phone || null);
      await reloadUser();
      setSuccess('Changes saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  const initials = (user?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <section className="rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900/30 text-primary-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-text-primary">Account Settings</h2>
          <p className="mt-0.5 text-xs text-text-muted">Update your personal and business details.</p>
        </div>
      </div>

      {/* Avatar row */}
      <div className="flex flex-col gap-4 border-b border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
        <AvatarUploader size="md" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-text-primary">{user?.name || '—'}</p>
          <p className="text-xs text-text-muted">Verified Seller · Member since {joinDate}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="acc-name">
          <input id="acc-name" type="text" value={form.fullName} onChange={set('fullName')} className={inputCls}/>
        </Field>
        <Field label="Username" htmlFor="acc-username">
          <input id="acc-username" type="text" value={form.username} disabled
            className={[inputCls, 'cursor-not-allowed opacity-60'].join(' ')}/>
        </Field>
        <Field label="Email Address" htmlFor="acc-email" hint="Used for login and notifications.">
          <input id="acc-email" type="email" value={form.email} disabled
            className={[inputCls, 'cursor-not-allowed opacity-60'].join(' ')}/>
        </Field>
        <Field label="Phone Number" htmlFor="acc-phone">
          <input id="acc-phone" type="tel" value={form.phone} onChange={set('phone')}
            placeholder="+92 300 1234567" className={inputCls}/>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Business Name / Bio" htmlFor="acc-business">
            <input id="acc-business" type="text" value={form.businessName} onChange={set('businessName')}
              placeholder="Your business name or bio" className={inputCls}/>
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
        <div>
          {success && <p className="text-sm text-success font-medium">{success}</p>}
          {error   && <p className="text-sm text-danger">{error}</p>}
        </div>
        <button type="button" onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
          {saving && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </section>
  );
}

export default AccountSettings;
