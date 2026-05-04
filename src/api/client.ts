/**
 * {{APP_NAME}} — API Client
 * Axios instance with:
 *  - Automatic JWT token injection (Authorization header)
 *  - Automatic token refresh on 401
 *  - Session-expired event emission
 *  - Language injection (?lang=en|ar)
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { BASE_URL } from './config';
import { ENDPOINTS } from './endpoints';
import { emitSessionExpired } from '../utils/sessionEvents';
import { STORAGE_KEYS } from '../utils/constants';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const TOKEN_KEY = () => STORAGE_KEYS.ACCESS_TOKEN;
const REFRESH_KEY = () => STORAGE_KEYS.REFRESH_TOKEN;

// ─── Token Helpers ────────────────────────────────────────────────────────────
export const setTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY(), accessToken],
    [REFRESH_KEY(), refreshToken],
  ]);
};

export const getAccessToken = () => AsyncStorage.getItem(TOKEN_KEY());
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_KEY());

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY(), REFRESH_KEY()]);
};

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: inject token + language ─────────────────────────────
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Send current language so backend can return localized messages
    const lang = i18next.language?.startsWith('en') ? 'en' : 'ar';
    config.params = { ...config.params, lang };
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: auto-refresh on 401 ───────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Auth endpoints that return real 401 errors — must NOT trigger token refresh
const AUTH_ENDPOINTS_NO_RETRY = [
  ENDPOINTS.AUTH.LOGIN,
  ENDPOINTS.AUTH.REGISTER,
  ENDPOINTS.AUTH.GOOGLE,
  ENDPOINTS.AUTH.APPLE,
  ENDPOINTS.AUTH.FORGOT_PASSWORD,
  ENDPOINTS.AUTH.RESET_PASSWORD,
  ENDPOINTS.AUTH.VERIFY_RESET_OTP,
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If user deleted from DB → force logout immediately
    if (error.response?.status === 404 && error.response?.data?.code === 'USER_NOT_FOUND') {
      await clearTokens();
      emitSessionExpired();
      return Promise.reject(error);
    }

    // Auth endpoints: pass errors through unchanged (they have real messages)
    const requestUrl: string = originalRequest?.url || '';
    const isAuthEndpoint = AUTH_ENDPOINTS_NO_RETRY.some((ep) => requestUrl.includes(ep));
    if (isAuthEndpoint) return Promise.reject(error);

    // 401 → try refreshing token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, { refreshToken });

        await setTokens(data.data.accessToken, data.data.refreshToken);
        processQueue(null, data.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        emitSessionExpired(); // App listens to this and navigates to Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
