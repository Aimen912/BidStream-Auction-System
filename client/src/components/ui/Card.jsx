import { forwardRef } from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────

const paddingStyles = {
  none: 'p-0',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

const shadowStyles = {
  none: 'shadow-none',
  sm:   'shadow-card',
  md:   'shadow-dropdown',
  lg:   'shadow-modal',
};

const roundedStyles = {
  sm:   'rounded-sm',
  md:   'rounded-md',
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  '2xl':'rounded-2xl',
};

// ─── Card ─────────────────────────────────────────────────────────────────────

/**
 * Card
 *
 * @param {React.ReactNode}               children
 * @param {string}                        className   – merged after all internal classes
 * @param {'none'|'sm'|'md'|'lg'}         padding     – internal spacing; default "md"
 * @param {'none'|'sm'|'md'|'lg'}         shadow      – elevation level; default "sm"
 * @param {boolean}                       hover       – lifts card on hover; default false
 * @param {boolean}                       border      – shows border-border; default true
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'}    rounded     – corner radius; default "lg"
 * @param {function}                      onClick
 */
const Card = forwardRef(function Card(
  {
    children,
    className = '',
    padding = 'md',
    shadow = 'sm',
    hover = false,
    border = true,
    rounded = 'lg',
    onClick,
    ...rest
  },
  ref
) {
  const classes = [
    // Base
    'bg-bg-card',
    // Border
    border ? 'border border-border' : '',
    // Padding
    paddingStyles[padding] ?? paddingStyles.md,
    // Shadow
    shadowStyles[shadow] ?? shadowStyles.sm,
    // Rounded
    roundedStyles[rounded] ?? roundedStyles.lg,
    // Transition (always present so hover animation is smooth even when hover=false)
    'transition-all duration-200',
    // Hover lift — subtle translateY + shadow increase + border brightens slightly
    hover ? 'hover:-translate-y-1 hover:shadow-dropdown hover:border-primary-600/25 cursor-pointer' : '',
    // Caller overrides
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Card;
