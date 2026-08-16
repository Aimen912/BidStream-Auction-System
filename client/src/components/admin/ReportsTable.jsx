import { useState, useRef } from 'react';
import {
  REPORT_STATUS_OPTIONS,
  REPORT_TYPE_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
} from '../../data/admin/ADMIN_REPORTS_DATA';

// ─── Badge configs ────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-danger/10 text-danger',    dot: 'bg-danger'  },
  medium: { label: 'Medium', cls: 'bg-warning/10 text-warning',  dot: 'bg-warning' },
  low:    { label: 'Low',    cls: 'bg-bg-elevated text-text-muted', dot: 'bg-border' },
};

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-danger/10 text-danger'              },
  reviewing: { label: 'In Review', cls: 'bg-primary-600/12 text-primary-300'    },
  resolved:  { label: 'Resolved',  cls: 'bg-success/10 text-success'            },
};

const TYPE_CONFIG = {
  user:    { label: 'User',    cls: 'bg-violet/10 text-violet-light'         },
  auction: { label: 'Auction', cls: 'bg-primary-600/12 text-primary-300'     },
  payment: { label: 'Payment', cls: 'bg-auction/10 text-auction'             },
  other:   { label: 'Other',   cls: 'bg-bg-elevated text-text-muted'         },
};

// ─── Shared select ────────────────────────────────────────────────────────────

