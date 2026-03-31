'use client';

import { updateAuthTokenFromOutside } from '@/context/AuthContext';
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import type { RawAxiosRequestHeaders } from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
});

type JwtPayload = {
  exp?: number;
};

type RetryAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const decodeBase64Url = (value: string) => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return atob(padded);
};

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;

    if (typeof payload.exp !== 'number') return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
};

let refreshPromise: Promise<string | null> | null = null;

const shouldSkipAuthRefresh = (url?: string) => {
  if (!url) return false;

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  );
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json();
      const token = data?.accessToken;

      if (!token) throw new Error('No token returned');

      updateAuthTokenFromOutside(token);
      return token;
    } catch (err) {
      console.error('Refresh failed:', err);
      updateAuthTokenFromOutside(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  if (shouldSkipAuthRefresh(config.url)) return config;

  let token = localStorage.getItem('accessToken');

  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  if (process.env.NODE_ENV === 'development') {
    const base = config.baseURL ?? '';
    const url = config.url ?? '';
    console.log('Request:', `${base}${url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest) {
      throw error;
    }

    if (shouldSkipAuthRefresh(originalRequest.url)) {
      throw error;
    }

    if (status !== 401 || originalRequest._retry) {
      throw error;
    }

    originalRequest._retry = true;
    const refreshedToken = await refreshAccessToken();

    if (!refreshedToken) {
      throw error;
    }

    const headers: RawAxiosRequestHeaders = {
      ...(originalRequest.headers as RawAxiosRequestHeaders | undefined),
      Authorization: `Bearer ${refreshedToken}`,
    };
    originalRequest.headers = headers;

    return api.request(originalRequest);
  }
);

export default api;
