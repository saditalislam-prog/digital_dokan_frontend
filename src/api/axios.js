import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
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
