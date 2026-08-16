import { useState } from 'react';

// ─── MessageComposer ──────────────────────────────────────────────────────────

/**
 * Message input bar — Enter to send, Shift+Enter for newline.
 *
 * @param {function} onSend – (text: string) => void
 */
function MessageComposer({ onSend }) {
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="shrink-0 border-t border-border-subtle bg-bg-card px-4 py-3">
      <div className={[
        'flex items-end gap-2 rounded-2xl border bg-bg-surface px-3 py-2',
        'transition-all duration-150',
        'focus-within:border-secondary-600 focus-within:bg-bg-card focus-within:ring-2 focus-within:ring-secondary-500/20',
        'border-border',
      ].join(' ')}>

        {/* Emoji — UI only */}
        <button type="button" aria-label="Add emoji"
          className="mb-0.5 shrink-0 text-text-muted transition-colors duration-150 hover:text-text-secondary focus-visible:outline-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 13s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          aria-label="Message input"
          className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          style={{ maxHeight: '120px', overflowY: 'auto' }}
        />

        {/* Attachment — UI only */}
        <button type="button" aria-label="Attach file"
          className="mb-0.5 shrink-0 text-text-muted transition-colors duration-150 hover:text-text-secondary focus-visible:outline-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Send */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
          className={[
            'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
            text.trim()
              ? 'bg-secondary-600 text-white shadow-card hover:bg-secondary-500 hover:-translate-y-0.5'
              : 'cursor-not-allowed bg-navy-100 text-text-muted',
          ].join(' ')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <p className="mt-1.5 text-center text-[10px] text-text-muted">
        Press <kbd className="rounded bg-bg-elevated px-1 font-mono text-[10px]">Enter</kbd> to send ·{' '}
        <kbd className="rounded bg-bg-elevated px-1 font-mono text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

export default MessageComposer;
