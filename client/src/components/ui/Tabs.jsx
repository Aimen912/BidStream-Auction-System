import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

// ─── Style Maps ──────────────────────────────────────────────────────────────

const variantStyles = {
  line: {
    list: 'border-b border-border',
    active:
      'border-b-2 border-primary-600 text-primary-400 font-semibold',
    inactive:
      'border-b-2 border-transparent text-text-muted hover:text-text-secondary hover:border-primary-600/30',
  },

  pills: {
    list: 'gap-2',
    active:
      'bg-primary-600 text-white shadow-sm',
    inactive:
      'bg-bg-elevated text-text-secondary hover:bg-navy-100',
  },
};

const orientationStyles = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
};

// ─── Tabs ────────────────────────────────────────────────────────────────────

/**
 * Tabs
 *
 * Accessible tab component following the WAI-ARIA Authoring Practices.
 *
 * @param {Array<{
 *   id:string,
 *   label:string,
 *   content:React.ReactNode,
 *   disabled?:boolean,
 *   icon?:React.ReactNode
 * }>} tabs
 *
 * @param {string} activeTab
 * @param {string} defaultTab
 * @param {(id:string)=>void} onChange
 * @param {'line'|'pills'} variant
 * @param {'horizontal'|'vertical'} orientation
 * @param {boolean} fullWidth
 * @param {boolean} keepMounted
 * @param {string} className
 * @param {string} ariaLabel
 */

const Tabs = forwardRef(function Tabs(
  {
    tabs = [],
    activeTab,
    defaultTab,
    onChange,
    variant = 'line',
    orientation = 'horizontal',
    fullWidth = false,
    keepMounted = false,
    className = '',
    ariaLabel = 'Tabs',
  },
  ref
) {
  const isControlled = activeTab !== undefined;
  const generatedId = useId();

  const firstEnabledTab =
    tabs.find((tab) => !tab.disabled)?.id;

  const [internalTab, setInternalTab] = useState(
    defaultTab ?? firstEnabledTab
  );

  const currentTab =
    isControlled ? activeTab : internalTab;

  const tabRefs = useRef([]);

  // ─── Effects ──────────────────────────────────────────────────────────────

  // Keep refs array in sync with tabs length
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  // Sync internal state when tabs change or when switching to controlled mode
  useEffect(() => {
    if (!tabs.length || isControlled) return;

    // If current internal tab no longer exists, fall back to default or first enabled
    if (!tabs.some((tab) => tab.id === internalTab)) {
      setInternalTab(defaultTab ?? firstEnabledTab);
    }
  }, [tabs, internalTab, defaultTab, isControlled, firstEnabledTab]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function selectTab(id) {
    if (!isControlled) {
      setInternalTab(id);
    }

    onChange?.(id);
  }

  function focusTab(index) {
    const tab = tabs[index];

    if (!tab || tab.disabled) return;

    const ref = tabRefs.current[index];
    if (ref) {
      ref.focus();
    }

    selectTab(tab.id);
  }

  function findNext(index) {
    // If no enabled tabs exist, return current index
    if (firstEnabledTab === undefined) return index;

    let next = index;

    do {
      next = (next + 1) % tabs.length;
    } while (tabs[next].disabled && next !== index);

    return next;
  }

  function findPrevious(index) {
    // If no enabled tabs exist, return current index
    if (firstEnabledTab === undefined) return index;

    let prev = index;

    do {
      prev = (prev - 1 + tabs.length) % tabs.length;
    } while (tabs[prev].disabled && prev !== index);

    return prev;
  }

  function firstEnabled() {
    return tabs.findIndex(
      (tab) => !tab.disabled
    );
  }

  function lastEnabled() {
    for (let i = tabs.length - 1; i >= 0; i--) {
      if (!tabs[i].disabled) {
        return i;
      }
    }

    return 0;
  }

  function handleKeyDown(e, index) {
    // If no enabled tabs exist, ignore keyboard navigation
    if (firstEnabledTab === undefined) return;

    const horizontal =
      orientation === 'horizontal';

    switch (e.key) {
      case 'ArrowRight':
        if (!horizontal) return;

        e.preventDefault();
        focusTab(findNext(index));
        break;

      case 'ArrowLeft':
        if (!horizontal) return;

        e.preventDefault();
        focusTab(findPrevious(index));
        break;

      case 'ArrowDown':
        if (horizontal) return;

        e.preventDefault();
        focusTab(findNext(index));
        break;

      case 'ArrowUp':
        if (horizontal) return;

        e.preventDefault();
        focusTab(findPrevious(index));
        break;

      case 'Home':
        e.preventDefault();
        focusTab(firstEnabled());
        break;

      case 'End':
        e.preventDefault();
        focusTab(lastEnabled());
        break;

      default:
        break;
    }
  }

  // ─── Early Return ────────────────────────────────────────────────────────

  if (!tabs.length) {
    return null;
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const styles =
    variantStyles[variant] ??
    variantStyles.line;

  const wrapperClasses = [
    'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={wrapperClasses}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={[
          'flex',
          orientationStyles[orientation] ?? orientationStyles.horizontal,
          styles.list,
          fullWidth ? 'w-full justify-between' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {tabs.map((tab, index) => {
          const active = currentTab === tab.id;
          const isDisabled = tab.disabled;

          const tabId = `${generatedId}-tab-${tab.id}`;
          const panelId = `${generatedId}-panel-${tab.id}`;

          const buttonClasses = [
            'px-5',
            'py-3',
            'text-sm',
            'font-medium',
            'transition-all duration-150',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-[#121936]',
            'focus-visible:ring-primary-600/50',
            fullWidth ? 'flex-1' : '',
            variant === 'pills' ? 'rounded-lg' : '',
            active
              ? `${styles.active} cursor-default`
              : `${styles.inactive} cursor-pointer`,
            isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              disabled={isDisabled}
              aria-disabled={isDisabled || undefined}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={
                active && !isDisabled
                  ? 0
                  : -1
              }
              className={buttonClasses}
              onClick={() => {
                if (!isDisabled) {
                  selectTab(tab.id);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.icon ? (
                <div className="flex items-center gap-2">
                  <span className="shrink-0">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
              ) : (
                tab.label
              )}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="mt-4">
        {tabs.map((tab) => {
          const active = currentTab === tab.id;

          const tabId = `${generatedId}-tab-${tab.id}`;
          const panelId = `${generatedId}-panel-${tab.id}`;

          if (keepMounted) {
            return (
              <div
                key={tab.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!active}
                tabIndex={active ? 0 : -1}
                className={[
                  'focus-visible:outline-none',
                  'transition-opacity duration-150',
                  active ? 'opacity-100' : 'opacity-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {tab.content}
              </div>
            );
          }

          return (
            active && (
              <div
                key={tab.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                tabIndex={0}
                className="focus-visible:outline-none transition-opacity duration-150 opacity-100"
              >
                {tab.content}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;