function SelectFilter({ value, onChange, options }) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-7 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-primary-600/50 focus:ring-2 focus:ring-primary-600/15"
      >
        {options.map(({ value: v, label }) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-muted"
        width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─── View Report Modal ────────────────────────────────────────────────────────

function ViewReportModal({ report, onClose }) {
  if (!report) return null;
  const pc = PRIORITY_CONFIG[report.priority] ?? PRIORITY_CONFIG.low;
  const sc = STATUS_CONFIG[report.status]     ?? STATUS_CONFIG.pending;
  const tc = TYPE_CONFIG[report.type]         ?? TYPE_CONFIG.other;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-base font-bold text-text-primary">Report Details</h3>
          <button
            type="button" onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', tc.cls].join(' ')}>{tc.label}</span>
            <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', pc.cls].join(' ')}>
              <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')} />{pc.label}
            </span>
            <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', sc.cls].join(' ')}>{sc.label}</span>
          </div>

          {/* Title */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Title</p>
            <p className="mt-0.5 text-sm font-bold text-text-primary">{report.title}</p>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Report ID',   value: report.id           },
              { label: 'Reported By', value: report.reportedBy   || '—' },
              { label: 'Item',        value: report.reportedItem || report.category || '—' },
              { label: 'Seller',      value: report.seller       || '—' },
              { label: 'Date',        value: report.createdAt                              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-bg-surface p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className="mt-0.5 break-all text-xs font-bold text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border-subtle px-5 py-3">
          <button
            type="button" onClick={onClose}
            className="w-full rounded-xl bg-bg-elevated py-2.5 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-bg-surface focus-visible:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({ report, onView, onResolve, onEscalate }) {
  const [open,      setOpen]      = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);

  function toggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 140) {
        setMenuStyle({ bottom: window.innerHeight - rect.top, right: window.innerWidth - rect.right });
      } else {
        setMenuStyle({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      }
    }
    setOpen((v) => !v);
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        className="flex h-7 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary transition-colors duration-150 hover:border-primary-600/30 hover:text-primary-300 focus-visible:outline-none"
      >
        Actions
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round"
          className={open ? 'rotate-180' : ''}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            className="fixed z-50 w-36 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown motion-safe:animate-fade-in motion-safe:animate-scale-in"
            style={menuStyle}
          >
            <li>
              <button
                type="button"
                onClick={() => { setOpen(false); onView(report); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface"
              >
                View Report
              </button>
            </li>
            {report.status !== 'resolved' && (
              <li>
                <button
                  type="button"
                  onClick={() => { onResolve(report.id); setOpen(false); }}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-success transition-colors duration-150 hover:bg-success/8"
                >
                  Mark Resolved
                </button>
              </li>
            )}
            <li><div className="my-1 border-t border-border-subtle" /></li>
            <li>
              <button
                type="button"
                onClick={() => { onEscalate(report.id); setOpen(false); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-warning transition-colors duration-150 hover:bg-warning/8"
              >
                Escalate
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Mobile report card ───────────────────────────────────────────────────────

function ReportCard({ report, onResolve, onView, onEscalate }) {
  const pc = PRIORITY_CONFIG[report.priority] ?? PRIORITY_CONFIG.low;
  const sc = STATUS_CONFIG[report.status]     ?? STATUS_CONFIG.pending;
  const tc = TYPE_CONFIG[report.type]         ?? TYPE_CONFIG.other;

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', tc.cls].join(' ')}>{tc.label}</span>
            <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', pc.cls].join(' ')}>
              <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')} />{pc.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-text-primary leading-snug">{report.title}</p>
        </div>
        <span className={['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', sc.cls].join(' ')}>{sc.label}</span>
      </div>
      <div className="mt-1.5 text-xs text-text-muted">
        <span className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px]">{report.id}</span>
        {' · '}By <span className="font-medium text-text-secondary">{report.reportedBy}</span>
        {' · '}{report.reportedItem}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted">{report.createdAt}</span>
        <ActionMenu report={report} onView={onView} onResolve={onResolve} onEscalate={onEscalate || (() => {})} />
      </div>
    </div>
  );
}

// ─── ReportsTable ─────────────────────────────────────────────────────────────

const HEADERS = ['Report ID', 'Type', 'Title', 'Reported By', 'Priority', 'Status', 'Date', 'Actions'];

/**
 * @param {Array}    reports     – already-filtered report records from parent
 * @param {number}   totalCount  – total unfiltered count (for result label)
 * @param {function} onResolve   – (id) => void
 * @param {function} onEscalate  – (id) => void
 * @param {object}   filters     – { search, status, type, priority }
 * @param {function} onChange    – (key, value) => void
 * @param {function} onClear
 * @param {boolean}  hasActive
 */
function ReportsTable({ reports, totalCount, onResolve, onEscalate, filters, onChange, onClear, hasActive }) {
  const [viewTarget, setViewTarget] = useState(null);

  return (
    <>
      {viewTarget && <ViewReportModal report={viewTarget} onClose={() => setViewTarget(null)} />}

      <div className="flex flex-col gap-4">

        {/* ── Unified filter bar — single source of truth ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => onChange('search', e.target.value)}
                placeholder="Search by title or reporter…"
                className="h-9 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-primary-600/50 focus:ring-2 focus:ring-primary-600/15"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => onChange('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter dropdowns + clear */}
            <div className="flex flex-wrap items-center gap-2">
              <SelectFilter value={filters.status}   onChange={(v) => onChange('status',   v)} options={REPORT_STATUS_OPTIONS}   />
              <SelectFilter value={filters.type}     onChange={(v) => onChange('type',     v)} options={REPORT_TYPE_OPTIONS}     />
              <SelectFilter value={filters.priority} onChange={(v) => onChange('priority', v)} options={REPORT_PRIORITY_OPTIONS} />
              {hasActive && (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/30 hover:bg-danger/8 hover:text-danger focus-visible:outline-none"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Result count — lives inside the filter bar, not as a separate element */}
          <p className="text-xs text-text-muted">
            {hasActive ? (
              <>
                <span className="font-semibold text-text-primary">{reports.length}</span>
                {' of '}
                <span className="font-semibold text-text-primary">{totalCount ?? reports.length}</span>
                {' reports'}
              </>
            ) : (
              <>
                <span className="font-semibold text-text-primary">{reports.length}</span>
                {' report'}{reports.length !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* ── Empty state ── */}
        {reports.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-16 text-center">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-text-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-text-primary">No reports found</p>
            <p className="mt-1 text-xs text-text-muted">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* ── Desktop table ── */}
        {reports.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-bg-surface">
                    {HEADERS.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="border-b border-border-subtle px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {reports.map((r) => {
                    const pc = PRIORITY_CONFIG[r.priority] ?? PRIORITY_CONFIG.low;
                    const sc = STATUS_CONFIG[r.status]     ?? STATUS_CONFIG.pending;
                    const tc = TYPE_CONFIG[r.type]         ?? TYPE_CONFIG.other;
                    return (
                      <tr
                        key={r.id}
                        className="transition-colors duration-150 hover:bg-bg-surface"
                      >
                        {/* Report ID */}
                        <td className="px-5 py-3">
                          <span className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px] font-semibold text-text-secondary">
                            {r.id}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3">
                          <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', tc.cls].join(' ')}>
                            {tc.label}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="px-5 py-3">
                          <p className="max-w-[200px] truncate text-sm font-semibold text-text-primary">
                            {r.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-text-muted">{r.reportedItem}</p>
                        </td>

                        {/* Reported By */}
                        <td className="px-5 py-3 text-sm text-text-secondary">{r.reportedBy}</td>

                        {/* Priority */}
                        <td className="px-5 py-3">
                          <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', pc.cls].join(' ')}>
                            <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')} />
                            {pc.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <span className={['rounded-full px-2 py-0.5 text-[11px] font-semibold', sc.cls].join(' ')}>
                            {sc.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3 text-xs text-text-muted">{r.createdAt}</td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <ActionMenu
                            report={r}
                            onView={setViewTarget}
                            onResolve={onResolve}
                            onEscalate={onEscalate || (() => {})}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Mobile cards ── */}
        {reports.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {reports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                onView={setViewTarget}
                onResolve={onResolve}
                onEscalate={onEscalate || (() => {})}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default ReportsTable;
