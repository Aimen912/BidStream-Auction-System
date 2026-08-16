import { useState, useRef } from 'react';
import {
  DISPUTE_STATUS_OPTIONS,
  DISPUTE_PRIORITY_OPTIONS,
  DISPUTE_TYPE_OPTIONS,
} from '../../data/admin/ADMIN_DISPUTES_DATA';

// ─── Config maps ──────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-danger-100 text-danger',      dot: 'bg-danger'  },
  medium: { label: 'Medium', cls: 'bg-warning-100 text-warning',    dot: 'bg-warning' },
  low:    { label: 'Low',    cls: 'bg-bg-elevated text-text-muted',      dot: 'bg-navy-500'},
};

const STATUS_CONFIG = {
  open:      { label: 'Open',         cls: 'bg-danger-100 text-danger'                },
  reviewing: { label: 'Under Review', cls: 'bg-secondary-100 text-secondary-600' },
  resolved:  { label: 'Resolved',     cls: 'bg-success-100 text-success'             },
};

const TYPE_CONFIG = {
  payment:  { label: 'Payment',  cls: 'bg-accent-100 text-accent-600'    },
  delivery: { label: 'Delivery', cls: 'bg-secondary-100 text-secondary-600' },
  product:  { label: 'Product',  cls: 'bg-violet/10 text-violet-light'     },
  fraud:    { label: 'Fraud',    cls: 'bg-danger-100 text-danger'         },
  other:    { label: 'Other',    cls: 'bg-bg-elevated text-text-muted'        },
};

// ─── Shared select helper ─────────────────────────────────────────────────────

