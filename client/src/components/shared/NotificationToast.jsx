import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPE_CONFIG = {
  bid_placed:          { color: 'bg-success',       icon: '⚡' },
  outbid:              { color: 'bg-danger',         icon: '📉' },
  auction_won:         { color: 'bg-success',        icon: '🏆' },
  auction_lost:        { color: 'bg-navy-500',       icon: '❌' },
  ending_soon:         { color: 'bg-warning',        icon: '⏰' },
  auction_submitted:   { color: 'bg-secondary-600',  icon: '📋' },
  auction_approved:    { color: 'bg-success',        icon: '✅' },
  auction_rejected:    { color: 'bg-danger',         icon: '🚫' },
  new_bid:             { color: 'bg-accent-600',     icon: '💰' },
  auction_sold:        { color: 'bg-success',        icon: '🎉' },
  admin_new_auction:   { color: 'bg-primary-700',    icon: '🔔' },
  new_message:         { color: 'bg-secondary-600',  icon: '💬' },
  payment:             { color: 'bg-accent-600',     icon: '💳' },
  order_shipped:       { color: 'bg-secondary-500',  icon: '📦' },
  order_completed:     { color: 'bg-success',        icon: '✔️' },
  account_registered:  { color: 'bg-secondary-600',  icon: '👋' },
  system:              { color: 'bg-primary-700',    icon: '⚙️' },
};

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }) {
  const navigate = useNavigate();
  // exiting drives the slide-out transition
  const [exiting, setExiting] = useState(false);
  const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.system;

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => startExit(), 5000);
    return () => clearTimeout(t);
  }, [toast.id]);

  function startExit() {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }

  function handleClick() {
    startExit();
    setTimeout(() => { if (toast.link) navigate(toast.link); }, 250);
  }

  function handleClose(e) {
    e.stopPropagation();
    startExit();
  }

  return (
    <div
      onClick={handleClick}
      className={[
        // Base layout
        'flex w-80 cursor-pointer items-start gap-3 rounded-2xl border border-border bg-bg-card p-4 shadow-dropdown',
        // Entrance: CSS keyframe slide-up (respects reduced-motion via global rule in index.css)
        'motion-safe:animate-slide-up',
        // Exit: JS-driven slide-right + fade
        'transition-all duration-300',
        exiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
      ].join(' ')}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <span className={['mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm', cfg.color].join(' ')}>
        {cfg.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-text-primary leading-snug">{toast.title}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-text-muted leading-relaxed">{toast.description}</p>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Dismiss notification"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-secondary focus-visible:outline-none"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Toast container ──────────────────────────────────────────────────────────

/**
 * Renders a stack of toast notifications fixed to the bottom-right.
 *
 * @param {Array}    toasts     – [{ id, type, title, description, link }]
 * @param {function} onDismiss  – (id) => void
 */
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export default ToastContainer;
