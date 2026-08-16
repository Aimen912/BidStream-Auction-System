import { forwardRef } from 'react';

// ─── Table ────────────────────────────────────────────────────────────────────

/**
 * Table
 *
 * @param {Array<{key: string, header: string, render?: (row) => JSX.Element}>} columns
 * @param {Array<object>}  data          – row data; each object keyed by column.key
 * @param {boolean}        loading       – shows loading state when true
 * @param {string}         emptyMessage  – shown when data is empty; default "No data available."
 * @param {boolean}        striped       – alternates row background; default false
 * @param {boolean}        hover         – highlights row on hover; default true
 * @param {boolean}        compact       – reduces cell vertical padding; default false
 * @param {string}         className     – merged onto the outer wrapper
 */
const Table = forwardRef(function Table(
  {
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'No data available.',
    striped = false,
    hover = true,
    compact = false,
    className = '',
  },
  ref
) {
  // ── Derived class fragments ────────────────────────────────────────────────

  const cellPadding = compact ? 'py-2' : 'py-4';

  const wrapperClasses = [
    'overflow-x-auto',
    'rounded-lg',
    'border border-border',
    'bg-bg-card',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div ref={ref} className={wrapperClasses}>
        <div className="flex items-center justify-center px-6 py-12 text-sm text-text-muted">
          Loading...
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────

  if (data.length === 0) {
    return (
      <div ref={ref} className={wrapperClasses}>
        <div className="flex items-center justify-center px-6 py-12 text-sm text-text-muted">
          {emptyMessage}
        </div>
      </div>
    );
  }

  // ── Full table ─────────────────────────────────────────────────────────────

  return (
    <div ref={ref} className={wrapperClasses}>
      <table className="min-w-full border-collapse">

        {/* Head */}
        <thead className="bg-bg-surface">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'text-left',
                  'font-semibold text-xs uppercase tracking-wider',
                  'text-text-muted',
                  'px-6',
                  'py-3',
                  'border-b border-border',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, rowIndex) => {
            const isEven = rowIndex % 2 === 0;

            const rowClasses = [
              // Striped alternating background
              striped ? (isEven ? 'bg-bg-card' : 'bg-bg-surface') : 'bg-bg-card',
              // Hover highlight
              hover ? 'hover:bg-primary-600/8' : '',
              // Smooth transition for hover
              'transition-colors duration-150',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <tr key={rowIndex} className={rowClasses}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      'px-6',
                      cellPadding,
                      'text-text-secondary',
                      'border-b border-border-subtle',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
});

export default Table;
