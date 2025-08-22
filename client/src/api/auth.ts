import api from './api';

// Description: Login user with email and password
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken?: string, user: object }
export const login = async (email: string, password: string) => {
  console.log('AuthAPI: login called with email:', email);
  console.log('AuthAPI: login request data:', { email, password: '[REDACTED]' });
  
  try {
    const requestData = {
      email: email.trim(),
      password: password
    };
    
    console.log('AuthAPI: Making login request with data:', { 
      email: requestData.email, 
      password: '[REDACTED]' 
    });
    
    const response = await api.post('/api/auth/login', requestData);
    console.log('AuthAPI: login successful');
    return response.data;
  } catch (error: any) {
    console.error('AuthAPI: login error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Register new user
// Endpoint: POST /api/auth/register
// Request: { name: string, email: string, password: string }
// Response: { accessToken: string, user: object }
export const register = async (name: string, email: string, password: string) => {
  console.log('AuthAPI: register called with:', { name, email, password: '[REDACTED]' });
  
  try {
    const requestData = {
      name: name.trim(),
      email: email.trim(),
      password: password
    };
    
    console.log('AuthAPI: Making register request with data:', { 
      name: requestData.name,
      email: requestData.email, 
      password: '[REDACTED]' 
    });
    
    const response = await api.post('/api/auth/register', requestData);
    console.log('AuthAPI: register successful');
    return response.data;
  } catch (error: any) {
    console.error('AuthAPI: register error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Logout user
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { message: string }
export const logout = async () => {
  console.log('AuthAPI: logout called');
  
  try {
    const response = await api.post('/api/auth/logout');
    console.log('AuthAPI: logout successful');
    return response.data;
  } catch (error: any) {
    console.error('AuthAPI: logout error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};