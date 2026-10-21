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
      localStorage.removeItem('token');
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
