import { useState } from 'react';
import { NOTIFICATION_DEFAULTS } from '../../data/seller/SELLER_SETTINGS_DATA';

// ─── Toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-4 last:border-0">
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="block cursor-pointer select-none text-sm font-semibold text-text-primary">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]',
          checked ? 'bg-primary-600' : 'bg-navy-100 hover:bg-navy-300',
        ].join(' ')}
      >
        <span className={['inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-card transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1'].join(' ')} />
      </button>
    </div>
  );
}

// ─── NotificationSettings ─────────────────────────────────────────────────────

function NotificationSettings() {
  const [settings, setSettings] = useState(NOTIFICATION_DEFAULTS);
  const set = (key) => (val) => setSettings((p) => ({ ...p, [key]: val }));

  const ITEMS = [
    { key: 'emailNotifications', label: 'Email Notifications',  description: 'Receive auction updates, bids and orders to your email inbox.'    },
    { key: 'pushNotifications',  label: 'Push Notifications',   description: 'Browser or mobile push alerts for real-time activity.'              },
    { key: 'auctionUpdates',     label: 'Auction Updates',      description: 'Get notified when your auctions receive new bids or are ending soon.' },
    { key: 'newMessages',        label: 'New Messages',         description: 'Alert me immediately when a buyer sends a message.'                  },
    { key: 'marketingEmails',    label: 'Marketing Emails',     description: 'Product updates, tips, and promotional content from BidStream.'     },
  ];

  return (
    <section className="rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-text-primary">Notification Preferences</h2>
          <p className="mt-0.5 text-xs text-text-muted">Choose how and when you receive updates.</p>
        </div>
      </div>

      <div className="px-6 py-2">
        {ITEMS.map(({ key, label, description }) => (
          <ToggleSwitch
            key={key}
            id={`notif-${key}`}
            label={label}
            description={description}
            checked={settings[key]}
            onChange={set(key)}
          />
        ))}
      </div>
    </section>
  );
}

export default NotificationSettings;
