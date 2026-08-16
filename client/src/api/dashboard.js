import http from './http';

export async function getBuyerDashboard() {
  const { data } = await http.get('/dashboard/buyer');
  return data;
}

export async function getSellerDashboard() {
  const { data } = await http.get('/dashboard/seller');
  return data;
}

export async function getAdminDashboard() {
  const { data } = await http.get('/dashboard/admin');
  return data;
}
