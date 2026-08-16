/**
 * SocketContext — ONE socket connection shared across the entire app.
 *
 * Rules:
 *  • The socket is created once when the user is authenticated and
 *    destroyed when they sign out (isAuthenticated flips to false).
 *  • Pages and components consume the shared socket via useSocket().
 *  • Auction-room sockets (useAuctionSocket) stay separate because they
 *    join/leave specific rooms — they reuse getGlobalSocket() internally.
 *
 * Exposed values:
 *  socket      — the raw socket.io-client instance (or null before connect)
 *  connected   — boolean connection state
 *  on(event, handler)  — subscribe (auto-removes on unmount if used inside useSocketEvent)
 *  emit(event, data)   — send event
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

const SocketContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [socket,    setSocket]    = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect and clean up if user signs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Already connected — don't create a duplicate
    if (socketRef.current?.connected) return;

    const token = window.sessionStorage.getItem('bs_access_token') || '';

    const s = io(SOCKET_URL, {
      auth:               { token },
      transports:         ['websocket', 'polling'],
      reconnection:       true,
      reconnectionDelay:  1000,
      reconnectionAttempts: 15,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('connect_error', () => setConnected(false));

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [isAuthenticated]);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, emit }}>
      {children}
    </SocketContext.Provider>
  );
}

// ─── useSocket ────────────────────────────────────────────────────────────────

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
  return ctx;
}

// ─── useSocketEvent ───────────────────────────────────────────────────────────
/**
 * Convenience hook: subscribe to a socket event and auto-remove on unmount.
 *
 * @param {string}   event    socket event name
 * @param {function} handler  callback
 *
 * Usage:
 *   useSocketEvent('bid_update', (data) => { ... });
 */
export function useSocketEvent(event, handler) {
  const { socket } = useSocket();
  // Keep a stable ref to the latest handler so we don't re-register on every render
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;
    const cb = (...args) => handlerRef.current(...args);
    socket.on(event, cb);
    return () => socket.off(event, cb);
  }, [socket, event]);
}
