import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatar, uploadCoverImage, deleteCoverImage } from '../../api/users';

// ─── Spinner icon ─────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-white"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Camera icon ──────────────────────────────────────────────────────────────

function CameraIcon({ size = 18 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

/**
 * Hero card at the top of the Profile page.
 *
 * Cover image:
 *   - Displays authUser.coverImage when available (URL from backend).
 *   - Falls back to the existing indigo gradient when no cover is set.
 *   - A small camera button in the top-right of the cover lets the user
 *     pick a new cover image. Shows an immediate local preview while
 *     the upload is in progress, then persists via reloadUser().
 *   - A "Remove" option appears when a cover image is set.
 *
 * Avatar image:
 *   - Existing hover-to-upload behaviour is preserved unchanged.
 *   - Hover shows a camera overlay; click opens the file picker.
 */
function ProfileCard({ user }) {
  const {
    name, username, role, memberSince,
    avatarInitials, avatarGradient,
    online, bio, location,
  } = user;

  const { user: authUser, reloadUser } = useAuth();

  // ── Avatar upload state ───────────────────────────────────────────────────
  const avatarInputRef     = useRef(null);
  const [avatarUploading,  setAvatarUploading]  = useState(false);

  // ── Cover upload state ────────────────────────────────────────────────────
  // coverPreview — blob URL for instant local preview while uploading.
  // Once upload finishes and reloadUser() refreshes authUser.coverImage,
  // we clear the preview and the persisted URL takes over.
  const coverInputRef      = useRef(null);
  const [coverUploading,   setCoverUploading]   = useState(false);
  const [coverPreview,     setCoverPreview]      = useState(null);
  const [coverError,       setCoverError]        = useState('');
  const [coverRemoving,    setCoverRemoving]     = useState(false);

  // Resolved cover source: local preview > persisted URL > null (gradient fallback)
  const coverSrc = coverPreview || authUser?.coverImage || null;

  // ── Avatar handler ────────────────────────────────────────────────────────

  async function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      await uploadAvatar(fd);
      await reloadUser();
    } catch { /* silent */ } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  }

  // ── Cover handlers ────────────────────────────────────────────────────────

  async function handleCoverFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverError('');

    // Show local preview immediately so the user gets instant feedback
    const blobUrl = URL.createObjectURL(file);
    setCoverPreview(blobUrl);
    setCoverUploading(true);

    try {
      const fd = new FormData();
      fd.append('cover', file);
      await uploadCoverImage(fd);
      await reloadUser();   // authUser.coverImage now has the persisted URL
    } catch {
      setCoverError('Upload failed — please try again.');
      setCoverPreview(null);
    } finally {
      setCoverUploading(false);
      // Release the blob URL after the component has had a chance to re-render
      // with the real URL from authUser.coverImage
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  async function handleCoverRemove() {
    setCoverError('');
    setCoverRemoving(true);
    try {
      await deleteCoverImage();
      await reloadUser();
    } catch {
      setCoverError('Could not remove cover — please try again.');
    } finally {
      setCoverRemoving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">

      {/* ══════════════════════════════════════════════════
          COVER BANNER
          Height: h-32 mobile / h-40 desktop — unchanged from original.
          The cover area is `relative` so the camera button and
          remove button can be positioned inside it.
      ══════════════════════════════════════════════════ */}
      <div className="group/cover relative h-32 w-full overflow-hidden lg:h-40">

        {/* Cover image or gradient fallback */}
        {coverSrc ? (
          <img
            src={coverSrc}
            alt="Cover"
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary-900 via-primary-700 to-primary-600" />
        )}

        {/* Subtle dark overlay — always visible, helps buttons stay readable */}
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* ── Cover upload button (top-right) ── */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-150 group-hover/cover:opacity-100 focus-within:opacity-100">

          {/* Upload / change button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverUploading || coverRemoving}
            aria-label="Change cover photo"
            title="Change cover photo"
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {coverUploading ? <Spinner /> : <CameraIcon size={13} />}
            {coverUploading ? 'Uploading…' : 'Change cover'}
          </button>

          {/* Remove button — only shown when a cover image exists */}
          {authUser?.coverImage && !coverUploading && (
            <button
              type="button"
              onClick={handleCoverRemove}
              disabled={coverRemoving}
              aria-label="Remove cover photo"
              title="Remove cover photo"
              className="flex items-center gap-1 rounded-lg border border-white/20 bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition-all duration-150 hover:bg-danger/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {coverRemoving ? <Spinner /> : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
              {coverRemoving ? 'Removing…' : 'Remove'}
            </button>
          )}
        </div>

        {/* Hidden file input for cover */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleCoverFile}
          aria-hidden="true"
        />
      </div>

      {/* Cover upload error — shown below the banner if something went wrong */}
      {coverError && (
        <p className="border-b border-danger/20 bg-danger/8 px-5 py-2 text-xs text-danger">
          {coverError}
        </p>
      )}

      {/* ══════════════════════════════════════════════════
          AVATAR + ACTIONS ROW
      ══════════════════════════════════════════════════ */}
      <div className="relative px-5 pb-5">

        <div className="flex items-end justify-between">

          {/* Avatar block — -mt-10 pulls it up to overlap the cover */}
          <div className="-mt-10 flex items-end gap-3">
            <div className="group/avatar relative">

              {/* Avatar image or initials fallback */}
              {authUser?.avatar ? (
                <img
                  src={authUser.avatar}
                  alt={name}
                  className="h-20 w-20 rounded-2xl border-4 border-bg-card object-cover shadow-dropdown"
                />
              ) : (
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-bg-card bg-gradient-to-br ${avatarGradient} text-2xl font-bold text-white shadow-dropdown`}>
                  {avatarInitials}
                </div>
              )}

              {/* Hover camera overlay — click to upload */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                aria-label="Change profile photo"
                title="Change profile photo"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity duration-150 group-hover/avatar:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                {avatarUploading ? <Spinner /> : <CameraIcon size={18} />}
              </button>

              {/* Hidden avatar file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFile}
                aria-hidden="true"
              />

              {/* Online indicator */}
              {online && (
                <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-bg-card bg-success" />
                </span>
              )}
            </div>

            {/* Name block — desktop only (mobile shown below) */}
            <div className="mb-1 hidden md:block">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{name}</h1>
                <span
                  className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-600"
                  title="Verified"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <p className="text-sm text-text-muted">@{username}</p>
            </div>
          </div>

          {/* Edit Profile button */}
          <div className="mt-2">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary no-underline shadow-card transition-all duration-150 hover:border-primary-600/30 hover:text-primary-300"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Name block — mobile only */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary">{name}</h1>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600" title="Verified">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>
          <p className="text-sm text-text-muted">@{username}</p>
        </div>

        {/* ── Meta row: role badge · location · member since ── */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">

          {/* Role badge */}
          <span className={[
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            role === 'Buyer'
              ? 'bg-primary-600/12 text-primary-300'
              : role === 'Seller'
              ? 'bg-auction/10 text-auction'
              : 'bg-violet/10 text-violet-light',
          ].join(' ')}>
            {role === 'Buyer' && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
            {role}
          </span>

          {/* Location */}
          {location && location !== '—' && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </span>
          )}

          {/* Member since */}
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Member since {memberSince}
          </span>
        </div>

        {/* Bio */}
        {bio && bio !== 'BidStream user.' && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">{bio}</p>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
