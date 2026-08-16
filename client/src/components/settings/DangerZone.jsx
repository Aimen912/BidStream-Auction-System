import { useState } from 'react';

// ─── DangerZone ───────────────────────────────────────────────────────────────

/**
 * Danger zone card — Delete Account and Logout buttons.
 * UI only — no actual actions are performed.
 */
function DangerZone() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <section className="rounded-2xl border border-danger/30 bg-bg-card shadow-card overflow-hidden">

      {/* Header */}
      <div className="flex items-start gap-4 border-b border-danger-100 bg-danger-100/40 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-100 text-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-danger">Danger Zone</h2>
          <p className="mt-0.5 text-xs text-danger/70">These actions are permanent and cannot be undone.</p>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-border-subtle px-6">

        {/* Logout */}
        <div className="flex items-start justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Sign Out</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Sign out of your BidStream account on this device.
            </p>
          </div>
          <button
            type="button"
            className={[
              'shrink-0 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary',
              'transition-all duration-150 hover:border-primary-700/40 hover:bg-primary-900/30 hover:text-primary-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700/40',
            ].join(' ')}
          >
            Sign Out
          </button>
        </div>

        {/* Delete account */}
        <div className="flex items-start justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-danger">Delete Account</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Permanently delete your account and all associated data. This action cannot be reversed.
            </p>
          </div>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className={[
                'shrink-0 rounded-xl border border-danger/30 bg-danger-100 px-4 py-2 text-sm font-semibold text-danger',
                'transition-colors duration-150 hover:bg-danger hover:text-white hover:border-danger',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40',
              ].join(' ')}
            >
              Delete Account
            </button>
          ) : (
            /* Confirmation row */
            <div className="flex shrink-0 items-center gap-2">
              <p className="text-xs font-medium text-danger">Are you sure?</p>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-danger px-3 py-1.5 text-xs font-semibold text-white shadow-card hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DangerZone;
