import axios from 'axios';

// When deployed together in a monorepo, '/api' is used directly.
// When deployed separately, VITE_API_BASE_URL can point to the backend domain.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    if (response.data && Array.isArray(response.data.results)) {
      const results = [...response.data.results];
      results.totalCount = response.data.count;
      results.next = response.data.next;
      results.previous = response.data.previous;
      response.data = results;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
