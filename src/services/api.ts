import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.prohelper.pro/api/v1/brigades',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export function setApiToken(token: string | null) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken && config.headers) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export default api;
