import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  adminLogin as apiAdminLogin,
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
  refresh as apiRefresh,
  register as apiRegister,
} from '../api/auth';
import { setAccessToken } from '../api/http';

const AuthContext = createContext(null);

// ─── Token storage helpers ────────────────────────────────────────────────────
// Access token  → sessionStorage (cleared when tab closes)
// Refresh token → localStorage   (persists across sessions)

function saveTokens({ accessToken, refreshToken }) {
  if (accessToken)  window.sessionStorage.setItem('bs_access_token',  accessToken);
  if (refreshToken) window.localStorage.setItem('bs_refresh_token', refreshToken);
}

function clearTokens() {
  window.sessionStorage.removeItem('bs_access_token');
  window.localStorage.removeItem('bs_refresh_token');
}

function getStoredRefreshToken() {
  return window.localStorage.getItem('bs_refresh_token');
}

function getStoredAccessToken() {
  return window.sessionStorage.getItem('bs_access_token');
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // On mount: try to restore session
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        // 1. Try existing access token first (still valid in same tab)
        const existingAccess = getStoredAccessToken();
        if (existingAccess) {
          setAccessToken(existingAccess);
          const result = await apiMe();
          if (!active) return;
          setUser(result.user);
          return;
        }

        // 2. No access token — try refreshing with stored refresh token
        const storedRefresh = getStoredRefreshToken();
        if (!storedRefresh) {
          // No tokens at all — user is a guest
          if (active) setUser(null);
          return;
        }

        // POST /auth/refresh with { refreshToken } in body
        const refreshed = await apiRefresh(storedRefresh);
        if (!active) return;

        setAccessToken(refreshed.accessToken);
        window.sessionStorage.setItem('bs_access_token', refreshed.accessToken);
        // Refresh token itself doesn't rotate here, keep existing one

        const profile = await apiMe();
        if (!active) return;
        setUser(profile.user);

      } catch {
        if (!active) return;
        setUser(null);
        setAccessToken(null);
        clearTokens();
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();
    return () => { active = false; };
  }, []);

  // Shared post-auth handler — saves tokens and fetches user profile
  async function handleAuth(promiseFactory) {
    setError('');
    const result = await promiseFactory();

    if (result.accessToken) {
      setAccessToken(result.accessToken);
      saveTokens({
        accessToken:  result.accessToken,
        refreshToken: result.refreshToken,
      });
    }

    if (result.user) {
      setUser(result.user);
    } else {
      // Fallback: fetch profile if not included in auth response
      const profile = await apiMe();
      setUser(profile.user);
    }

    return result;
  }

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isAdmin:  user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isBuyer:  user?.role === 'buyer',

    async login(payload) {
      return handleAuth(() => apiLogin(payload));
    },

    async register(payload) {
      return handleAuth(() => apiRegister(payload));
    },

    async adminLogin(payload) {
      return handleAuth(() => apiAdminLogin(payload));
    },

    async signOut() {
      // Clear all local state and tokens first
      setUser(null);
      setAccessToken(null);
      clearTokens();
      // Then call logout API (fire and forget — don't wait)
      apiLogout().catch(() => {});
    },

    async reloadUser() {
      const profile = await apiMe();
      setUser(profile.user);
      return profile.user;
    },

    setError,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
