import http from './http';

export async function register(payload) {
  const { data } = await http.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await http.post('/auth/login', payload);
  return data;
}

export async function adminLogin(payload) {
  const { data } = await http.post('/auth/admin/login', payload);
  return data;
}

export async function refresh(refreshToken) {
  const { data } = await http.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logout() {
  const { data } = await http.post('/auth/logout');
  return data;
}

export async function me() {
  const { data } = await http.get('/auth/me');
  return data;
}