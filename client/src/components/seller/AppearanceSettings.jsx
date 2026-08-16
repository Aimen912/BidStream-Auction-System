import { useState } from 'react';

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light'          },
  { value: 'dark',   label: 'Dark'           },
  { value: 'system', label: 'System Default' },
];
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'Urdu'    },
  { value: 'ar', label: 'Arabic'  },
  { value: 'fr', label: 'French'  },
  { value: 'de', label: 'German'  },
];
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Karachi',     label: 'PKT — Asia/Karachi' },
  { value: 'UTC',              label: 'UTC'                 },
  { value: 'America/New_York', label: 'EST — New York'      },
  { value: 'Europe/London',    label: 'GMT — London'        },
  { value: 'Asia/Dubai',       label: 'GST — Dubai'         },
];

// ─── Shared select field ──────────────────────────────────────────────────────

function SelectField({ id, label, description, value, onChange, options }) {
  return (
    <div className="flex flex-col justify-between gap-2 border-b border-border-subtle py-4 last:border-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold text-text-primary">{label}</label>
        {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      </div>
      <div className="relative shrink-0">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className="h-10 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 hover:border-border">
          {options.map(({ value: v, label: l }) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

// ─── AppearanceSettings ───────────────────────────────────────────────────────

function AppearanceSettings() {
  const [appearance, setAppearance] = useState({
    theme:    localStorage.getItem('bs_theme')    || 'system',
    language: localStorage.getItem('bs_language') || 'en',
    timezone: localStorage.getItem('bs_timezone') || 'Asia/Karachi',
  });
  const [saved, setSaved] = useState('');

  const set = (key) => (val) => setAppearance((p) => ({ ...p, [key]: val }));

  function handleSave() {
    localStorage.setItem('bs_theme',    appearance.theme);
    localStorage.setItem('bs_language', appearance.language);
    localStorage.setItem('bs_timezone', appearance.timezone);
    setSaved('Preferences saved!');
    setTimeout(() => setSaved(''), 2500);
  }

  return (
    <section className="rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-text-primary">Appearance</h2>
          <p className="mt-0.5 text-xs text-text-muted">Customise how BidStream looks and feels.</p>
        </div>
      </div>

      <div className="px-6 py-2">
        <SelectField id="app-theme"    label="Theme"    description="Choose your preferred colour scheme."
          value={appearance.theme}    onChange={set('theme')}    options={THEME_OPTIONS}    />
        <SelectField id="app-language" label="Language" description="Interface language."
          value={appearance.language} onChange={set('language')} options={LANGUAGE_OPTIONS} />
        <SelectField id="app-timezone" label="Timezone" description="Used for auction times and notifications."
          value={appearance.timezone} onChange={set('timezone')} options={TIMEZONE_OPTIONS} />
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
        <span className="text-sm font-medium text-success">{saved}</span>
        <button type="button" onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40">
          Save Preferences
        </button>
      </div>
    </section>
  );
}

export default AppearanceSettings;
