import { useState } from 'react';

// ─── ProfileTabs ──────────────────────────────────────────────────────────────

/**
 * Tab switcher used on the Profile page.
 *
 * @param {Array<{id, label}>} tabs    – available tabs
 * @param {string}             active  – currently active tab id
 * @param {function}           onChange – (id) => void
 */
function ProfileTabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-border bg-bg-card p-1.5 shadow-card">
      {tabs.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-selected={isActive}
            role="tab"
            className={[
              'flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2',
              'text-sm font-semibold transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30',
              isActive
                ? 'bg-primary-900 text-white shadow-card'
                : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary',
            ].join(' ')}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default ProfileTabs;
