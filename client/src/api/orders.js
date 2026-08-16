import http from './http';

export async function getBuyerOrders(params = {}) {
  const { data } = await http.get('/orders/my', { params });
  return data;
}

export async function getSellerOrders(params = {}) {
  const { data } = await http.get('/orders/seller', { params });
  return data;
}

export async function getOrder(id) {
  const { data } = await http.get(`/orders/${id}`);
  return data;
}

export async function submitShippingAddress(id, address) {
  const { data } = await http.patch(`/orders/${id}/shipping-address`, address);
  return data;
}

export async function submitPayment(id, { paymentMethod, paymentProof } = {}) {
  const { data } = await http.patch(`/orders/${id}/pay`, { paymentMethod, paymentProof });
  return data;
}

export async function confirmPayment(id) {
  const { data } = await http.patch(`/orders/${id}/confirm-payment`);
  return data;
}

export async function addTracking(id, { trackingNumber, courier }) {
  const { data } = await http.patch(`/orders/${id}/tracking`, { trackingNumber, courier });
  return data;
}

export async function confirmDelivery(id) {
  const { data } = await http.patch(`/orders/${id}/confirm-delivery`);
  return data;
}
