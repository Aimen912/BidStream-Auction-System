import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput  from './MessageInput';
import { MY_ID }     from '../../data/messages/MESSAGES_DATA';

// ─── ChatWindow ───────────────────────────────────────────────────────────────

/**
 * Right-side chat panel for an active conversation.
 *
 * @param {object}   conversation  – active conversation record
 * @param {function} onSend        – (conversationId, text) => void
 * @param {function} onBack        – () => void — mobile back button
 */
function ChatWindow({ conversation, onSend, onBack }) {
  const { participant, auctionTitle, auctionGradient, messages } = conversation;
  const bottomRef = useRef(null);

  // Scroll to latest message whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border-subtle bg-bg-card px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Back button — visible on mobile / tablet */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated lg:hidden focus-visible:outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Avatar */}
          <div className="relative shrink-0">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${auctionGradient} text-xs font-bold text-white shadow-card`}>
              {participant.avatar}
            </span>
            {participant.online && (
              <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-success" />
              </span>
            )}
          </div>

          {/* Participant info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-text-primary">{participant.name}</p>
              <span className={[
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                participant.role === 'Seller'
                  ? 'bg-secondary-100 text-secondary-600'
                  : 'bg-accent-100 text-accent-600',
              ].join(' ')}>
                {participant.role}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {participant.online ? (
                <span className="flex items-center gap-1 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Online now
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>

          {/* Auction context chip */}
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 py-2 sm:flex">
            <div className={`h-6 w-6 shrink-0 rounded-lg bg-gradient-to-br ${auctionGradient}`} />
            <p className="max-w-[140px] truncate text-xs font-medium text-text-secondary">{auctionTitle}</p>
          </div>

          {/* More options — UI only */}
          <button
            type="button"
            aria-label="More options"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-secondary focus-visible:outline-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="5"  r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Date separator */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-bg-elevated" />
          <span className="shrink-0 text-[10px] font-medium text-text-muted">Today</span>
          <div className="h-px flex-1 bg-bg-elevated" />
        </div>

        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              senderAvatar={msg.senderId === MY_ID ? 'Me' : participant.avatar}
              senderGradient={auctionGradient}
            />
          ))}
        </div>

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <MessageInput onSend={(text) => onSend(conversation.id, text)} />
    </div>
  );
}

export default ChatWindow;
