import api from './api';

// Description: User login
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string, user: { id: string, email: string, name: string } }
export const login = async (credentials: { email: string; password: string }) => {
  console.log('AuthAPI: login called with credentials:', credentials);
  console.log('AuthAPI: credentials type:', typeof credentials);
  console.log('AuthAPI: credentials.email:', credentials.email);
  console.log('AuthAPI: credentials.password:', credentials.password ? '[PRESENT]' : '[MISSING]');

  try {
    console.log('AuthAPI: Making API request with data:', credentials);
    const response = await api.post('/api/auth/login', credentials);
    console.log('AuthAPI: login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AuthAPI: login error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: User registration
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string, name: string }
// Response: { accessToken: string, user: { id: string, email: string, name: string } }
export const register = async (userData: { email: string; password: string; name: string }) => {
  console.log('AuthAPI: register called with userData:', userData);
  console.log('AuthAPI: userData type:', typeof userData);

  try {
    const response = await api.post('/api/auth/register', userData);
    console.log('AuthAPI: register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AuthAPI: register error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: User logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { message: string }
export const logout = async () => {
  console.log('AuthAPI: logout called');

  try {
    const response = await api.post('/api/auth/logout');
    console.log('AuthAPI: logout response:', response.data);
    return response.data;
  } catch (error) {
    console.error('AuthAPI: logout error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};