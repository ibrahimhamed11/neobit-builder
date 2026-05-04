import api from '../client';
import { ENDPOINTS } from '../endpoints';
import { setTokens, clearTokens } from '../client';
import type { ApiResponse } from '../../types';

/**
 * Shape of user returned from your backend.
 * TO CUSTOMIZE: adjust these fields to match your own user model.
 */
interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  emailVerified?: boolean;
  photoURL?: string;
}

/**
 * Shape of auth response (login/register/social sign-in).
 * Your backend MUST return this shape. See SETUP.md for full contract.
 */
interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * POST /auth/register
   * Body: { email, password, displayName? }
   */
  register: async (email: string, password: string, displayName?: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, { email, password, displayName });
    const res = data as ApiResponse<AuthResponse>;
    if (res.data.accessToken) {
      await setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  /**
   * POST /auth/login
   * Body: { email, password }
   */
  login: async (email: string, password: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    const res = data as ApiResponse<AuthResponse>;
    if (res.data.accessToken) {
      await setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  /**
   * POST /auth/google
   * Called after Firebase Google sign-in.
   * Body: { email, displayName?, photoURL? }
   * Your backend should upsert the user and return JWT tokens.
   */
  googleAuth: async (email: string, displayName?: string, photoURL?: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.GOOGLE, { email, displayName, photoURL });
    const res = data as ApiResponse<AuthResponse>;
    if (res.data.accessToken) {
      await setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  /**
   * POST /auth/apple
   * Called after Firebase Apple sign-in.
   * Body: { email, displayName?, photoURL? }
   */
  appleAuth: async (email: string, displayName?: string, photoURL?: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.APPLE, { email, displayName, photoURL });
    const res = data as ApiResponse<AuthResponse>;
    if (res.data.accessToken) {
      await setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  /**
   * POST /auth/forgot-password
   * Body: { email }
   * Triggers OTP email from your backend.
   */
  forgotPassword: async (email: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data;
  },

  /**
   * POST /auth/verify-reset-otp
   * Body: { email, otp }
   * Returns: { data: { resetToken: string } }
   */
  verifyResetOtp: async (email: string, otp: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.VERIFY_RESET_OTP, { email, otp });
    return data;
  },

  /**
   * POST /auth/reset-password
   * Body: { token, newPassword }
   */
  resetPassword: async (token: string, newPassword: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return data;
  },

  /**
   * POST /auth/change-password
   * Body: { currentPassword, newPassword }
   * Headers: Authorization (injected automatically)
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
    return data;
  },

  /**
   * POST /auth/send-otp
   * Sends email verification OTP to the currently logged-in user.
   * Headers: Authorization (injected automatically)
   */
  sendOtp: async () => {
    const { data } = await api.post(ENDPOINTS.AUTH.SEND_OTP);
    return data;
  },

  /**
   * POST /auth/verify-otp
   * Body: { otp }
   * Headers: Authorization (injected automatically)
   */
  verifyOtp: async (otp: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, { otp });
    return data;
  },

  /**
   * GET /auth/me
   * Returns the current user profile.
   * Headers: Authorization (injected automatically)
   */
  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.AUTH.ME);
    return data;
  },

  /**
   * PUT /auth/me
   * Updates the current user profile.
   * Body: partial user fields to update
   */
  updateMe: async (updates: Record<string, any>) => {
    const { data } = await api.put(ENDPOINTS.AUTH.ME, updates);
    return data;
  },

  /**
   * POST /auth/upload-photo
   * Uploads a profile photo (multipart/form-data).
   */
  uploadProfilePhoto: async (fileUri: string, mimeType: string = 'image/jpeg') => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: `profile.${mimeType.split('/')[1] || 'jpg'}`,
    } as any);
    const { data } = await api.post(ENDPOINTS.AUTH.UPLOAD_PHOTO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * DELETE /auth/me
   * Deletes the current user account.
   */
  deleteMe: async () => {
    const { data } = await api.delete(ENDPOINTS.AUTH.ME);
    await clearTokens();
    return data;
  },

  logout: async () => {
    await clearTokens();
  },
};
