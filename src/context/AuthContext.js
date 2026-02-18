import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Security Constants
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 50 * 1000; // 50 seconds
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const STORAGE_PREFIX = 'soc_dashboard_';

// Mock Secure User (In production, this would be in a DB)
// Password: "Admin@123"
// SHA-256 Hash of "Admin@123"
const SECURE_USER_HASH = 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7'; 
const SECURE_USER_EMAIL = 'admin@soc-dashboard.com';

const STORAGE_KEYS = {
  AUTH: `${STORAGE_PREFIX}auth`,
  USER: `${STORAGE_PREFIX}user`,
  EXPIRY: `${STORAGE_PREFIX}expiry`,
  ATTEMPTS: `${STORAGE_PREFIX}attempts`,
  LOCKOUT: `${STORAGE_PREFIX}lockout`,
};

// Helper: Storage Wrapper
const storage = {
  get: (key) => localStorage.getItem(key) || sessionStorage.getItem(key),
  set: (key, value, remember = false) => {
    if (remember) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
  clearAuth: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
};

export const AuthProvider = ({ children }) => {
  // Consolidated State
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    isLocked: false,
    lockoutEnd: null,
  });

  // Helper: Hashing Function
  const hashPassword = async (password) => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Check Lockout Status
  const checkLockout = useCallback(() => {
    const lockoutEnd = storage.get(STORAGE_KEYS.LOCKOUT);
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      return { isLocked: true, remaining: parseInt(lockoutEnd) - Date.now() };
    }
    // Clear lockout if expired
    if (lockoutEnd) {
      storage.remove(STORAGE_KEYS.LOCKOUT);
      storage.remove(STORAGE_KEYS.ATTEMPTS);
    }
    return { isLocked: false, remaining: 0 };
  }, []);

  const logout = useCallback((reason = null) => {
    storage.clearAuth();
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: reason,
      isLocked: false,
      lockoutEnd: null
    });
  }, []);

  const updateSessionExpiry = useCallback((remember = false) => {
    const expiryTime = Date.now() + SESSION_TIMEOUT;
    storage.set(STORAGE_KEYS.EXPIRY, expiryTime.toString(), remember);
  }, []);

  // Initialize Auth State
  useEffect(() => {
    const initAuth = () => {
      const storedAuth = storage.get(STORAGE_KEYS.AUTH);
      const storedUser = storage.get(STORAGE_KEYS.USER);
      const expiry = storage.get(STORAGE_KEYS.EXPIRY);

      // Check Session Timeout
      if (expiry && Date.now() > parseInt(expiry)) {
        logout('Session expired');
        return;
      }

      // Check Lockout
      const { isLocked } = checkLockout();

      if (storedAuth === 'true' && storedUser && !isLocked) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          loading: false,
        }));
        // Update expiry on activity (simulated by init here, but ideally on route change)
        updateSessionExpiry();
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          loading: false,
          isLocked,
          lockoutEnd: isLocked ? parseInt(storage.get(STORAGE_KEYS.LOCKOUT)) : null
        }));
      }
    };

    initAuth();
  }, [checkLockout, logout, updateSessionExpiry]);

  const handleFailedAttempt = () => {
    const currentAttempts = parseInt(storage.get(STORAGE_KEYS.ATTEMPTS) || '0') + 1;
    storage.set(STORAGE_KEYS.ATTEMPTS, currentAttempts.toString());

    if (currentAttempts >= MAX_ATTEMPTS) {
      const lockoutEnd = Date.now() + LOCKOUT_TIME;
      storage.set(STORAGE_KEYS.LOCKOUT, lockoutEnd.toString());
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isLocked: true,
        lockoutEnd,
        error: `Too many failed attempts. Locked for ${LOCKOUT_TIME/1000}s.`
      }));
    } else {
       setAuthState(prev => ({
        ...prev,
        loading: false,
        error: `Invalid credentials. ${MAX_ATTEMPTS - currentAttempts} attempts remaining.`
      }));
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    // 1. Check Lockout
    const { isLocked, remaining } = checkLockout();
    if (isLocked) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isLocked: true,
        error: `Account is locked. Try again in ${Math.ceil(remaining / 1000)}s.`
      }));
      return { success: false, error: 'Account locked' };
    }

    try {
      // 2. Simulate Network Delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. Verify Credentials
      const passwordHash = await hashPassword(password);
      
      if (email === SECURE_USER_EMAIL && passwordHash === SECURE_USER_HASH) {
        // Success
        const userData = {
          email,
          name: 'Administrator',
          role: 'SOC Admin',
        };

        setAuthState({
          isAuthenticated: true,
          user: userData,
          loading: false,
          error: null,
          isLocked: false,
          lockoutEnd: null
        });

        storage.set(STORAGE_KEYS.AUTH, 'true', rememberMe);
        storage.set(STORAGE_KEYS.USER, JSON.stringify(userData), rememberMe);
        updateSessionExpiry(rememberMe);
        
        // Reset attempts
        storage.remove(STORAGE_KEYS.ATTEMPTS);
        
        return { success: true };
      } else {
        // Failure
        handleFailedAttempt();
        throw new Error('Invalid credentials');
      }
    } catch (err) {
       // Error State handled in handleFailedAttempt or here
       return { success: false, error: authState.error || 'Invalid credentials' };
    }
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
