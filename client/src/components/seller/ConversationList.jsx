import { useState } from 'react';
import MessageFilters from './MessageFilters';

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({ convo, isActive, onClick }) {
  const { buyerName, buyerAvatar, buyerGradient, auctionTitle, lastMessage, lastMessageTime, unreadCount, online } = convo;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/40',
        isActive
          ? 'border border-secondary-600/20 bg-secondary-600/10'
          : 'border border-transparent hover:bg-bg-surface',
      ].join(' ')}
    >
      {/* Avatar with online ring */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={['truncate text-sm font-semibold', isActive ? 'text-secondary-600' : 'text-text-primary'].join(' ')}>
            {buyerName}
          </span>
          <span className="shrink-0 text-[10px] text-text-muted">{lastMessageTime}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-text-muted">{auctionTitle}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="flex-1 truncate text-xs text-text-muted">{lastMessage}</p>
          {unreadCount > 0 && (
            <span className="shrink-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-600 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── ConversationList ─────────────────────────────────────────────────────────

/**
 * Left panel showing all conversations with integrated search and filters.
 *
 * @param {Array}    conversations  – full conversations array
 * @param {string}   activeId       – currently selected conversation id
 * @param {function} onSelect       – (id) => void
 */
function ConversationList({ conversations, activeId, onSelect }) {
  const [search,      setSearch]      = useState('');
  const [unreadOnly,  setUnreadOnly]  = useState(false);
  const [onlineOnly,  setOnlineOnly]  = useState(false);

  const totalUnread = conversations.reduce((n, c) => n + c.unreadCount, 0);

  const filtered = conversations.filter((c) => {
    if (unreadOnly && c.unreadCount === 0) return false;
    if (onlineOnly && !c.online)          return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.buyerName.toLowerCase().includes(q)    ||
        c.auctionTitle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Header */}
      <div className="shrink-0 border-b border-border-subtle px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary">Messages</h2>
          {totalUnread > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">
              {totalUnread}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <MessageFilters
        search={search}
        unreadOnly={unreadOnly}
        onlineOnly={onlineOnly}
        onSearch={setSearch}
        onToggleUnread={() => setUnreadOnly((v) => !v)}
        onToggleOnline={() => setOnlineOnly((v) => !v)}
      />

      {/* Search feedback */}
      {hasSearch && filtered.length > 0 && (
        <p className="shrink-0 px-4 py-1.5 text-[10px] text-text-muted">
          Showing {filtered.length} of {conversations.length} conversations
        </p>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-3 py-10 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p className="text-xs font-semibold text-text-muted">No conversations found</p>
            {hasSearch && (
              <button type="button" onClick={() => setSearch('')}
                className="mt-2 text-[11px] font-medium text-secondary-600 hover:text-secondary-500 focus-visible:outline-none">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((c) => (
              <ConversationItem
                key={c.id}
                convo={c}
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
