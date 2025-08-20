import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  timeout: 10000,
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request interceptor - Raw config:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      dataType: typeof config.data,
      dataStringified: JSON.stringify(config.data),
      headers: config.headers,
      timestamp: new Date().toISOString()
    });

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request: Added auth token to request');
    } else {
      console.log('API Request: No auth token found in localStorage');
    }

    console.log('API Request final config:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers,
      timestamp: new Date().toISOString()
    });

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and log responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString()
    });

    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('API Response: 401 error detected, attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('API Response: No refresh token found, redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        console.log('API Response: Attempting to refresh token');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken: refreshToken
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        console.log('API Response: Token refreshed successfully');

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('API Response: Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;