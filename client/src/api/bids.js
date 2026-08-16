import http from './http';

export async function listMyBids(params = {}) {
  const { data } = await http.get('/bids/my', { params });
  return data;
}

export async function listAuctionBids(auctionId, params = {}) {
  const { data } = await http.get(`/auctions/${auctionId}/bids`, { params });
  return data;
}

export async function getHighestBid(auctionId) {
  const { data } = await http.get(`/bids/highest/${auctionId}`);
  return data;
}

export async function deleteBid(id) {
  const { data } = await http.delete(`/bids/${id}`);
  return data;
}
