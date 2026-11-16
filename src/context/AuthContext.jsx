import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await API.get('/auth/profile/');
      setUser(res.data);
      setError(null);
    } catch (err) {
      const storedDemo = localStorage.getItem('demo_user_profile');
      if (storedDemo) {
        try {
          setUser(JSON.parse(storedDemo));
          return;
        } catch (e) {
          // ignore
        }
      }
      localStorage.removeItem('token');
      localStorage.removeItem('demo_user_profile');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = async (username, password) => {
    try {
      setError(null);
      const res = await API.post('/auth/login/', { username, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user || { username });
      await fetchProfile();
      return true;
    } catch (err) {
      // Demo / Offline fallback (works on Netlify and local when Django backend is not running)
      const u = username.trim().toLowerCase();
      if (u === 'admin' && password === 'admin123') {
        const demoAdmin = {
          id: 1,
          username: 'admin',
          email: 'admin@digitaldokan.com',
          first_name: 'Admin',
          last_name: 'Staff',
          is_staff: true,
          is_superuser: true,
        };
        localStorage.setItem('token', 'demo-admin-token-authenticated');
        localStorage.setItem('demo_user_profile', JSON.stringify(demoAdmin));
        setUser(demoAdmin);
        setError(null);
        return true;
      }

      if ((u === 'john_doe' || u === 'admin') && (password === 'password123' || password === 'admin123')) {
        const demoUser = {
          id: 2,
          username: u,
          email: `${u}@digitaldokan.com`,
          first_name: 'Demo',
          last_name: 'User',
          is_staff: u === 'admin',
          is_superuser: u === 'admin',
        };
        localStorage.setItem('token', 'demo-token-authenticated');
        localStorage.setItem('demo_user_profile', JSON.stringify(demoUser));
        setUser(demoUser);
        setError(null);
        return true;
      }

      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Login failed. Please check your credentials.';
      setError(msg);
      return false;
    }
  };

  const register = async (username, email, password, password2 = null) => {
    try {
      setError(null);
      const res = await API.post('/auth/register/', {
        username,
        email,
        password,
        password2: password2 || password,
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user || { username, email });
      await fetchProfile();
      return true;
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Registration failed.';
      if (data) {
        if (typeof data === 'string') msg = data;
        else if (data.username) msg = `Username: ${data.username[0]}`;
        else if (data.email) msg = `Email: ${data.email[0]}`;
        else if (data.password) msg = `Password: ${data.password[0]}`;
        else if (data.detail) msg = data.detail;
      }
      setError(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user_profile');
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
