const storage = {
  getToken: () => localStorage.getItem('token') || sessionStorage.getItem('token'),
  setToken: (token, remember = false) => {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },
  getUser: () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
  },
  setUser: (user, remember = false) => {
    const userStr = JSON.stringify(user);
    if (remember) {
      localStorage.setItem('user', userStr);
    } else {
      sessionStorage.setItem('user', userStr);
    }
  },
  clear: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },
};

export default storage;
