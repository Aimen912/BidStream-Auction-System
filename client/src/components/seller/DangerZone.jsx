import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import http from '../../api/http';

function DangerZone() {
  const { signOut, user } = useAuth();
  const navigate          = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteError,   setDeleteError]   = useState('');

  async function handleSignOut() {
    await signOut();
    window.location.replace('/login');
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError('');
    try {
      await http.delete(`/users/${user?._id || user?.id}`);
      await signOut();
      window.location.replace('/register');
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-danger/30 bg-bg-card shadow-card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-danger-100 bg-danger-100/40 px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-100 text-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <div>
          <h2 className="text-base font-bold text-danger">Danger Zone</h2>
          <p className="mt-0.5 text-xs text-danger/70">These actions are permanent and cannot be undone.</p>
        </div>
      </div>

      <div className="divide-y divide-border-subtle px-6">

        {/* Sign out */}
        <div className="flex items-start justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Sign Out</p>
            <p className="mt-0.5 text-xs text-text-muted">Sign out of your BidStream seller account on this device.</p>
          </div>
          <button type="button" onClick={handleSignOut}
            className="shrink-0 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary transition-all duration-150 hover:border-primary-700/30 hover:bg-primary-900/30 hover:text-primary-300 focus-visible:outline-none">
            Sign Out
          </button>
        </div>

        {/* Delete account */}
        <div className="flex items-start justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-danger">Delete Seller Account</p>
            <p className="mt-0.5 text-xs text-text-muted">
              Permanently delete your account, all auction listings, and associated data.
              This action cannot be reversed.
            </p>
            {deleteError && <p className="mt-1 text-xs text-danger">{deleteError}</p>}
          </div>

          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)}
              className="shrink-0 rounded-xl border border-danger/30 bg-danger-100 px-4 py-2 text-sm font-semibold text-danger transition-colors duration-150 hover:bg-danger hover:text-white hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40">
              Delete Account
            </button>
          ) : (
            <div className="flex shrink-0 flex-col items-end gap-2">
              <p className="text-xs font-medium text-danger">This cannot be undone. Are you sure?</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">
                  Cancel
                </button>
                <button type="button" onClick={handleDeleteAccount} disabled={deleting}
                  className="rounded-xl bg-danger px-3 py-1.5 text-xs font-semibold text-white shadow-card hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40">
                  {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DangerZone;
