import http from './http';

export async function getProfile() {
  const { data } = await http.get('/users/profile');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await http.patch('/users/profile', payload);
  return data;
}

export async function updateName(name) {
  const { data } = await http.patch('/users/name', { name });
  return data;
}

export async function updatePhone(phone) {
  const { data } = await http.patch('/users/phone', { phone });
  return data;
}

export async function changePassword(payload) {
  const { data } = await http.patch('/users/password', payload);
  return data;
}

export async function uploadAvatar(formData) {
  const { data } = await http.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteAvatar() {
  const { data } = await http.delete('/users/avatar');
  return data;
}

export async function uploadCoverImage(formData) {
  const { data } = await http.post('/users/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteCoverImage() {
  const { data } = await http.delete('/users/cover');
  return data;
}

export async function getUserById(id) {
  const { data } = await http.get(`/users/${id}`);
  return data;
}

export async function deleteUser(id) {
  const { data } = await http.delete(`/users/${id}`);
  return data;
}

export async function searchUsers(q = '', limit = 10) {
  const { data } = await http.get('/users/search', { params: { q, limit } });
  return data;
}
