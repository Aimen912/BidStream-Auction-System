// ─── EmptyConversation ────────────────────────────────────────────────────────

/**
 * Placeholder shown on the right panel when no conversation is selected.
 *
 * @param {function} onNew – () => void — opens the New Conversation modal
 */
function EmptyConversation({ onNew }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center motion-safe:animate-slide-up">

      {/* Illustration */}
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-100/30 to-primary-900/20 opacity-60" />
        <div className="absolute inset-5 rounded-full bg-gradient-to-br from-bg-elevated to-bg-surface" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card shadow-dropdown">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>

      <h3 className="mb-2 text-lg font-bold text-text-primary">No Conversation Selected</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-muted">
        Choose a conversation from the list or start a new one.
      </p>

      {/* Start Conversation CTA */}
      {onNew && (
        <button
          type="button"
          onClick={onNew}
          className={[
            'inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5',
            'text-sm font-semibold text-white shadow-card',
            'transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
          ].join(' ')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
          Start Conversation
        </button>
      )}
    </div>
  );
}

export default EmptyConversation;
