import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('AuthProvider: Component initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered - checking for existing token');
    
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('AuthProvider: Token found:', token ? 'yes' : 'no');
        
        if (token) {
          // Decode token to get user info
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('AuthProvider: Token payload:', payload);
            
            if (payload.exp * 1000 > Date.now()) {
              console.log('AuthProvider: Token is valid, setting user');
              setUser({
                id: payload.id,
                email: payload.email || 'unknown@email.com',
                name: payload.name || 'Unknown User'
              });
            } else {
              console.log('AuthProvider: Token expired, removing');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } catch (error) {
            console.error('AuthProvider: Error decoding token:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } else {
          console.log('AuthProvider: No token found');
        }
      } catch (error) {
        console.error('AuthProvider: Error checking auth:', error);
      } finally {
        console.log('AuthProvider: Setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider: Login attempt for email:', email);
    try {
      const response = await apiLogin(email, password);
      console.log('AuthProvider: Login API response:', response);
      
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
      console.log('AuthProvider: Setting user from login:', payload);
      
      // Fix: Use the email parameter, not the payload email which might be undefined
      setUser({
        id: payload.id,
        email: email, // Use the email parameter passed to login function
        name: payload.name || 'User'
      });
    } catch (error) {
      console.error('AuthProvider: Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('AuthProvider: Register attempt for:', name, email);
    try {
      const response = await apiRegister(name, email, password);
      console.log('AuthProvider: Register API response:', response);
      
      localStorage.setItem('accessToken', response.accessToken);

      const payload = JSON.parse(atob(response.accessToken.split('.')[1]));
      console.log('AuthProvider: Setting user from register:', payload);
      
      setUser({
        id: payload.id,
        email: email, // Use the email parameter passed to register function
        name: name // Use the name parameter passed to register function
      });
    } catch (error) {
      console.error('AuthProvider: Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Logout initiated');
    try {
      await apiLogout();
      console.log('AuthProvider: Logout API call successful');
    } catch (error) {
      console.error('AuthProvider: Logout API error:', error);
    } finally {
      console.log('AuthProvider: Clearing local storage and user state');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  console.log('AuthProvider: Current state - user:', user, 'loading:', loading);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  console.log('useAuth: Hook called');
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth: Hook used outside of AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth: Returning context with user:', context.user);
  return context;
}