import axios from 'axios';

console.log('API: Setting up axios instance...');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
});

console.log('API: Axios instance created with baseURL:', api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API: Request interceptor - outgoing request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL || ''}${config.url || ''}`,
      hasData: !!config.data,
      timestamp: new Date().toISOString()
    });

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API: Added authorization header to request');
    } else {
      console.log('API: No access token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('API: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API: Response interceptor - successful response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      hasData: !!response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error) => {
    console.error('API: Response interceptor - error response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      timestamp: new Date().toISOString()
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('API: 401 error detected, attempting token refresh...');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('API: No refresh token available, redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('API: Attempting to refresh token...');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken: refreshToken
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        console.log('API: Token refreshed successfully');

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log('API: Retrying original request with new token');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('API: Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

console.log('API: Axios instance configured successfully');

export default api;