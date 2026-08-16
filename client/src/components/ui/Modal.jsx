import { forwardRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

// ─── Style Maps ──────────────────────────────────────────────────────────────

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

/**
 * Modal
 *
 * Renders into document.body via React Portal.
 *
 * @param {boolean}          open              – controls visibility
 * @param {function}         onClose           – called when modal should close
 * @param {string}           title             – optional header title
 * @param {React.ReactNode}  children          – modal body content
 * @param {React.ReactNode}  footer            – optional footer content
 * @param {'sm'|'md'|'lg'|'xl'} size          – max-width preset; default "md"
 * @param {boolean}          closeOnOverlay    – close on backdrop click; default true
 * @param {boolean}          showCloseButton   – show × in header; default true
 * @param {string}           className         – merged onto the modal container
 */
const Modal = forwardRef(function Modal(
  {
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
    showCloseButton = true,
    className = '',
  },
  ref
) {
  const titleId = useId();

  // ── Escape key handler ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ── Early exit ─────────────────────────────────────────────────────────────
  if (!open) return null;

  // ── Classes ────────────────────────────────────────────────────────────────
  const containerClasses = [
    // Modals sit at L5 elevation — one step above cards (bg-bg-card)
    'bg-bg-elevated',
    'border border-border',
    'rounded-xl',
    'shadow-modal',
    'w-full',
    'mx-4',
    'motion-safe:animate-scale-in',
    sizeStyles[size] ?? sizeStyles.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ── Overlay click ──────────────────────────────────────────────────────────
  function handleOverlayClick() {
    if (closeOnOverlay) onClose?.();
  }

  // Stop clicks inside the modal from bubbling to the overlay
  function handleContainerClick(e) {
    e.stopPropagation();
  }

  // ── Markup ─────────────────────────────────────────────────────────────────
  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 motion-safe:animate-fade-in"
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={containerClasses}
        onClick={handleContainerClick}
      >

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">

            {title && (
              <h2
                id={titleId}
                className="text-lg font-semibold text-text-primary leading-snug"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label="Close modal"
                className={[
                  'ml-auto flex items-center justify-center',
                  'w-8 h-8 rounded-lg',
                  'text-text-muted hover:text-text-secondary hover:bg-bg-elevated',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/50',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* × icon — inline SVG, no external dependency */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
});

export default Modal;
