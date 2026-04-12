import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { brigadeAuthService } from '@/services/brigadeAuthService';
import type { BrigadeAuthUser, BrigadeLoginPayload, BrigadeRegisterPayload } from '@/types/auth';

type AuthContextValue = {
  token: string | null;
  user: BrigadeAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: BrigadeLoginPayload) => Promise<void>;
  register: (payload: BrigadeRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'brigadeAuthToken';
const USER_KEY = 'brigadeAuthUser';

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<BrigadeAuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as BrigadeAuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    brigadeAuthService.setToken(token);
    void brigadeAuthService
      .me()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      })
      .catch(() => {
        brigadeAuthService.setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      async login(payload) {
        const response = await brigadeAuthService.login(payload);
        brigadeAuthService.setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.brigade));
        setToken(response.token);
        setUser(response.brigade);
      },
      async register(payload) {
        const response = await brigadeAuthService.register(payload);
        brigadeAuthService.setToken(response.token);
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.brigade));
        setToken(response.token);
        setUser(response.brigade);
      },
      async logout() {
        if (token) {
          try {
            await brigadeAuthService.logout();
          } catch {
          }
        }

        brigadeAuthService.setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      },
      async refreshProfile() {
        const profile = await brigadeAuthService.me();
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Auth context is not available');
  }

  return context;
}
