import { useRef, useState } from 'react';
import { uploadAvatar, deleteAvatar } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

/**
 * Reusable avatar upload widget.
 *
 * Props:
 *   size        – 'sm' | 'md' | 'lg'  (default 'md')
 *   showRemove  – bool                 (default true)
 *   onSuccess   – (newAvatarUrl) => void  called after successful upload/remove
 */
function AvatarUploader({ size = 'md', showRemove = true, onSuccess }) {
  const { user, reloadUser } = useAuth();
  const inputRef             = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing,  setRemoving]  = useState(false);
  const [error,     setError]     = useState('');

  const sizeMap = {
    sm: { wrap: 'h-14 w-14', text: 'text-base', icon: 14, ring: 'border-[3px]', btn: 'h-5 w-5', btnIcon: 9  },
    md: { wrap: 'h-20 w-20', text: 'text-2xl',  icon: 16, ring: 'border-4',     btn: 'h-6 w-6', btnIcon: 11 },
    lg: { wrap: 'h-24 w-24', text: 'text-3xl',  icon: 18, ring: 'border-4',     btn: 'h-7 w-7', btnIcon: 12 },
  };
  const s = sizeMap[size] ?? sizeMap.md;

  const initials = (user?.name || '?').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WEBP).');
      return;
    }
    // Validate size (max 4 MB)
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be smaller than 4 MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const result = await uploadAvatar(fd);
      await reloadUser();
      onSuccess?.(result.avatar);
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove() {
    setError('');
    setRemoving(true);
    try {
      await deleteAvatar();
      await reloadUser();
      onSuccess?.(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove avatar.');
    } finally {
      setRemoving(false);
    }
  }

  const busy = uploading || removing;

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Avatar + camera overlay */}
      <div className="relative group">
        {/* Avatar circle / initials */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user?.name}
            className={[s.wrap, s.ring, 'rounded-2xl object-cover border-bg-card shadow-dropdown'].join(' ')}
          />
        ) : (
          <div className={[s.wrap, s.ring, s.text, 'flex items-center justify-center rounded-2xl border-bg-card bg-gradient-to-br from-primary-600 to-violet font-bold text-white shadow-dropdown'].join(' ')}>
            {initials}
          </div>
        )}

        {/* Hover overlay — click to upload */}
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          disabled={busy}
          aria-label="Change profile photo"
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-none disabled:cursor-not-allowed"
        >
          {uploading ? (
            <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          aria-hidden="true"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-card transition-colors duration-150 hover:border-primary-600/40 hover:text-primary-400 disabled:opacity-60 focus-visible:outline-none"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </button>

        {showRemove && user?.avatar && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-3 py-1.5 text-xs font-semibold text-danger transition-all duration-150 hover:border-danger/40 hover:bg-danger-100 disabled:opacity-60 focus-visible:outline-none"
          >
            {removing ? (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            )}
            {removing ? 'Removing…' : 'Remove'}
          </button>
        )}
      </div>

      {/* Hint */}
      <p className="text-[11px] text-text-muted">JPG, PNG or WEBP · Max 4 MB</p>

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger-100 px-3 py-2 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

export default AvatarUploader;
