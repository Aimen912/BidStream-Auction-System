// ─── PageHeader ───────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, breadcrumbs = [], actions, className = '' }) {
  return (
    <div className={[
      'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between',
      className,
    ].filter(Boolean).join(' ')}>

      <div className="flex flex-col gap-1.5">

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            {breadcrumbs.map(({ label, href }, index) => (
              <span key={label} className="flex items-center gap-1.5">
                {index > 0 && (
                  // Separator chevron — very muted, not meant to draw attention
                  <svg
                    width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="text-border"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
                {href ? (
                  // Ancestor breadcrumb — muted, brightens to indigo on hover
                  <a
                    href={href}
                    className="text-xs font-medium text-text-muted transition-colors duration-150 hover:text-primary-500 no-underline"
                  >
                    {label}
                  </a>
                ) : (
                  // Current page — slightly brighter than ancestor
                  <span className="text-xs font-semibold text-text-secondary">
                    {label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary leading-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-text-secondary leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Actions slot */}
      {actions && (
        <div className="mt-3 flex shrink-0 flex-wrap items-center gap-2 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
