import axios from 'axios';

// In development, Vite proxies /api → localhost:5000 (see vite.config.js)
// So we use a relative URL — this works on any port Vite happens to pick.
// In production, set VITE_API_URL to the full backend URL.
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
  if (accessToken) {
    http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

export function getAccessToken() {
  return accessToken;
}

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default http;
