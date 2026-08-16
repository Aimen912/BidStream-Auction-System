import http from './http';

export async function listNotifications(params = {}) {
  const { data } = await http.get('/notifications', { params });
  return data;
}

export async function getUnreadCount() {
  const { data } = await http.get('/notifications/unread-count');
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await http.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await http.patch('/notifications/read-all');
  return data;
}

export async function deleteNotification(id) {
  const { data } = await http.delete(`/notifications/${id}`);
  return data;
}