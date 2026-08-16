import { useState, useRef, useEffect } from 'react';
import { SORT_OPTIONS } from './AUCTIONS_DATA';

// ─── SortDropdown ─────────────────────────────────────────────────────────────

/**
 * Custom dropdown for sort selection.
 *
 * @param {string}   value      – current sort key
 * @param {function} onChange   – (sortKey: string) => void
 */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? 'Sort';

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
          open
            ? 'border-secondary-600 bg-secondary-600/5 text-secondary-600'
            : 'border-border bg-bg-card text-text-secondary hover:border-border',
        ].join(' ')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8"  y1="6"  x2="21" y2="6"  />
          <line x1="8"  y1="12" x2="21" y2="12" />
          <line x1="8"  y1="18" x2="21" y2="18" />
          <line x1="3"  y1="6"  x2="3.01" y2="6"  />
          <line x1="3"  y1="12" x2="3.01" y2="12" />
          <line x1="3"  y1="18" x2="3.01" y2="18" />
        </svg>
        {activeLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={['transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-bg-card py-1 shadow-dropdown"
        >
          {SORT_OPTIONS.map(({ value: optVal, label }) => {
            const isSelected = value === optVal;
            return (
              <li
                key={optVal}
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(optVal); setOpen(false); }}
                className={[
                  'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150',
                  isSelected
                    ? 'bg-secondary-600/5 font-semibold text-secondary-600'
                    : 'text-text-secondary hover:bg-bg-surface',
                ].join(' ')}
              >
                {label}
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SortDropdown;
