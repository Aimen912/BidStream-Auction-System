import http from './http';

export async function listConversations() {
  const { data } = await http.get('/messages/conversations');
  return data;
}

export async function getOrCreateConversation(userId) {
  const { data } = await http.post('/messages/conversations', { userId });
  return data;
}

export async function getMessages(convId, params = {}) {
  const { data } = await http.get(`/messages/conversations/${convId}`, { params });
  return data;
}

export async function sendMessage(convId, text) {
  const { data } = await http.post(`/messages/conversations/${convId}/messages`, { text });
  return data;
}

export async function getUnreadMessageCount() {
  const { data } = await http.get('/messages/unread-count');
  return data;
}
