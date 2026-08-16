import { forwardRef } from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────
//
// Token reference (from tailwind.config.js / Steps 2-3):
//   primary-600  = #4F46E5  (indigo — primary action)
//   primary-500  = #6366F1  (primary.bright — lighter indigo)
//   primary-700  = #4338CA  (deeper indigo for hover/active)
//   bg-bg-card   = #121936  (card surface)
//   bg-bg-elevated = #171F42 (elevated surface)
//   border-border  = #1F2D4A (subtle border)
//   text-text-primary  = #F8FAFC
//   text-text-secondary = #CBD5E1
//   danger       = #F43F5E  (rose/red — destructive only)
//   auction-DEFAULT = #F59E0B (amber — bid-related CTAs only)

const variantStyles = {
  // ── Primary — Indigo filled button. The main brand CTA.
  // primary-900 was too dark (#1E1B4B), swapped to primary-600 (#4F46E5).
  primary:
    'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus-visible:ring-primary-500',

  // ── Secondary — Elevated dark surface with subtle border.
  // Distinguishable from primary without competing for attention.
  // bg-secondary-600 was resolving to indigo after Step 2 (same as primary),
  // so secondary is now a surface-based style instead.
  secondary:
    'bg-bg-elevated text-text-secondary border border-border hover:bg-navy-100 hover:text-text-primary hover:border-primary-600/50 active:bg-bg-elevated focus-visible:ring-primary-500',

  // ── Outline — Indigo border, transparent fill.
  // border-primary-900 was near-invisible (#1E1B4B). Now uses primary-600 border.
  outline:
    'border border-primary-600 text-primary-500 bg-transparent hover:bg-primary-600/10 active:bg-primary-600/15 focus-visible:ring-primary-500',

  // ── Ghost — Transparent, subtle indigo hover tint.
  ghost:
    'bg-transparent text-text-primary hover:bg-primary-600/10 active:bg-primary-600/15 focus-visible:ring-primary-500',

  // ── Danger — Rose/red. Destructive actions only.
  danger:
    'bg-danger text-white hover:bg-danger/85 active:bg-danger focus-visible:ring-danger',

  // ── Auction — Amber. Bid-specific CTAs only (e.g. "Bid Now", "Place Bid").
  // Not in the original variant set; added to support auction semantics
  // without scattering inline amber classes through every bid component.
  auction:
    'bg-auction text-white font-semibold hover:bg-auction/85 active:bg-auction focus-visible:ring-auction',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

/**
 * Button
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'auction'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading   – shows spinner, disables interaction
 * @param {boolean} disabled
 * @param {boolean} fullWidth
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 * @param {string} className
 * @param {'button'|'submit'|'reset'} type
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    type = 'button',
    onClick,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  const classes = [
    // Layout
    'inline-flex items-center justify-center gap-2',
    // Shape
    'rounded-lg',
    // Typography
    'font-medium',
    // Transitions — only color properties change on most variants
    'transition-colors duration-150',
    // Focus ring
    // ring-offset uses the literal card surface hex because Tailwind cannot
    // resolve ring-offset-bg-card (custom token not in the default color map).
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]',
    // Disabled state
    'disabled:opacity-40 disabled:pointer-events-none',
    // Variant
    variantStyles[variant] ?? variantStyles.primary,
    // Size
    sizeStyles[size] ?? sizeStyles.md,
    // Width
    fullWidth ? 'w-full' : 'w-auto',
    // Caller overrides
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {/* Left slot: spinner takes over when loading */}
      {loading ? <Spinner /> : leftIcon ?? null}

      {/* Label */}
      {children}

      {/* Right slot: hidden while loading to avoid layout shift */}
      {!loading && rightIcon ? rightIcon : null}
    </button>
  );
});

export default Button;
