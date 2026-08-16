import http from './http';

export async function getWatchlist() {
  const { data } = await http.get('/watchlist');
  return data;
}

export async function addToWatchlist(auctionId) {
  const { data } = await http.post(`/watchlist/${auctionId}`);
  return data;
}

export async function removeFromWatchlist(auctionId) {
  const { data } = await http.delete(`/watchlist/${auctionId}`);
  return data;
}