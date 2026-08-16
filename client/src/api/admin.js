import http from './http';

export async function getDashboardStats() {
  const { data } = await http.get('/admin/dashboard/stats');
  return data;
}

export async function getAdminDashboard() {
  const { data } = await http.get('/dashboard/admin');
  return data;
}

export async function getAdminAnalytics() {
  const { data } = await http.get('/admin/analytics');
  return data;
}

export async function getAdminReports(params = {}) {
  const { data } = await http.get('/admin/reports', { params });
  return data;
}

export async function searchUsers(params = {}) {
  const { data } = await http.get('/admin/users', { params });
  return data;
}

export async function searchAuctions(params = {}) {
  const { data } = await http.get('/admin/auctions', { params });
  return data;
}

export async function updateUserStatus(id, isActive) {
  const { data } = await http.patch(`/admin/users/${id}/status`, { isActive });
  return data;
}

export async function deleteUser(id) {
  const { data } = await http.delete(`/admin/users/${id}`);
  return data;
}

export async function deleteAuction(id) {
  const { data } = await http.delete(`/admin/auctions/${id}`);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await http.delete(`/admin/categories/${id}`);
  return data;
}

export async function updateAuction(id, fields) {
  const { data } = await http.patch(`/admin/auctions/${id}`, fields);
  return data;
}

export async function getPendingAuctions(params = {}) {
  const { data } = await http.get('/admin/auctions/pending', { params });
  return data;
}

export async function approveAuction(id) {
  const { data } = await http.patch(`/admin/auctions/${id}/approve`);
  return data;
}

export async function rejectAuction(id, remark) {
  const { data } = await http.patch(`/admin/auctions/${id}/reject`, { remark });
  return data;
}
