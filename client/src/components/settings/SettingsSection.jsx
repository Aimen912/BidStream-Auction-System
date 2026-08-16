// ─── SettingsSection ──────────────────────────────────────────────────────────

/**
 * Reusable card wrapper for a settings group.
 *
 * @param {string}           title
 * @param {string}           description – subtitle under title
 * @param {React.ReactNode}  icon        – icon shown in the section header
 * @param {React.ReactNode}  children    – section body content
 * @param {string}           className   – optional overrides
 */
function SettingsSection({ title, description, icon, children, className = '' }) {
  return (
    <section
      className={[
        'rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-border-subtle px-6 py-5">
        {icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900/30 text-primary-300">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-text-muted">{description}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-2">
        {children}
      </div>
    </section>
  );
}

export default SettingsSection;
