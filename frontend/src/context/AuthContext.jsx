import { createContext, useState, useEffect, useContext, useRef } from 'react';
import API from '../services/axiosConfig';

const AuthContext = createContext(null);

const CLIENT_ID = import.meta.env.VITE_APP_ID_CLIENT_ID;
const SERVER_URL = import.meta.env.VITE_APP_ID_SERVER_URL;

// Helper to decode JWT payload safely in pure JS
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  // React Strict Mode deliberately runs effects twice in development. App ID
  // authorization codes are single-use, so guard the callback exchange.
  const exchangedAuthorizationCode = useRef(null);

  // Initialize and check url query params for OAuth authorization code callback
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if returning from App ID redirection with code in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (authCode) {
        if (exchangedAuthorizationCode.current === authCode) {
          return;
        }
        exchangedAuthorizationCode.current = authCode;

        try {
          // Exchange code for secure tokens via FastAPI backend
          const response = await API.post('/api/auth/token', {
            code: authCode,
            redirect_uri: window.location.origin,
          });

          const { access_token, id_token } = response.data;

          if (access_token) {
            localStorage.setItem('appid_access_token', access_token);
            localStorage.setItem('appid_id_token', id_token || access_token);
            localStorage.setItem('appid_auth_mode', 'real');
            
            setToken(access_token);
            
            const decoded = parseJwt(id_token || access_token);
            setUser({
              id: decoded?.sub || 'user_id',
              name: decoded?.name || decoded?.email || 'IBM App ID User',
              email: decoded?.email || 'user@example.com',
            });
            setIsMock(false);
          }
        } catch (error) {
          console.error('Authorization code exchange failed:', error);
        }

        // Clean url query params without triggering refresh
        window.history.replaceState(null, null, window.location.pathname);
        setLoading(false);
        return;
      }

      // 2. Check local storage for persistent session if no redirect code is present
      const savedMode = localStorage.getItem('appid_auth_mode');
      const savedAccessToken = localStorage.getItem('appid_access_token');
      const savedIdToken = localStorage.getItem('appid_id_token');

      if (savedMode === 'mock') {
        // Repair sessions created before the development token was persisted.
        localStorage.setItem('appid_access_token', 'mock-dev-token');
        setToken('mock-dev-token');
        setUser({
          id: 'mock-user-123',
          name: 'Developer Mode',
          email: 'dev@local.host',
        });
        setIsMock(true);
      } else if (savedAccessToken && savedIdToken) {
        // Decode and verify expiration
        const decoded = parseJwt(savedIdToken);
        const exp = decoded?.exp;
        
        if (exp && exp * 1000 < Date.now()) {
          // Token expired, clear storage
          localStorage.removeItem('appid_access_token');
          localStorage.removeItem('appid_id_token');
          localStorage.removeItem('appid_auth_mode');
        } else {
          setToken(savedAccessToken);
          setUser({
            id: decoded?.sub || 'user_id',
            name: decoded?.name || decoded?.email || 'IBM App ID User',
            email: decoded?.email || 'user@example.com',
          });
          setIsMock(false);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    if (!CLIENT_ID || !SERVER_URL) {
      console.warn('App ID parameters not found, falling back to Mock Auth.');
      loginMock();
      return;
    }

    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `${SERVER_URL}/authorization?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=openid`;
    window.location.href = authUrl;
  };

  const loginMock = () => {
    localStorage.setItem('appid_auth_mode', 'mock');
    // The API interceptor reads this key for every request. Persist the same
    // development token that the backend explicitly permits in debug mode.
    localStorage.setItem('appid_access_token', 'mock-dev-token');
    setToken('mock-dev-token');
    setUser({
      id: 'mock-user-123',
      name: 'Developer Mode',
      email: 'dev@local.host',
    });
    setIsMock(true);
  };

  const logout = () => {
    localStorage.removeItem('appid_access_token');
    localStorage.removeItem('appid_id_token');
    localStorage.removeItem('appid_auth_mode');
    setToken(null);
    setUser(null);
    setIsMock(false);
    
    // Redirect to home page after sign out
    window.location.href = window.location.origin;
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    isMock,
    login,
    loginMock,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
