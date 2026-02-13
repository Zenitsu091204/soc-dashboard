import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('soc_auth');
    const storedUser = localStorage.getItem('soc_user');
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    // Demo authentication - accepts any credentials
    // In production, replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          email,
          name: email.split('@')[0],
          role: 'SOC Analyst',
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        
        if (rememberMe) {
          localStorage.setItem('soc_auth', 'true');
          localStorage.setItem('soc_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('soc_auth', 'true');
          sessionStorage.setItem('soc_user', JSON.stringify(userData));
        }
        
        resolve({ success: true });
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('soc_auth');
    localStorage.removeItem('soc_user');
    sessionStorage.removeItem('soc_auth');
    sessionStorage.removeItem('soc_user');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
