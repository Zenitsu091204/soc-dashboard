import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import storage from '../utils/storage';
import showToast from '../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored token/user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = storage.getUser();
      const token = storage.getToken();

      if (token && storedUser) {
        setUser(storedUser);
        // Optional: Verify token with backend /profile endpoint
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data);
          storage.setUser(data);
        } catch (err) {
          console.error('Token verification failed:', err);
          storage.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, remember = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      setUser(data);
      storage.setToken(data.token, remember);
      storage.setUser(data, remember);
      
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storage.clear();
    showToast.info('Logged out', 'You have been successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
