import { forwardRef } from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles = {
  xs: 'w-4  h-4  border-2',
  sm: 'w-5  h-5  border-2',
  md: 'w-8  h-8  border-[3px]',
  lg: 'w-10 h-10 border-4',
  xl: 'w-14 h-14 border-4',
};

const variantStyles = {
  primary:   'border-secondary-500 border-t-transparent',
  secondary: 'border-primary-700   border-t-transparent',
  white:     'border-bg-card         border-t-transparent',
  success:   'border-success     border-t-transparent',
  danger:    'border-danger       border-t-transparent',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

/**
 * Spinner
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'}                          size      – dimension preset; default "md"
 * @param {'primary'|'secondary'|'white'|'success'|'danger'}  variant   – color preset; default "primary"
 * @param {string}                                             label     – screen-reader text via sr-only span
 * @param {boolean}                                            overlay   – wraps spinner in a fullscreen overlay; default false
 * @param {string}                                             className – merged after all internal classes
 */
const Spinner = forwardRef(function Spinner(
  {
    size = 'md',
    variant = 'primary',
    label,
    overlay = false,
    className = '',
    ...rest
  },
  ref
) {
  // ── Spinner element classes ────────────────────────────────────────────────

  const spinnerClasses = [
    'rounded-full',
    'animate-spin',
    'inline-block',
    'shrink-0',
    sizeStyles[size]    ?? sizeStyles.md,
    variantStyles[variant] ?? variantStyles.primary,
    // Caller overrides applied to the spinner element
    !overlay ? className : '',
  ]
    .filter(Boolean)
    .join(' ');

  // ── Spinner element ────────────────────────────────────────────────────────

  const spinner = (
    <div
      ref={!overlay ? ref : undefined}
      role="status"
      aria-live="polite"
      className={spinnerClasses}
      {...rest}
    >
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );

  // ── Standalone (no overlay) ────────────────────────────────────────────────

  if (!overlay) return spinner;

  // ── Overlay wrapper ────────────────────────────────────────────────────────

  const overlayClasses = [
    'fixed inset-0',
    'bg-black/30',
    'backdrop-blur-sm',
    'flex items-center justify-center',
    'z-50',
    // Caller overrides applied to the overlay when active
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={overlayClasses}>
      {spinner}
    </div>
  );
});

export default Spinner;
