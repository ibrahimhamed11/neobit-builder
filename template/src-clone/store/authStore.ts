/**
 * {{APP_NAME}} — Auth Store (Zustand)
 *
 * Manages all auth state:
 *  - User object, tokens, loading/error states
 *  - Login, Signup, Google, Apple, Guest, Logout
 *  - Forgot/Reset Password flow
 *  - Email OTP Verification
 *  - Session hydration (persists login across app restarts)
 *
 * TO CUSTOMIZE:
 *  - The store calls authService.* which calls authApi.*
 *  - To use your own backend, edit src/api/services/authApi.ts
 *  - To change the User type, edit src/types/index.ts
 */

import { create } from 'zustand';
import type { User, LoginCredentials, SignupCredentials } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthStore {
  // ── State ─────────────────────────────────────────────────────────────────
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestOnboardingSeen: boolean;
  introSeen: boolean;
  emailVerified: boolean;
  isLoading: boolean;
  error: string | null;

  // ── Actions ───────────────────────────────────────────────────────────────
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginAsGuest: () => void;
  setGuestOnboardingSeen: () => void;
  setIntroSeen: () => void;
  logout: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;
  sendOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;

  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // ── Initial State ─────────────────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isGuest: false,
  guestOnboardingSeen: false,
  introSeen: false,
  emailVerified: false,
  isLoading: false,
  error: null,

  // ── State Setters ─────────────────────────────────────────────────────────
  setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // ── Email/Password Login ──────────────────────────────────────────────────
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { authService } = await import('../services/authService');
      const user = await authService.login(credentials);
      set({ user, isAuthenticated: true, emailVerified: !!user.emailVerified, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  // ── Email/Password Signup ─────────────────────────────────────────────────
  signup: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { authService } = await import('../services/authService');
      const user = await authService.signup(credentials);
      set({ user, isAuthenticated: true, emailVerified: !!user.emailVerified, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error?.message || 'Signup failed', isLoading: false });
      throw error;
    }
  },

  // ── Google Sign-In ────────────────────────────────────────────────────────
  loginWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      const { authService } = await import('../services/authService');
      const user = await authService.loginWithGoogle();
      set({ user: { ...user, emailVerified: true }, isAuthenticated: true, isGuest: false, emailVerified: true, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error?.message || 'Google login failed', isLoading: false });
      throw error;
    }
  },

  // ── Apple Sign-In ─────────────────────────────────────────────────────────
  loginWithApple: async () => {
    try {
      set({ isLoading: true, error: null });
      const { authService } = await import('../services/authService');
      const user = await authService.loginWithApple();
      set({ user: { ...user, emailVerified: true }, isAuthenticated: true, isGuest: false, emailVerified: true, isLoading: false, error: null });
    } catch (error: any) {
      set({ error: error?.message || 'Apple login failed', isLoading: false });
      throw error;
    }
  },

  // ── Guest / Anonymous Mode ────────────────────────────────────────────────
  loginAsGuest: () => {
    set({ user: null, isAuthenticated: true, isGuest: true, guestOnboardingSeen: false, emailVerified: true, isLoading: false, error: null });
  },

  setGuestOnboardingSeen: () => set({ guestOnboardingSeen: true }),

  setIntroSeen: () => {
    set({ introSeen: true });
    import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
      AsyncStorage.setItem(STORAGE_KEYS.INTRO_SEEN, 'true');
    });
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    set({ user: null, isAuthenticated: false, isGuest: false, emailVerified: false, isLoading: false, error: null });

    try {
      const { clearTokens } = await import('../api/client');
      await clearTokens();
    } catch { /* best-effort */ }

    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const fcmToken = await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
      if (fcmToken) {
        const { fcmApi } = await import('../api/services/fcmApi');
        await fcmApi.remove(fcmToken);
      }
    } catch { /* best-effort */ }

    const { authService } = await import('../services/authService');
    await authService.logout().catch(() => {});
  },

  // ── Reset Password ────────────────────────────────────────────────────────
  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const { authService } = await import('../services/authService');
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Reset password failed', isLoading: false });
      throw error;
    }
  },

  // ── Email OTP Verification ────────────────────────────────────────────────
  sendOtp: async () => {
    try {
      set({ isLoading: true, error: null });
      const { authApi } = await import('../api/services/authApi');
      await authApi.sendOtp();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message, isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (otp) => {
    try {
      set({ isLoading: true, error: null });
      const { authApi } = await import('../api/services/authApi');
      await authApi.verifyOtp(otp);
      set({ emailVerified: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message, isLoading: false });
      throw error;
    }
  },

  // ── Session Hydration ─────────────────────────────────────────────────────
  // Called once on app start. Reads stored JWT → fetches /auth/me → restores user.
  hydrate: async () => {
    try {
      set({ isLoading: true });
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;

      const introSeen = await AsyncStorage.getItem(STORAGE_KEYS.INTRO_SEEN);
      if (introSeen === 'true') set({ introSeen: true });

      const { getAccessToken } = await import('../api/client');
      const token = await getAccessToken();

      if (!token) {
        set({ user: null, isAuthenticated: false, emailVerified: false, isLoading: false });
        return;
      }

      const { authApi } = await import('../api/services/authApi');
      const res = await authApi.getMe();
      const user = res.data ?? res;
      set({ user, isAuthenticated: true, emailVerified: user?.emailVerified ?? false, isLoading: false });
    } catch {
      try {
        const { clearTokens } = await import('../api/client');
        await clearTokens();
      } catch { /* best-effort */ }
      set({ user: null, isAuthenticated: false, emailVerified: false, isLoading: false });
    }
  },
}));
