// src/api/serverClient.ts
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const API_BASE_URL = process.env.API_BASE_URL;

// the following is needed only if you need to check expiry on server)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('JWT decode failed', e);
    return null;
  }
};

const isTokenExpiring = (
  token: string | undefined,
  bufferSeconds: number = 30
) => {
  if (!token) return true;
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now <= bufferSeconds;
};

let refreshPromiseServer: Promise<string> | null = null;

const refreshAccessTokenServer = async (
  cookieStore: ReadonlyRequestCookies
): Promise<string> => {
  if (refreshPromiseServer) return refreshPromiseServer;

  refreshPromiseServer = (async () => {
    try {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      // Create a temporary Axios instance to avoid interceptor loops
      const tempAxios = axios.create({ baseURL: API_BASE_URL });
      const response = await tempAxios.post(
        '/token/refresh',
        {},
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );
      const newAccessToken = response.data?.data?.token;
      if (newAccessToken) {
        // Update the cookie store with the new access token
        cookieStore.set('accessToken', newAccessToken, {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
      }
      return newAccessToken;
    } catch (error) {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      console.error('Server token refresh failed:', error);
      throw error;
    } finally {
      refreshPromiseServer = null;
    }
  })();

  return refreshPromiseServer;
};

export const createServerAxiosClient = async (
  cookieStore?: ReadonlyRequestCookies
) => {
  // Resolve the cookie store (if not provided, get it from headers)
  const store = cookieStore ?? (await cookies());

  const instance = axios.create({
    baseURL: API_BASE_URL,
    // Optionally set common headers
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const accessToken = store.get('accessToken')?.value;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: retry on 401
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessTokenServer(store);
          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh failed, cannot retry request', refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
