import { createContext, useEffect, useMemo, useState } from 'react';
import { getMyProfile, loginUser, logoutUser, registerUser } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    getMyProfile()
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
      });
  }, [token]);

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerUser(payload);
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginUser(payload);
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
