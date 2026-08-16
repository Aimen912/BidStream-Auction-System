import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

/**
 * Hook for real-time auction room.
 * Reads JWT from sessionStorage automatically.
 *
 * Returns:
 *   auction          — current auction state (updates instantly on socket events)
 *   recentBids       — newest-first bid list (updates instantly)
 *   participantCount — live count
 *   connected        — socket connection state
 *   error            — connection error string
 *   auctionEnded     — { winningBid, winnerName, winnerId } when auction closes
 */
export function useAuctionSocket(auctionId) {
  const socketRef = useRef(null);
  const [connected,        setConnected]        = useState(false);
  const [error,            setError]            = useState('');
  const [auction,          setAuction]          = useState(null);
  const [recentBids,       setRecentBids]       = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [auctionEnded,     setAuctionEnded]     = useState(null); // { winningBid, winnerName }

  useEffect(() => {
    if (!auctionId) return;

    const token = window.sessionStorage.getItem('bs_access_token') || '';

    const socket = io(SOCKET_URL, {
      auth:         { token },
      transports:   ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    // ── Connected → join room immediately ──────────────────────────────
    socket.on('connect', () => {
      setConnected(true);
      setError('');
      socket.emit('join_auction', { auctionId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('connect_error', (err) => {
      setError('Connection failed: ' + err.message);
      setConnected(false);
    });

    // ── Initial full state when joining room ───────────────────────────
    socket.on('auction_state', ({ auction: a, recentBids: bids, participantCount: count }) => {
      setAuction(a);
      setRecentBids(bids || []);
      setParticipantCount(count || 0);
    });

    // ── Real-time bid update — instant state update, no API call ───────
    socket.on('bid_update', (data) => {
      setAuction((prev) => prev ? {
        ...prev,
        currentBid:    data.currentBid,
        bids:          data.totalBids,
        highestBidder: data.highestBidder,
      } : prev);
      // Prepend new bid to feed — newest first
      if (data.bid) {
        setRecentBids((prev) => [data.bid, ...prev].slice(0, 50));
      }
    });

    // ── Participant count changes ───────────────────────────────────────
    socket.on('participants_update', ({ count }) => setParticipantCount(count));

    // ── Auction ended / sold (endAuction, buyNow, scheduler) ──────────
    socket.on('auction_ended', (data) => {
      setAuction((prev) => prev ? {
        ...prev,
        status:        data.status || 'ended',
        currentBid:    data.winningBid ?? prev.currentBid,
        highestBidder: data.winnerName
          ? { name: data.winnerName, id: data.winnerId }
          : prev.highestBidder,
      } : prev);
      // Surface winner info to pages
      setAuctionEnded({
        winningBid: data.winningBid,
        winnerName: data.winnerName,
        winnerId:   data.winnerId,
        status:     data.status || 'ended',
      });
    });

    // ── auction_started: waiting room → live room ──────────────────────
    // (handled by WaitingRoom which has its own socket — not needed here)

    socket.on('error', ({ message }) => setError(message));

    return () => {
      socket.emit('leave_auction', { auctionId });
      socket.disconnect();
    };
  }, [auctionId]);

  return { auction, recentBids, participantCount, connected, error, auctionEnded };
}

// ─── Global socket for non-room events (notifications, live list updates) ────
// Used by NotificationContext and LiveAuctions page.

let globalSocket = null;

export function getGlobalSocket() {
  if (!globalSocket || globalSocket.disconnected) {
    const token = window.sessionStorage.getItem('bs_access_token') || '';
    globalSocket = io(SOCKET_URL, {
      auth:       { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
  }
  return globalSocket;
}
