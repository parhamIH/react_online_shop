import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { shopApi } from '../api/shop';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await shopApi.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await shopApi.login(username, password);
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    await fetchProfile();
  }, [fetchProfile]);

  const register = useCallback(async (userData) => {
    const data = await shopApi.register(userData);
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    await fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await shopApi.logout();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
  }), [user, token, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
