// ─── EmptyConversation ────────────────────────────────────────────────────────

/**
 * Placeholder shown on the right panel when no conversation is selected.
 */
function EmptyConversation() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">

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

      <h3 className="mb-2 text-lg font-bold text-text-primary">No conversation selected</h3>
      <p className="max-w-xs text-sm leading-relaxed text-text-muted">
        Choose a conversation from the list to start chatting with your buyers.
      </p>
    </div>
  );
}

export default EmptyConversation;
