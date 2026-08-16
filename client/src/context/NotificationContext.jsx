import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getUnreadCount, listNotifications } from '../api/notifications';
import { useAuth } from './AuthContext';
import { useSocketEvent } from './SocketContext';

const NotificationContext = createContext(null);

const POLL_INTERVAL = 60_000; // fallback polling every 60s

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [unread,  setUnread]  = useState(0);
  const [toasts,  setToasts]  = useState([]);
  const latestIdRef     = useRef(null);
  const initialLoadRef  = useRef(false);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToasts = useCallback((newItems) => {
    const toShow = newItems.slice(0, 3);
    setToasts((prev) => [
      ...prev,
      ...toShow.map((n) => ({
        id:          n.id || n._id,
        type:        n.type,
        title:       n.title,
        description: n.description,
        link:        n.link ?? null,
      })),
    ]);
  }, []);

  // ── Initial load + fallback polling ─────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;

    async function poll() {
      try {
        const r = await listNotifications({ limit: 5, sort: 'newest' });
        if (!active) return;
        const notifications = r.notifications || [];
        const count = r.unreadCount ?? 0;
        setUnread(count);
        if (notifications.length === 0) return;
        const newestId = notifications[0]?.id || notifications[0]?._id;
        if (!initialLoadRef.current) {
          latestIdRef.current    = newestId;
          initialLoadRef.current = true;
          return;
        }
        if (latestIdRef.current && newestId !== latestIdRef.current) {
          const newOnes = [];
          for (const n of notifications) {
            const nid = n.id || n._id;
            if (nid === latestIdRef.current) break;
            if (!n.read) newOnes.push(n);
          }
          if (newOnes.length > 0) pushToasts(newOnes);
          latestIdRef.current = newestId;
        }
      } catch { /* silent */ }
    }

    poll();
    const intervalId = setInterval(poll, POLL_INTERVAL);
    return () => { active = false; clearInterval(intervalId); };
  }, [isAuthenticated, pushToasts]);

  // ── Socket: instant notification delivery (uses shared socket) ──────────
  useSocketEvent('new_notification', useCallback((n) => {
    setUnread((prev) => prev + 1);
    pushToasts([n]);
    latestIdRef.current = n.id || n._id;
  }, [pushToasts]));

  // ── Socket: auction went live toast ─────────────────────────────────────
  useSocketEvent('auction_went_live', useCallback((data) => {
    pushToasts([{
      id:          `live-${data.auctionId}`,
      type:        'auction_approved',
      title:       '🔴 Auction is now LIVE!',
      description: `"${data.title}" has started. Join now to bid!`,
      link:        `/live/${data.auctionId}`,
    }]);
  }, [pushToasts]));

  const refreshCount = useCallback(async () => {
    try {
      const r = await getUnreadCount();
      setUnread(r.unreadCount ?? 0);
    } catch { /* silent */ }
  }, []);

  return (
    <NotificationContext.Provider value={{ unread, setUnread, toasts, dismissToast, refreshCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
