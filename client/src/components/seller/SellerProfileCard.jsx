import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatar } from '../../api/users';

// ─── SellerProfileCard ────────────────────────────────────────────────────────

function SellerProfileCard() {
  const { user, reloadUser } = useAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      await uploadAvatar(fd);
      await reloadUser();
    } catch { /* silent */ } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const fullName       = user?.name     || 'Seller';
  const username       = user?.username || user?.email?.split('@')[0] || 'seller';
  const location       = user?.location || '—';
  const bio            = user?.bio      || 'BidStream seller.';
  const joinDate       = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';
  const avatarInitials = fullName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">

      {/* Cover */}
      <div className="h-32 w-full bg-gradient-to-r from-primary-900 via-primary-700 to-secondary-600 lg:h-40">
        <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-secondary-600/20 blur-3xl"/>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent-600/15 blur-3xl"/>
      </div>

      {/* Avatar + actions */}
      <div className="relative px-6 pb-6">
        <div className="flex items-end justify-between">

          <div className="-mt-10 flex items-end gap-4">
            <div className="relative group">
              {user?.avatar ? (
                <img src={user.avatar} alt={fullName}
                  className="h-20 w-20 rounded-2xl border-4 border-bg-card object-cover shadow-dropdown"/>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-bg-card bg-gradient-to-br from-secondary-600 to-primary-700 text-2xl font-bold text-white shadow-dropdown">
                  {avatarInitials}
                </div>
              )}
              {/* Camera overlay */}
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
                aria-label="Change profile photo"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-none disabled:cursor-not-allowed">
                {uploading
                  ? <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                }
              </button>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-hidden="true"/>
              <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"/>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-bg-card bg-success"/>
              </span>
            </div>

            {/* Name — desktop */}
            <div className="mb-1 hidden md:block">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{fullName}</h1>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-600" title="Verified Seller">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              </div>
              <p className="text-sm text-text-muted">@{username}</p>
            </div>
          </div>

          <div className="mt-3">
            <Link to="/seller/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-secondary-600/40 hover:text-secondary-600 no-underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Name — mobile */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary">{fullName}</h1>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-600">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          </div>
          <p className="text-sm text-text-muted">@{username}</p>
        </div>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-600">
            Seller
          </span>
          {location !== '—' && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {location}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Member since {joinDate}
          </span>
        </div>

        {/* Bio */}
        {bio && bio !== 'BidStream seller.' && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">{bio}</p>
        )}
      </div>
    </div>
  );
}

export default SellerProfileCard;
