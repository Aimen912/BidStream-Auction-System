import { forwardRef, useId } from 'react';

/**
 * Reusable Input Component
 */

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    required = false,
    disabled = false,
    readOnly = false,
    fullWidth = false,
    className = '',
    id: idProp,
    name,
    placeholder,
    type = 'text',
    value,
    defaultValue,
    onChange,
    autoComplete,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = idProp || `input-${autoId}`;

  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);
  const hasHelper = Boolean(helperText) && !hasError;

  const describedBy = hasError
    ? errorId
    : hasHelper
    ? helperId
    : undefined;

  const inputClasses = [
    // Layout
    'block w-full',

    // Shape
    'rounded-lg border',

    // Colors
    'bg-bg-card text-text-primary',
    'placeholder:text-text-muted',

    // Typography
    'text-base leading-snug',

    // Animation
    'transition-all duration-150',

    // Focus — indigo ring, literal hex for ring-offset (token not resolvable here)
    'outline-none',
    'focus:border-primary-600',
    'focus:ring-2',
    'focus:ring-primary-600/50',
    'focus:ring-offset-2 focus:ring-offset-[#121936]',

    // Error
    hasError
      ? 'border-danger focus:border-danger focus:ring-danger'
      : 'border-border',

    // Disabled
    disabled
      ? 'bg-bg-elevated cursor-not-allowed text-text-muted'
      : '',

    // Read Only
    readOnly
      ? 'bg-bg-surface cursor-default'
      : '',

    // Dynamic Padding
    leftIcon && rightIcon
      ? 'pl-10 pr-10 py-2.5'
      : leftIcon
      ? 'pl-10 pr-4 py-2.5'
      : rightIcon
      ? 'pl-4 pr-10 py-2.5'
      : 'px-4 py-2.5',

    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={[
        'flex flex-col gap-1.5',
        fullWidth ? 'w-full' : 'w-auto',
      ].join(' ')}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={[
            'text-sm font-medium',
            hasError ? 'text-danger' : 'text-text-secondary',
          ].join(' ')}
        >
          {label}

          {required && (
            <span
              className="ml-0.5 text-danger"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className="pointer-events-none absolute left-3 flex items-center text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={inputClasses}
          {...rest}
        />

        {rightIcon && (
          <span
            className="pointer-events-none absolute right-3 flex items-center text-text-muted"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-danger"
        >
          {error}
        </p>
      )}

      {hasHelper && (
        <p
          id={helperId}
          className="text-sm text-text-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;