import { useState } from 'react';

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({ conversation, isActive, onClick }) {
  const { participant, auctionTitle, messages, unread, auctionGradient } = conversation;
  const lastMsg = messages[messages.length - 1];

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
        isActive
          ? 'bg-secondary-600/10 border border-secondary-600/20'
          : 'hover:bg-bg-surface border border-transparent',
      ].join(' ')}
    >
      {/* Avatar with online ring */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={['truncate text-sm font-semibold', isActive ? 'text-secondary-600' : 'text-text-primary'].join(' ')}>
            {participant.name}
          </span>
          <span className="shrink-0 text-[10px] text-text-muted">{lastMsg?.time}</span>
        </div>

        {/* Role badge */}
        <span className={[
          'inline-block rounded-full px-1.5 py-px text-[10px] font-semibold',
          participant.role === 'Seller' ? 'bg-secondary-100 text-secondary-600' : 'bg-accent-100 text-accent-600',
        ].join(' ')}>
          {participant.role}
        </span>

        {/* Auction name */}
        <p className="mt-0.5 truncate text-xs text-text-muted">{auctionTitle}</p>

        {/* Last message + unread */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="flex-1 truncate text-xs text-text-muted">{lastMsg?.text}</p>
          {unread > 0 && (
            <span className="shrink-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-600 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── ConversationList ─────────────────────────────────────────────────────────

/**
 * @param {Array}    conversations   – full conversations array
 * @param {string}   activeId        – currently selected conversation id
 * @param {function} onSelect        – (id) => void
 * @param {function} onNewConversation – () => void — opens New Conversation modal
 */
function ConversationList({ conversations, activeId, onSelect, onNewConversation }) {
  const [search, setSearch] = useState('');

  // ── Improved search: name, role, auction title, last message ───────────────
  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q        = search.toLowerCase();
    const lastMsg  = c.messages[c.messages.length - 1]?.text ?? '';
    return (
      c.participant.name.toLowerCase().includes(q)   ||
      c.participant.role.toLowerCase().includes(q)   ||
      c.auctionTitle.toLowerCase().includes(q)       ||
      lastMsg.toLowerCase().includes(q)
    );
  });

  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);
  const hasSearch   = search.trim().length > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border-subtle px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary">Conversations</h2>
          <div className="flex items-center gap-2">
            {totalUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
            {/* New Conversation button */}
            <button
              type="button"
              onClick={onNewConversation}
              aria-label="New conversation"
              title="New Conversation"
              className={[
                'flex h-7 w-7 items-center justify-center rounded-lg',
                'bg-secondary-600 text-white shadow-card',
                'transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
              ].join(' ')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5"  y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, auction, message…"
            className="h-9 w-full rounded-xl border border-border bg-bg-surface pl-8 pr-8 text-xs text-text-primary placeholder:text-text-muted outline-none transition-all duration-150 focus:border-secondary-600 focus:bg-bg-card focus:ring-2 focus:ring-secondary-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary focus-visible:outline-none"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Search feedback */}
        {hasSearch && (
          <p className="mt-2 text-[10px] text-text-muted">
            {filtered.length > 0
              ? `Showing ${filtered.length} of ${conversations.length} conversations`
              : null}
          </p>
        )}
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-3 py-10 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p className="text-xs font-semibold text-text-muted">No conversations found</p>
            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-2 text-[11px] font-medium text-secondary-600 hover:text-secondary-500 focus-visible:outline-none"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((c) => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isActive={activeId === c.id}
                onClick={() => onSelect(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationList;
