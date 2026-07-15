import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { getCsrfToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    try {
      const csrfToken = await getCsrfToken();
      localStorage.setItem('csrfToken', csrfToken);
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      const socket = connectSocket();
      socket.emit('user-online', { userId: response.data.user.id });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    setUser(response.data.user);
    const csrfToken = await getCsrfToken();
    localStorage.setItem('csrfToken', csrfToken);
    const socket = connectSocket();
    socket.emit('user-online', { userId: response.data.user.id });
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    setUser(response.data.user);
    const csrfToken = await getCsrfToken();
    localStorage.setItem('csrfToken', csrfToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      disconnectSocket();
      localStorage.removeItem('csrfToken');
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
