/**
 * {{APP_NAME}} — API Endpoints
 *
 * All backend URLs in one place.
 * See SETUP.md for the full request/response contract for each endpoint.
 */

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    REGISTER: '/auth/register',           // POST
    LOGIN: '/auth/login',                 // POST
    GOOGLE: '/auth/google',               // POST  (after Firebase Google sign-in)
    APPLE: '/auth/apple',                 // POST  (after Firebase Apple sign-in)
    REFRESH: '/auth/refresh',             // POST  (auto-called by Axios on 401)
    FORGOT_PASSWORD: '/auth/forgot-password',  // POST  (send OTP to email)
    RESET_PASSWORD: '/auth/reset-password',    // POST  (new password + reset token)
    CHANGE_PASSWORD: '/auth/change-password',  // POST  (logged-in user changes password)
    VERIFY_RESET_OTP: '/auth/verify-reset-otp', // POST (verify OTP from forgot-password)
    SEND_OTP: '/auth/send-otp',           // POST  (send email verification OTP)
    VERIFY_OTP: '/auth/verify-otp',       // POST  (verify email OTP)
    ME: '/auth/me',                       // GET/PUT/DELETE
    UPLOAD_PHOTO: '/auth/upload-photo',   // POST  (multipart/form-data)
  },

  // ── FCM Push Tokens ────────────────────────────────────────────────────────
  FCM_TOKENS: {
    REGISTER: '/fcm-tokens',              // POST
    REMOVE: '/fcm-tokens',               // DELETE
    LIST: '/fcm-tokens/my-tokens',       // GET
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST: '/notifications',              // GET
    MARK_READ: (id: string) => `/notifications/${id}/read`,   // PUT
    MARK_ALL_READ: '/notifications/read-all',                 // PUT
  },

  // ─── Add your own endpoints below ──────────────────────────────────────────
  // Example:
  // POSTS: {
  //   LIST: '/posts',
  //   CREATE: '/posts',
  //   UPDATE: (id: string) => `/posts/${id}`,
  //   DELETE: (id: string) => `/posts/${id}`,
  // },
};
