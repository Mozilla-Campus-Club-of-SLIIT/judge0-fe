'use client';

import {
  createContext,
  ReactNode,
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

const decodeJWT = (token: string): UserDetails | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

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

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data: { accessToken?: string }) => {
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            setAuthToken(data.accessToken);

            const userDetails = decodeJWT(data.accessToken);
            if (userDetails) {
              setUser(userDetails);
            }
          }
        })
        .catch(() => {
          console.error('Failed to refresh access token');
          localStorage.removeItem('accessToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const setToken = (nextToken: string | null) => {
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
  };

  const setLoading = (nextLoading: boolean) => {
    setIsLoading(nextLoading);
  };

  const value = useMemo(
    () => ({
      token: authToken,
      user,
      loading: isLoading,
      setToken,
      setLoading,
    }),
    [authToken, user, isLoading]
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
