import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const getCsrfToken = async () => {
  const response = await api.get('/auth/csrf-token');
  return response.data.csrfToken;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('csrfToken');
  if (token && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['x-csrf-token'] = token;
  }
  return config;
});

export default api;
