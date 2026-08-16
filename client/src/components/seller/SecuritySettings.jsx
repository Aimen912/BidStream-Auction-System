import { useState } from 'react';

// ─── Eye toggle ───────────────────────────────────────────────────────────────

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

const inputCls = [
  'w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 pr-11',
  'text-sm text-text-primary placeholder:text-text-muted',
  'outline-none transition-all duration-150',
  'focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20',
].join(' ');

// ─── Password field ───────────────────────────────────────────────────────────

function PasswordField({ id, label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-text-secondary">{label}</label>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder="••••••••" className={inputCls} />
        <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide' : 'Show'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  );
}

// ─── Toggle (reused inline) ───────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={['relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]', checked ? 'bg-primary-600' : 'bg-navy-100 hover:bg-navy-300'].join(' ')}>
      <span className={['inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-card transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1'].join(' ')} />
    </button>
  );
}

// ─── SecuritySettings ─────────────────────────────────────────────────────────

function SecuritySettings() {
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [twoFA,    setTwoFA]    = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900/30 text-primary-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-text-primary">Security</h2>
          <p className="mt-0.5 text-xs text-text-muted">Keep your account protected.</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6">
        {/* Password fields */}
        <PasswordField id="sec-current" label="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <PasswordField id="sec-new"     label="New Password"     value={next}    onChange={(e) => setNext(e.target.value)}    />
          <PasswordField id="sec-confirm" label="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {/* 2FA row */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-bg-surface p-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">Two-Factor Authentication</p>
            <p className="mt-0.5 text-xs text-text-muted">Add an extra layer of security. A one-time code will be required at login.</p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-border-subtle px-6 py-4">
        <button type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
          Update Password
        </button>
      </div>
    </section>
  );
}

export default SecuritySettings;
