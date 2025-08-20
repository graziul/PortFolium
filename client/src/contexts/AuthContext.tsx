import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/api/auth';

console.log('AuthContext: Module loading...');

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  console.log('AuthContext: useAuth hook called');
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('AuthContext: useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('AuthContext: useAuth hook returning context');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Component initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider: Rendering with state', {
    isAuthenticated,
    isLoading,
    hasUser: !!user
  });

  useEffect(() => {
    console.log('AuthProvider: useEffect - Checking initial authentication state');
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      console.log('AuthProvider: Token check', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : null,
        refreshTokenPreview: refreshToken ? refreshToken.substring(0, 20) + '...' : null
      });

      if (accessToken) {
        console.log('AuthProvider: Access token found, setting authenticated to true');
        setIsAuthenticated(true);
        // TODO: Decode token to get user info or make API call to get user data
      }

      console.log('AuthProvider: Initial auth check completed');
      setIsLoading(false);
    } catch (error) {
      console.error('AuthProvider: Error during initial auth check:', error);
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    console.log('AuthProvider: Login called with credentials:', credentials);
    console.log('AuthProvider: credentials type:', typeof credentials);
    console.log('AuthProvider: credentials.email:', credentials.email);
    console.log('AuthProvider: credentials.password:', credentials.password ? '[PRESENT]' : '[MISSING]');

    try {
      setIsLoading(true);
      console.log('AuthProvider: Calling API login with:', credentials);
      const response = await apiLogin(credentials);
      console.log('AuthProvider: API login response received:', response);

      const { accessToken, refreshToken, user: userData } = response;

      console.log('AuthProvider: Storing tokens and user data');
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      setUser(userData);
      setIsAuthenticated(true);
      console.log('AuthProvider: Login successful, user authenticated');
    } catch (error) {
      console.error('AuthProvider: Login error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; name: string }) => {
    console.log('AuthProvider: Register called with userData:', userData);
    console.log('AuthProvider: userData type:', typeof userData);

    try {
      setIsLoading(true);
      console.log('AuthProvider: Calling API register...');
      const response = await apiRegister(userData);
      console.log('AuthProvider: API register response received:', response);

      const { accessToken, user: userInfo } = response;

      console.log('AuthProvider: Storing access token and user data');
      localStorage.setItem('accessToken', accessToken);

      setUser(userInfo);
      setIsAuthenticated(true);
      console.log('AuthProvider: Registration successful, user authenticated');
    } catch (error) {
      console.error('AuthProvider: Register error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Logout called');
    try {
      console.log('AuthProvider: Calling API logout...');
      await apiLogout();
      console.log('AuthProvider: API logout completed');
    } catch (error) {
      console.error('AuthProvider: Logout API error (continuing anyway):', error);
    } finally {
      console.log('AuthProvider: Clearing local storage and state');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      console.log('AuthProvider: Logout completed');
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  console.log('AuthProvider: Rendering provider with value:', {
    hasUser: !!value.user,
    isAuthenticated: value.isAuthenticated,
    isLoading: value.isLoading
  });

  try {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  } catch (error) {
    console.error('AuthProvider: Error rendering provider:', error);
    throw error;
  }
};

console.log('AuthContext: Module loaded successfully');