import { useEffect, useRef } from 'react';
import { SELLER_ID }         from '../../data/seller/SELLER_MESSAGES_DATA';
import MessageComposer       from './MessageComposer';

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, buyerGradient, buyerAvatar }) {
  const isMine = message.sender === SELLER_ID;

  return (
    <div className={['flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row'].join(' ')}>
      {/* Buyer avatar — only for received */}
      {!isMine && (
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${buyerGradient} text-[10px] font-bold text-white`}>
          {buyerAvatar}
        </span>
      )}

      {/* Bubble */}
      <div className={['max-w-[72%] flex flex-col gap-1', isMine ? 'items-end' : 'items-start'].join(' ')}>
        <div className={[
          'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card',
          isMine
            ? 'rounded-br-sm bg-secondary-600 text-white'
            : 'rounded-bl-sm border border-border-subtle bg-bg-card text-text-primary',
        ].join(' ')}>
          {message.text}
        </div>
        <span className="px-1 text-[10px] text-text-muted">{message.timestamp}</span>
      </div>
    </div>
  );
}

// ─── MessageWindow ────────────────────────────────────────────────────────────

/**
 * Right-side chat panel.
 *
 * @param {object}   conversation  – active conversation record
 * @param {function} onSend        – (conversationId, text) => void
 * @param {function} onBack        – () => void — mobile back
 */
function MessageWindow({ conversation, onSend, onBack }) {
  const { buyerName, buyerAvatar, buyerGradient, auctionTitle, online, messages } = conversation;
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border-subtle bg-bg-card px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Back button — mobile only */}
          {onBack && (
            <button type="button" onClick={onBack} aria-label="Back to conversations"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated lg:hidden focus-visible:outline-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Avatar */}
          <div className="relative shrink-0">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${buyerGradient} text-xs font-bold text-white shadow-card`}>
              {buyerAvatar}
            </span>
            {online && (
              <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-success" />
              </span>
            )}
          </div>

          {/* Buyer info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary">{buyerName}</p>
            <p className={['text-xs', online ? 'text-success' : 'text-text-muted'].join(' ')}>
              {online ? 'Online now' : 'Offline'}
            </p>
          </div>

          {/* Auction context chip */}
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 py-2 sm:flex">
            <div className={`h-5 w-5 shrink-0 rounded-lg bg-gradient-to-br ${buyerGradient}`} />
            <p className="max-w-[140px] truncate text-xs font-medium text-text-secondary">{auctionTitle}</p>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
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
              buyerGradient={buyerGradient}
              buyerAvatar={buyerAvatar}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* ── Composer ── */}
      <MessageComposer onSend={(text) => onSend(conversation.id, text)} />
    </div>
  );
}

export default MessageWindow;
