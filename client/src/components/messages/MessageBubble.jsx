import { MY_ID } from '../../data/messages/MESSAGES_DATA';

// ─── MessageBubble ────────────────────────────────────────────────────────────

/**
 * Single message bubble — right-aligned for sent, left-aligned for received.
 *
 * @param {{ id, senderId, text, time }} message
 * @param {string} senderAvatar – initials
 * @param {string} senderGradient – Tailwind gradient classes
 */
function MessageBubble({ message, senderAvatar, senderGradient }) {
  const isMine = message.senderId === MY_ID;

  return (
    <div className={['flex items-end gap-2', isMine ? 'flex-row-reverse' : 'flex-row'].join(' ')}>

      {/* Avatar — only for received messages */}
      {!isMine && (
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${senderGradient} text-[10px] font-bold text-white`}>
          {senderAvatar}
        </span>
      )}

      {/* Bubble */}
      <div className={['max-w-[72%] flex flex-col gap-1', isMine ? 'items-end' : 'items-start'].join(' ')}>
        <div
          className={[
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card',
            isMine
              ? 'rounded-br-sm bg-secondary-600 text-white'
              : 'rounded-bl-sm border border-border-subtle bg-bg-card text-text-primary',
          ].join(' ')}
        >
          {message.text}
        </div>
        <span className="px-1 text-[10px] text-text-muted">{message.time}</span>
      </div>
    </div>
  );
}

export default MessageBubble;
