import { forwardRef } from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────
//
// Semantic mapping:
//   primary   → indigo tint  (brand / informational)
//   secondary → muted tint   (neutral / secondary info)
//   success   → green tint   (winning / live / completed)
//   warning   → amber tint   (pending / ending soon)
//   danger    → rose tint    (outbid / error / destructive)
//   gray      → elevated     (ended / inactive)
//   auction   → amber tint   (auction/bid value emphasis — same hue as warning
//                              but reserved for auction-specific semantics)
//   live      → green tint + dot indicator (actively live)

const variantStyles = {
  // Indigo tint — brand / primary info
  primary:
    'bg-primary-600/15 text-primary-300 border border-primary-600/20',

  // Muted navy surface — neutral / secondary status
  secondary:
    'bg-bg-elevated text-text-secondary border border-border',

  // Green — winning, active, live, success
  success:
    'bg-success/10 text-success border border-success/20',

  // Amber — pending, ending soon, warnings
  warning:
    'bg-warning/10 text-warning border border-warning/20',

  // Rose — outbid, error, danger, destructive
  danger:
    'bg-danger/10 text-danger border border-danger/20',

  // Muted surface — ended, inactive, unknown
  gray:
    'bg-bg-elevated text-text-muted border border-border',

  // Amber — auction value / bid context (same colour family as warning,
  // semantically distinct from general warning badges)
  auction:
    'bg-auction/10 text-auction border border-auction/20',

  // Violet — premium / featured accent (use sparingly)
  violet:
    'bg-violet/10 text-violet-light border border-violet/20',
};

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

// ─── Badge ─────────────────────────────────────────────────────────────────────

/**
 * Badge
 *
 * @param {React.ReactNode}  children
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'gray'|'auction'|'violet'} variant
 * @param {'sm'|'md'|'lg'}   size      – default "md"
 * @param {boolean}          rounded   – pill (true) or slightly rounded rect (false); default true
 * @param {string}           className
 */
const Badge = forwardRef(function Badge(
  {
    children,
    variant = 'primary',
    size = 'md',
    rounded = true,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    'inline-flex items-center justify-center',
    'font-semibold whitespace-nowrap',
    'select-none',
    'transition-colors duration-150',
    variantStyles[variant] ?? variantStyles.primary,
    sizeStyles[size] ?? sizeStyles.md,
    rounded ? 'rounded-full' : 'rounded-md',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {children}
    </span>
  );
});

export default Badge;
