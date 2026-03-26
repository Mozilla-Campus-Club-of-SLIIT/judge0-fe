import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// The JWT payload
// We only need the existance and 'exp'
interface JWTPayload {
  exp?: number;
  [key: string]: unknown;
}

// success response fromt the auth service
interface SuccessResponse<T = unknown> {
  data: T;
}

// Refresh token response shape (matches /token/refresh)
interface RefreshTokenResponse {
  token: string;
}

// Axios instance
const API_BASE_URL = process.env.API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // I recommend adding a version tag too /api/v1 for this.
});

// Get the cookie
const getCookie = (name: string): string | undefined => Cookies.get(name);

// Decode JWT payload
const decodeJWT = (token: string): JWTPayload | null => {
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

// Check if the token has expired
const isTokenExpiring = (
  token: string | undefined,
  bufferSeconds: number = 30 // 30 seconds buffer
): boolean => {
  if (!token) return true;

  const decoded = decodeJWT(token);

  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now <= bufferSeconds;
};

let refreshPromise: Promise<string> | null = null;

// refreshtoken endpoint to get a new refreshtoken
const refreshAccessToken = async (): Promise<string> => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // POST /token/refresh – expects refreshToken cookie, returns { data: { token } }
      const response =
        await axiosInstance.post<SuccessResponse<RefreshTokenResponse>>(
          '/token/refresh'
        );
      const newAccessToken = response.data?.data?.token;

      if (newAccessToken) {
        // store new access token in a cookie (adjust options as needed)
        Cookies.set('accessToken', newAccessToken, {
          secure: true,
          sameSite: 'strict',
          expires: 1, // 1 day – adjust based on token lifetime
        });
      }
      return newAccessToken;
    } catch (error) {
      // Refresh failed – clear tokens and reject
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Interceptor
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // existing access token (if any)
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // check refresh token expiry
    let refreshToken = getCookie('refreshToken');

    if (!refreshToken) {
      refreshToken = 'test_token_remove_at_production';
    }

    // If refresh token exists and is about to expire, get a new access token
    if (refreshToken && isTokenExpiring(refreshToken, 30)) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Update the header with the fresh token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        }
      } catch (error) {
        // Refresh failed
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor: handle 401 by attempting refresh and retry
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const originalRequest = error.config as RetryableRequestConfig;
      // Avoid infinite loops: if we already tried to refresh, give up
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed maybe redirect to login
          console.error('Refresh failed, cannot retry request', refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// For Serverside requests

let refreshPromiseServer: Promise<string> | null = null;

const refreshAccessTokenServer = async (
  cookieStore: ReadonlyRequestCookies
): Promise<string> => {
  if (refreshPromiseServer) return refreshPromiseServer;

  refreshPromiseServer = (async () => {
    try {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      // Create a temporary axios instance to avoid interceptors
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
      throw error;
    } finally {
      refreshPromiseServer = null;
    }
  })();

  return refreshPromiseServer;
};

export default axiosInstance;
