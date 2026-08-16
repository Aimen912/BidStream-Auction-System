import http from './http';

export async function listAuctions(params = {}) {
  const { data } = await http.get('/auctions', { params });
  return data;
}

export async function getAuction(id) {
  const { data } = await http.get(`/auctions/${id}`);
  return data;
}

export async function listMyAuctions(params = {}) {
  const { data } = await http.get('/auctions/my', { params });
  return data;
}

export async function createAuction(payload) {
  const { data } = await http.post('/auctions', payload);
  return data;
}

export async function updateAuction(id, payload) {
  const { data } = await http.patch(`/auctions/${id}`, payload);
  return data;
}

export async function deleteAuction(id) {
  const { data } = await http.delete(`/auctions/${id}`);
  return data;
}

export async function startAuction(id) {
  const { data } = await http.patch(`/auctions/${id}/start`);
  return data;
}

export async function endAuction(id) {
  const { data } = await http.patch(`/auctions/${id}/end`);
  return data;
}

export async function placeBid(auctionId, amount) {
  const { data } = await http.post(`/auctions/${auctionId}/bids`, { amount });
  return data;
}

export async function getAuctionBids(auctionId, params = {}) {
  const { data } = await http.get(`/auctions/${auctionId}/bids`, { params });
  return data;
}

export async function buyNow(auctionId) {
  const { data } = await http.post(`/auctions/${auctionId}/buy-now`);
  return data;
}

export async function uploadAuctionImages(id, formData, { replace = false } = {}) {
  const { data } = await http.post(
    `/auctions/${id}/images`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      params:  replace ? { replace: 'true' } : {},
    }
  );
  return data;
}
