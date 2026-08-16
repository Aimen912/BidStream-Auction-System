// ─── ToggleSwitch ─────────────────────────────────────────────────────────────

/**
 * Accessible toggle switch with label and optional description.
 *
 * @param {string}   id          – unique id connecting label to input
 * @param {string}   label       – primary label text
 * @param {string}   description – optional supporting text
 * @param {boolean}  checked     – controlled value
 * @param {function} onChange    – (checked: boolean) => void
 * @param {boolean}  disabled
 */
function ToggleSwitch({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border-subtle last:border-0">
      {/* Label side */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className={['block text-sm font-semibold select-none', disabled ? 'text-text-muted' : 'text-text-primary cursor-pointer'].join(' ')}
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{description}</p>
        )}
      </div>

      {/* Toggle */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          // ring-offset uses literal hex — ring-offset-bg-card is unresolvable as a Tailwind token
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]',
          disabled
            ? 'cursor-not-allowed opacity-40 bg-navy-100'
            : checked
            ? 'bg-primary-600'
            : 'bg-navy-100 hover:bg-navy-300',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 transform rounded-full bg-bg-card shadow-card transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

export default ToggleSwitch;
