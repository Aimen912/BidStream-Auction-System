import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import {
  listConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from '../../api/messages';
import { searchUsers } from '../../api/users';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function initials(name = '?') {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ user, size = 9 }) {
  const sz = `h-${size} w-${size}`;
  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className={`${sz} rounded-full object-cover shrink-0`}/>;
  }
  return (
    <span className={`${sz} shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-700 text-xs font-bold text-white`}>
      {initials(user?.name)}
    </span>
  );
}

// ─── NewConversationModal ─────────────────────────────────────────────────────

function NewConversationModal({ onClose, onStart }) {
  const [query, setQuery]       = useState('');
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!query.trim()) { setUsers([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await searchUsers(query, 10);
        setUsers(r.users || []);
      } catch { setUsers([]); }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card shadow-modal motion-safe:animate-scale-in" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">New Conversation</h3>
            <p className="text-xs text-text-muted">Search a user to message</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…" autoFocus
              className="w-full rounded-xl border border-border bg-bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"/>
          </div>
        </div>

        <div className="mt-3 max-h-60 overflow-y-auto px-5 pb-5">
          {loading && <p className="py-4 text-center text-sm text-text-muted">Searching…</p>}
          {!loading && query && users.length === 0 && (
            <p className="py-4 text-center text-sm text-text-muted">No users found</p>
          )}
          {!loading && !query && (
            <p className="py-4 text-center text-sm text-text-muted">Start typing to search users</p>
          )}
          {users.map((u) => (
            <button key={u._id} type="button" onClick={() => onStart(u._id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-bg-surface">
              <Avatar user={u} size={9}/>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                <p className="text-xs text-text-muted capitalize">{u.role} · @{u.username}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({ conv, isActive, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={['flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        isActive ? 'bg-secondary-600/10' : 'hover:bg-bg-surface'].join(' ')}>
      <div className="relative">
        <Avatar user={conv.participant} size={10}/>
        {conv.participant?.online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-success"/>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={['text-sm truncate', conv.unread > 0 ? 'font-bold text-text-primary' : 'font-semibold text-text-secondary'].join(' ')}>
            {conv.participant?.name || 'Unknown'}
          </p>
          <span className="text-[10px] text-text-muted shrink-0 ml-1">{timeAgo(conv.lastAt)}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className={['text-xs truncate', conv.unread > 0 ? 'font-semibold text-text-secondary' : 'text-text-muted'].join(' ')}>
            {conv.lastMessage || 'No messages yet'}
          </p>
          {conv.unread > 0 && (
            <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-600 px-1 text-[9px] font-bold text-white shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function Bubble({ msg, isMine }) {
  return (
    <div className={['flex gap-2', isMine ? 'flex-row-reverse' : 'flex-row'].join(' ')}>
      {!isMine && <Avatar user={msg.sender} size={7}/>}
      <div className={['max-w-xs rounded-2xl px-4 py-2.5 text-sm',
        isMine ? 'rounded-tr-sm bg-secondary-600 text-white' : 'rounded-tl-sm bg-bg-elevated text-text-primary'].join(' ')}>
        <p className="leading-relaxed">{msg.text}</p>
        <p className={['mt-1 text-right text-[10px]', isMine ? 'text-white/70' : 'text-text-muted'].join(' ')}>
          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ─── Messages page ────────────────────────────────────────────────────────────

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [text,          setText]          = useState('');
  const [loadingConvs,  setLoadingConvs]  = useState(true);
  const [loadingMsgs,   setLoadingMsgs]   = useState(false);
  const [sendingMsg,    setSendingMsg]     = useState(false);
  const [showModal,     setShowModal]     = useState(false);
  const bottomRef = useRef(null);

  const isSeller = user?.role === 'seller';
  const dashPath = isSeller ? '/seller/dashboard' : '/dashboard';
  const totalUnread = conversations.reduce((s, c) => s + (c.unread || 0), 0);

  // ── Socket: real-time messages ───────────────────────────────────────────
  const socketRef     = useRef(null);
  const activeConvRef = useRef(null);
  activeConvRef.current = activeConv;

  useEffect(() => {
    const token  = window.sessionStorage.getItem('bs_access_token') || '';
    const socket = io(SOCKET_URL, {
      auth:         { token },
      transports:   ['websocket', 'polling'],
      reconnection: true,
    });
    socketRef.current = socket;

    // Incoming message from the other party
    socket.on('new_message', (data) => {
      const { conversationId, message, lastMessage, lastAt, senderId } = data;
      const myId = String(user?._id || user?.id);

      // If the active conversation is this one — append message
      if (String(activeConvRef.current?.id) === String(conversationId)) {
        setMessages((prev) => {
          // Avoid duplicates (sender's own message already added optimistically)
          if (prev.find((m) => String(m._id) === String(message.id))) return prev;
          return [...prev, { ...message, _id: message.id, sender: { _id: message.sender.id, ...message.sender } }];
        });
        // Scroll
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      } else if (String(senderId) !== myId) {
        // Not our active conv — increment unread
        setConversations((prev) =>
          prev.map((c) => String(c.id) === String(conversationId)
            ? { ...c, unread: (c.unread || 0) + 1, lastMessage, lastAt }
            : c
          )
        );
      }

      // Always update conversation preview
      setConversations((prev) =>
        prev.map((c) => String(c.id) === String(conversationId)
          ? { ...c, lastMessage, lastAt }
          : c
        )
      );
    });

    return () => socket.disconnect();
  }, [user]);

  // ── Join/leave socket conversation room when active conversation changes ──
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (activeConv?.id) {
      socket.emit('join_conversation', { conversationId: activeConv.id });
    }
    return () => {
      if (activeConv?.id) {
        socket.emit('leave_conversation', { conversationId: activeConv.id });
      }
    };
  }, [activeConv?.id]);

  // Load conversations
  useEffect(() => {
    let active = true;
    setLoadingConvs(true);
    listConversations()
      .then(({ conversations: c }) => { if (active) setConversations(c || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoadingConvs(false); });
    return () => { active = false; };
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConv) return;
    let active = true;
    setLoadingMsgs(true);
    getMessages(activeConv.id)
      .then(({ messages: m }) => {
        if (!active) return;
        setMessages(m || []);
        // Mark as read locally
        setConversations((prev) =>
          prev.map((c) => c.id === activeConv.id ? { ...c, unread: 0 } : c)
        );
      })
      .catch(() => {})
      .finally(() => { if (active) setLoadingMsgs(false); });
    return () => { active = false; };
  }, [activeConv?.id]);

  // Scroll to bottom when messages load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e?.preventDefault();
    if (!text.trim() || !activeConv || sendingMsg) return;
    const msgText = text.trim();
    setText('');
    setSendingMsg(true);
    try {
      const { message } = await sendMessage(activeConv.id, msgText);
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((c) => c.id === activeConv.id
          ? { ...c, lastMessage: msgText, lastAt: new Date().toISOString() }
          : c
        )
      );
    } catch {
      setText(msgText); // restore on error
    } finally {
      setSendingMsg(false);
    }
  }

  async function handleStartConversation(userId) {
    setShowModal(false);
    try {
      const { conversation } = await getOrCreateConversation(userId);
      // Add to list if not already there
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      setActiveConv(conversation);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to start conversation');
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      {showModal && (
        <NewConversationModal
          onClose={() => setShowModal(false)}
          onStart={handleStartConversation}
        />
      )}

      <div className="shrink-0">
        <PageHeader
          title="Messages"
          subtitle="Communicate with buyers and sellers."
          breadcrumbs={[
            { label: 'Home',      href: '/'        },
            { label: 'Dashboard', href: dashPath   },
            { label: 'Messages'                    },
          ]}
          actions={
            <div className="flex items-center gap-2">
              {totalUnread > 0 && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger-100 px-3 py-1.5 text-sm font-semibold text-danger">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60"/>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-danger"/>
                  </span>
                  {totalUnread} unread
                </span>
              )}
              <button type="button" onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:bg-secondary-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Conversation
              </button>
            </div>
          }
        />
      </div>

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card mt-4">

        {/* Conversation list */}
        <div className={['flex flex-col border-r border-border-subtle lg:flex lg:w-72 xl:w-80',
          activeConv ? 'hidden lg:flex' : 'flex w-full'].join(' ')}>
          <div className="border-b border-border-subtle px-4 py-3">
            <h3 className="text-sm font-bold text-text-primary">
              Conversations
              {conversations.length > 0 && (
                <span className="ml-2 text-xs font-normal text-text-muted">({conversations.length})</span>
              )}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loadingConvs ? (
              <div className="space-y-2 p-2">
                {[1,2,3].map((i) => <div key={i} className="h-14 rounded-xl shimmer-bg motion-safe:animate-shimmer"/>)}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mb-3 text-navy-500" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p className="text-sm text-text-muted">No conversations yet</p>
                <button type="button" onClick={() => setShowModal(true)}
                  className="mt-3 text-sm font-semibold text-secondary-600 hover:text-secondary-500">
                  Start one →
                </button>
              </div>
            ) : (
              conversations.map((c) => (
                <ConversationItem
                  key={c.id}
                  conv={c}
                  isActive={activeConv?.id === c.id}
                  onClick={() => setActiveConv(c)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={['flex flex-col flex-1', activeConv ? 'flex' : 'hidden lg:flex'].join(' ')}>
          {!activeConv ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="mb-4 text-navy-300" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p className="text-base font-semibold text-text-muted">Select a conversation</p>
              <p className="mt-1 text-sm text-text-muted">or start a new one</p>
              <button type="button" onClick={() => setShowModal(true)}
                className="mt-4 rounded-xl bg-secondary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-500">
                New Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
                <button type="button" onClick={() => setActiveConv(null)}
                  className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <Avatar user={activeConv.participant} size={9}/>
                <div>
                  <p className="text-sm font-bold text-text-primary">{activeConv.participant?.name}</p>
                  <p className="text-xs text-text-muted capitalize">{activeConv.participant?.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <svg className="h-6 w-6 animate-spin text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-text-muted py-8">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <Bubble
                      key={msg._id}
                      msg={msg}
                      isMine={msg.sender?._id === user?._id || msg.sender?._id === user?.id}
                    />
                  ))
                )}
                <div ref={bottomRef}/>
              </div>

              {/* Input */}
              <div className="border-t border-border-subtle px-4 py-3">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Type a message…"
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition-all focus:border-secondary-600 focus:ring-2 focus:ring-secondary-500/20"
                    style={{ maxHeight: 120, overflowY: 'auto' }}
                  />
                  <button type="submit" disabled={!text.trim() || sendingMsg}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-600 text-white transition-all hover:bg-secondary-500 disabled:opacity-40 disabled:cursor-not-allowed">
                    {sendingMsg ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    )}
                  </button>
                </form>
                <p className="mt-1 text-[10px] text-text-muted">Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
