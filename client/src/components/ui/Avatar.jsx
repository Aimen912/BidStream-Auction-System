import { forwardRef } from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles = {
  xs: 'w-6  h-6  text-xs',
  sm: 'w-8  h-8  text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

// Dot scales proportionally with avatar size
const dotSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2   h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3   h-3',
  xl: 'w-3.5 h-3.5',
};

const statusColors = {
  online:  'bg-success',
  offline: 'bg-navy-500',
  busy:    'bg-danger',
  away:    'bg-warning',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives up to two uppercase initials from a display name.
 * "Ayesha Muneer" → "AM" | "John" → "J" | undefined → "?"
 */
function getInitials(name) {
  if (!name || !name.trim()) return '?';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

/**
 * Avatar
 *
 * @param {string}                              src       – image URL; falls back to initials when absent
 * @param {string}                              alt       – img alt text
 * @param {string}                              name      – used to derive initials and aria-label
 * @param {'xs'|'sm'|'md'|'lg'|'xl'}           size      – dimension preset; default "md"
 * @param {boolean}                             rounded   – full circle when true; default true
 * @param {boolean}                             border    – white ring around avatar; default false
 * @param {'online'|'offline'|'busy'|'away'}   status    – presence dot rendered bottom-right
 * @param {string}                              className – merged after all internal classes
 */
const Avatar = forwardRef(function Avatar(
  {
    src,
    alt,
    name,
    size = 'md',
    rounded = true,
    border = false,
    status,
    className = '',
    ...rest
  },
  ref
) {
  const initials = getInitials(name);

  // ── Container classes ──────────────────────────────────────────────────────
  const containerClasses = [
    // Positioning context for the status dot
    'relative',
    // Layout
    'inline-flex items-center justify-center',
    // Prevent shrinking inside flex parents
    'shrink-0',
    // Base appearance
    'overflow-hidden',
    // Subtle indigo-tinted surface for initials fallback — avoids pure dark blob
    'bg-primary-900',
    'text-primary-300',
    'font-semibold',
    'select-none',
    // Size
    sizeStyles[size] ?? sizeStyles.md,
    // Shape
    rounded ? 'rounded-full' : 'rounded-lg',
    // Border
    border ? 'border-2 border-bg-card' : '',
    // Caller overrides
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ── Status dot classes ─────────────────────────────────────────────────────
  const dotClasses = [
    'absolute bottom-0 right-0',
    'rounded-full',
    'ring-2 ring-bg-card',
    dotSizeStyles[size] ?? dotSizeStyles.md,
    statusColors[status] ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className={containerClasses} {...rest}>

      {src ? (
        /* Image avatar */
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        /* Initials fallback */
        <span aria-label={name || 'Avatar'}>
          {initials}
        </span>
      )}

      {/* Status indicator */}
      {status && statusColors[status] && (
        <span className={dotClasses} aria-label={status} />
      )}

    </div>
  );
});

export default Avatar;
