'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type UserDetails = {
  email: string;
  id: string;
  name: string;
  roles?: string[];
};

type AuthContextValue = {
  token: string | null;
  user: UserDetails | null;
  loading: boolean;
  setToken: (nextToken: string | null) => void;
  setLoading: (nextLoading: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

let externalSetToken: ((nextToken: string | null) => void) | null = null;

const decodeBase64Url = (value: string) => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
};

export const updateAuthTokenFromOutside = (nextToken: string | null) => {
  if (globalThis.window === undefined) return;

  if (nextToken) {
    localStorage.setItem('accessToken', nextToken);
  } else {
    localStorage.removeItem('accessToken');
  }

  externalSetToken?.(nextToken);
};

const decodeJWT = (token: string): UserDetails | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(decodeBase64Url(parts[1]));

    return {
      email: payload.email,
      id: payload.id,
      name: payload.name,
      roles: payload.roles,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((nextToken: string | null) => {
    setAuthToken(nextToken);

    if (nextToken) {
      localStorage.setItem('accessToken', nextToken);

      const userDetails = decodeJWT(nextToken);
      if (userDetails) {
        setUser(userDetails);
      }

      return;
    }

    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const setLoading = useCallback((nextLoading: boolean) => {
    setIsLoading(nextLoading);
  }, []);

  useEffect(() => {
    externalSetToken = setToken;

    return () => {
      if (externalSetToken === setToken) {
        externalSetToken = null;
      }
    };
  }, [setToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('Failed to refresh access token');
          }

          return res.json() as Promise<{ accessToken?: string }>;
        })
        .then((data: { accessToken?: string }) => {
          if (data.accessToken) {
            setToken(data.accessToken);
            return;
          }

          setToken(null);
        })
        .catch(() => {
          console.error('Failed to refresh access token');
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [setToken]);

  const value = useMemo(
    () => ({
      token: authToken,
      user,
      loading: isLoading,
      setToken,
      setLoading,
    }),
    [authToken, isLoading, setLoading, setToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
