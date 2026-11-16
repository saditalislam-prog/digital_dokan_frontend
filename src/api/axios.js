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
    // Detect if the response is actually an HTML page returned by SPA routing fallback (Netlify/Vercel)
    const isHtmlString =
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!') ||
       response.data.trim().startsWith('<html') ||
       response.data.includes('<div id="root">') ||
       (response.headers && response.headers['content-type'] && response.headers['content-type'].includes('text/html')));

    if (isHtmlString) {
      const error = new Error('Received HTML response instead of JSON (API endpoint not available on static hosting)');
      error.response = { ...response, status: 404, data: null };
      return Promise.reject(error);
    }

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
