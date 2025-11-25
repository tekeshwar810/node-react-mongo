import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Attach token if present and dynamically set Content-Type
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('userData');
  const token = userData ? JSON.parse(userData).token : null;
  if (token) config.headers.token = token;

  // Dynamically set Content-Type based on request data
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default api;