import http from './http';

export async function listCategories(params = {}) {
  const { data } = await http.get('/categories', { params });
  return data;
}

export async function getCategory(id) {
  const { data } = await http.get(`/categories/${id}`);
  return data;
}

export async function createCategory(payload) {
  const { data } = await http.post('/categories', payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await http.patch(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await http.delete(`/categories/${id}`);
  return data;
}