function SelectFilter({ value, onChange, options }) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none cursor-pointer rounded-xl border border-border bg-bg-card pl-3 pr-8 text-sm font-medium text-text-secondary outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 hover:border-border">
        {options.map(({ value: v, label }) => <option key={v} value={v}>{label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

// ─── View Case Modal ──────────────────────────────────────────────────────────

function ViewCaseModal({ dispute, onClose }) {
  if (!dispute) return null;
  const pc = PRIORITY_CONFIG[dispute.priority] ?? PRIORITY_CONFIG.low;
  const sc = STATUS_CONFIG[dispute.status]     ?? STATUS_CONFIG.open;
  const tc = TYPE_CONFIG[dispute.type]         ?? TYPE_CONFIG.other;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-modal flex flex-col max-h-[90vh] motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-base font-bold text-text-primary">Case Details</h3>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold', tc.cls].join(' ')}>{tc.label}</span>
            <span className={['inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', pc.cls].join(' ')}>
              <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')}/>{pc.label}
            </span>
            <span className={['rounded-full px-2.5 py-1 text-xs font-semibold', sc.cls].join(' ')}>{sc.label}</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Subject</p>
            <p className="mt-0.5 text-sm font-bold text-text-primary">{dispute.subject}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Case ID',    value: dispute.id },
              { label: 'Assigned',   value: dispute.assignedTo },
              { label: 'Buyer',      value: dispute.buyer || '—' },
              { label: 'Seller',     value: dispute.seller || '—' },
              { label: 'Created',    value: dispute.createdAt },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-bg-surface p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className="mt-0.5 text-xs font-bold text-text-primary break-all">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 border-t border-border-subtle px-5 py-3">
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-primary-900 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Assign Moderator Modal ───────────────────────────────────────────────────

const MODERATORS = ['Admin', 'Moderator A', 'Moderator B', 'Moderator C'];

function AssignModeratorModal({ dispute, onAssign, onClose }) {
  const [selected, setSelected] = useState(dispute?.assignedTo || 'Admin');
  if (!dispute) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">Assign Moderator</h3>
            <p className="text-xs text-text-muted truncate max-w-[220px]">{dispute.subject}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated focus-visible:outline-none">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Select Moderator</label>
            <div className="relative">
              <select value={selected} onChange={(e) => setSelected(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-bg-card pl-3.5 pr-9 text-sm text-text-primary outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20 cursor-pointer">
                {MODERATORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-secondary hover:bg-bg-surface focus-visible:outline-none">
              Cancel
            </button>
            <button type="button" onClick={() => { onAssign(dispute.id, selected); onClose(); }}
              className="flex-1 rounded-xl bg-secondary-600 py-2.5 text-sm font-semibold text-white hover:bg-secondary-500 focus-visible:outline-none">
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({ dispute, onView, onAssign, onResolve }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const btnRef = useRef(null);

  function toggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuH = 160;
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < menuH) {
        setMenuStyle({ bottom: window.innerHeight - rect.top, right: window.innerWidth - rect.right });
      } else {
        setMenuStyle({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      }
    }
    setOpen((v) => !v);
  }

  return (
    <div className="relative">
      <button ref={btnRef} type="button" onClick={toggleOpen}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-text-secondary transition-colors duration-150 hover:border-secondary-600/40 hover:text-secondary-600 focus-visible:outline-none">
        Actions
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={open ? 'rotate-180' : ''} aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul className="fixed z-50 w-36 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown motion-safe:animate-scale-in motion-safe:animate-fade-in" style={menuStyle}>
            <li>
              <button type="button" onClick={() => { setOpen(false); onView(dispute); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
                View Case
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setOpen(false); onAssign(dispute); }}
                className="flex w-full items-center px-4 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-surface">
                Assign Moderator
              </button>
            </li>
            {dispute.status !== 'resolved' && (
              <>
                <li><div className="my-1 border-t border-border-subtle" /></li>
                <li>
                  <button type="button" onClick={() => { onResolve(dispute.id); setOpen(false); }}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-success transition-colors duration-150 hover:bg-success-100">
                    Resolve Case
                  </button>
                </li>
              </>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── Mobile dispute card ──────────────────────────────────────────────────────

function DisputeCard({ dispute, onResolve, onView, onAssign }) {
  const pc = PRIORITY_CONFIG[dispute.priority] ?? PRIORITY_CONFIG.low;
  const sc = STATUS_CONFIG[dispute.status]     ?? STATUS_CONFIG.open;
  const tc = TYPE_CONFIG[dispute.type]         ?? TYPE_CONFIG.other;
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 shadow-card transition-all duration-150 hover:shadow-dropdown">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="font-mono rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">{dispute.id}</span>
            <span className={['rounded-full px-2 py-0.5 text-[10px] font-semibold', tc.cls].join(' ')}>{tc.label}</span>
            <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', pc.cls].join(' ')}>
              <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')} />{pc.label}
            </span>
          </div>
          <p className="text-sm font-bold text-text-primary leading-snug">{dispute.subject}</p>
        </div>
        <span className={['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', sc.cls].join(' ')}>{sc.label}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-bg-surface p-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted">Buyer</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[8px] font-bold text-white">{dispute.buyerAvatar}</span>
            <p className="text-xs font-semibold text-text-secondary truncate">{dispute.buyer}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">Seller</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-600 to-yellow-400 text-[8px] font-bold text-white">{dispute.sellerAvatar}</span>
            <p className="text-xs font-semibold text-text-secondary truncate">{dispute.seller}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted">Assigned: <span className="font-medium text-text-secondary">{dispute.assignedTo}</span></p>
          <p className="text-[10px] text-text-muted">{dispute.createdAt}</p>
        </div>
        <ActionMenu dispute={dispute} onView={onView} onAssign={onAssign} onResolve={onResolve} />
      </div>
    </div>
  );
}

// ─── DisputesTable ────────────────────────────────────────────────────────────

const HEADERS = ['Case ID', 'Buyer', 'Seller', 'Type', 'Subject', 'Priority', 'Status', 'Assigned', 'Actions'];

function DisputesTable({ disputes, onResolve, onAssignModerator, filters, onChange, onClear, hasActive }) {
  const [viewTarget,   setViewTarget]   = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);

  function handleAssign(id, moderator) {
    onAssignModerator?.(id, moderator);
    // Update local state too
  }

  return (
    <>
      {viewTarget   && <ViewCaseModal       dispute={viewTarget}   onClose={() => setViewTarget(null)} />}
      {assignTarget && <AssignModeratorModal dispute={assignTarget} onAssign={handleAssign} onClose={() => setAssignTarget(null)} />}

      <div className="flex flex-col gap-5">

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-card lg:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="search" value={filters.search} onChange={(e) => onChange('search', e.target.value)}
              placeholder="Search by ID, subject, buyer or seller…"
              className="h-10 w-full rounded-xl border border-border bg-bg-card pl-9 pr-9 text-sm placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20" />
            {filters.search && (
              <button type="button" onClick={() => onChange('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {/* Dropdowns + clear */}
          <div className="flex flex-wrap items-center gap-2">
            <SelectFilter value={filters.status}   onChange={(v) => onChange('status', v)}   options={DISPUTE_STATUS_OPTIONS}   />
            <SelectFilter value={filters.priority} onChange={(v) => onChange('priority', v)} options={DISPUTE_PRIORITY_OPTIONS} />
            <SelectFilter value={filters.type}     onChange={(v) => onChange('type', v)}     options={DISPUTE_TYPE_OPTIONS}     />
            {hasActive && (
              <button type="button" onClick={onClear}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-border px-3.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-danger/40 hover:bg-danger-100 hover:text-danger focus-visible:outline-none">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {disputes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card px-8 py-20 text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary-100/20 to-bg-card" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-card shadow-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <p className="text-base font-bold text-text-primary">No disputes found</p>
          <p className="mt-1 text-sm text-text-muted">Try adjusting your filters.</p>
        </div>
      )}

      {/* Desktop table */}
      {disputes.length > 0 && (
        <div className="hidden rounded-2xl border border-border bg-bg-card shadow-card md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-bg-surface">
                  {HEADERS.map((h) => (
                    <th key={h} scope="col"
                      className="border-b border-border-subtle px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disputes.map((d, i) => {
                  const pc = PRIORITY_CONFIG[d.priority] ?? PRIORITY_CONFIG.low;
                  const sc = STATUS_CONFIG[d.status]     ?? STATUS_CONFIG.open;
                  const tc = TYPE_CONFIG[d.type]         ?? TYPE_CONFIG.other;
                  return (
                    <tr key={d.id}
                      className={['transition-colors duration-150 hover:bg-bg-surface', i !== disputes.length - 1 ? 'border-b border-border-subtle' : ''].join(' ')}>
                      {/* Case ID */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-bg-elevated px-2 py-0.5 font-mono text-xs font-semibold text-text-secondary">{d.id}</span>
                      </td>
                      {/* Buyer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-[10px] font-bold text-white">{d.buyerAvatar}</span>
                          <span className="text-sm text-text-secondary">{d.buyer}</span>
                        </div>
                      </td>
                      {/* Seller */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-600 to-yellow-400 text-[10px] font-bold text-white">{d.sellerAvatar}</span>
                          <span className="text-sm text-text-secondary">{d.seller}</span>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-5 py-4">
                        <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold', tc.cls].join(' ')}>{tc.label}</span>
                      </td>
                      {/* Subject */}
                      <td className="px-5 py-4">
                        <p className="max-w-[200px] truncate text-sm font-semibold text-text-primary">{d.subject}</p>
                      </td>
                      {/* Priority */}
                      <td className="px-5 py-4">
                        <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', pc.cls].join(' ')}>
                          <span className={['h-1.5 w-1.5 rounded-full', pc.dot].join(' ')} />{pc.label}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={['rounded-full px-2.5 py-1 text-xs font-semibold', sc.cls].join(' ')}>{sc.label}</span>
                      </td>
                      {/* Assigned */}
                      <td className="px-5 py-4 text-sm text-text-muted">{d.assignedTo}</td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <ActionMenu dispute={d} onView={setViewTarget} onAssign={setAssignTarget} onResolve={onResolve} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      {disputes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {disputes.map((d) => (
            <DisputeCard key={d.id} dispute={d} onResolve={onResolve} onView={setViewTarget} onAssign={setAssignTarget} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default DisputesTable;
