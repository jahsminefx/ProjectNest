import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser, setAuthToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('projectnest_token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let active = true;

    if (!token) {
      setAuthToken('');
      setUser(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setAuthToken(token);
    fetchCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem('projectnest_token');
          setAuthToken('');
          setToken('');
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const authenticateWith = async (request) => {
    const result = await request();
    localStorage.setItem('projectnest_token', result.token);
    setAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const value = useMemo(() => ({
    loading,
    login: (credentials) => authenticateWith(() => loginUser(credentials)),
    logout: () => {
      localStorage.removeItem('projectnest_token');
      setAuthToken('');
      setToken('');
      setUser(null);
    },
    register: (payload) => authenticateWith(() => registerUser(payload)),
    token,
    user
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
