/**
 * {{APP_NAME}} Auth Service
 * Firebase Authentication — Email/Password, Google & Apple
 *
 * HOW TO PLUG IN YOUR OWN BACKEND:
 * This service calls your backend API (via authApi) after every Firebase auth action.
 * To use your own logic, edit the functions below or replace the authApi calls.
 * See SETUP.md for the full API contract your backend must implement.
 */

import type { User, LoginCredentials, SignupCredentials } from '../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

let GoogleSignin: any;
let appleAuth: any;

try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (e) {
  // Google Sign-In not installed
}

try {
  appleAuth = require('@invertase/react-native-apple-authentication').default;
} catch (e) {
  // Apple Auth not installed
}

// ─── Configure Google Sign-In ────────────────────────────────────────────────
// Replace these with your values from the Firebase console
// See SETUP.md → "Google Sign-In: Update Client IDs"
if (GoogleSignin) {
  GoogleSignin.configure({
    webClientId: '{{GOOGLE_WEB_CLIENT_ID}}',
    iosClientId: '{{GOOGLE_IOS_CLIENT_ID}}',
  });
}

// ─── Firebase User Mapper ────────────────────────────────────────────────────
const mapFirebaseUser = (firebaseUser: FirebaseAuthTypes.User): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || '',
  photoURL: firebaseUser.photoURL || undefined,
  phoneNumber: firebaseUser.phoneNumber || undefined,
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  preferences: {
    language: '{{DEFAULT_LANGUAGE}}',
    theme: 'system',
    currency: 'USD',
    notificationsEnabled: true,
  },
});

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {

  /**
   * Login with email/password
   *
   * Flow:
   *  1. Call your backend POST /auth/login  → gets JWT tokens
   *  2. Sign into Firebase (best-effort, for push notifications)
   *
   * TO CUSTOMIZE: replace the authApi.login() call with your own logic.
   */
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const { authApi } = await import('../api/services/authApi');
      const res = await authApi.login(credentials.email, credentials.password);
      const user = res.data.user;

      // Also sign into Firebase (best-effort — for push notification token binding)
      try {
        await auth().signInWithEmailAndPassword(credentials.email, credentials.password);
      } catch { /* silent — Firebase is secondary */ }

      const mappedUser: User = {
        id: user.id,
        email: user.email,
        displayName: user.displayName || '',
        emailVerified: user.emailVerified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { language: '{{DEFAULT_LANGUAGE}}', theme: 'system', currency: 'USD', notificationsEnabled: true },
      };

      await authService.registerFcmToken();
      return mappedUser;
    } catch (error: any) {
      throw error; // re-throw so caller can read error.response.data.message
    }
  },

  /**
   * Sign up with email/password
   *
   * Flow:
   *  1. Call your backend POST /auth/register  → gets JWT tokens
   *  2. Create Firebase account (best-effort)
   *
   * TO CUSTOMIZE: replace authApi.register() with your own logic.
   */
  signup: async (credentials: SignupCredentials): Promise<User> => {
    try {
      const { authApi } = await import('../api/services/authApi');
      const res = await authApi.register(credentials.email, credentials.password, credentials.displayName);
      const user = res.data.user;

      try {
        await auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
        await auth().currentUser?.updateProfile({ displayName: credentials.displayName });
      } catch { /* silent */ }

      const mappedUser: User = {
        id: user.id,
        email: user.email,
        displayName: user.displayName || '',
        emailVerified: user.emailVerified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { language: '{{DEFAULT_LANGUAGE}}', theme: 'system', currency: 'USD', notificationsEnabled: true },
      };

      await authService.registerFcmToken();
      return mappedUser;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Signup failed');
    }
  },

  /**
   * Login with Google
   *
   * Flow:
   *  1. Google sign-in on device → Firebase credential
   *  2. Firebase sign-in → Firebase user
   *  3. Call your backend POST /auth/google with the Firebase user's email
   *     → backend finds/creates user, returns JWT tokens
   *
   * TO CUSTOMIZE: replace authApi.googleAuth() with your own logic.
   */
  loginWithGoogle: async (): Promise<User> => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken;

      if (!idToken) throw new Error('No ID token returned from Google Sign-In');

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;

      // ── Call your backend to upsert the user ───────────────────────────────
      // TO CUSTOMIZE: replace this call with your own backend integration
      const { authApi } = await import('../api/services/authApi');
      const res = await authApi.googleAuth(
        firebaseUser.email || '',
        firebaseUser.displayName || undefined,
        firebaseUser.photoURL || undefined,
      );
      const backendUser = res.data.user;

      const mappedUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        displayName: backendUser.displayName || firebaseUser.displayName || '',
        emailVerified: true, // Google users are always verified
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { language: '{{DEFAULT_LANGUAGE}}', theme: 'system', currency: 'USD', notificationsEnabled: true },
      };

      await authService.registerFcmToken();
      return mappedUser;
    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED') throw new Error('Google sign-in was cancelled');
      throw new Error(error?.response?.data?.message || mapFirebaseError(error.code) || error.message);
    }
  },

  /**
   * Login with Apple (iOS only)
   *
   * Flow:
   *  1. Apple sign-in on device → Firebase credential
   *  2. Firebase sign-in → Firebase user
   *  3. Call your backend POST /auth/apple  → JWT tokens
   *
   * TO CUSTOMIZE: replace authApi.appleAuth() with your own logic.
   */
  loginWithApple: async (): Promise<User> => {
    try {
      if (!appleAuth.isSupported) {
        throw new Error('Apple Sign In is not supported on this device');
      }

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign In failed - no identity token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      const userCredential = await auth().signInWithCredential(appleCredential);
      const firebaseUser = userCredential.user;

      const { givenName, familyName } = appleAuthRequestResponse.fullName || {};
      const appleDisplayName = [givenName, familyName].filter(Boolean).join(' ') || undefined;
      const displayName = appleDisplayName || firebaseUser.displayName || undefined;

      // ── Call your backend to upsert the user ───────────────────────────────
      const { authApi } = await import('../api/services/authApi');
      const res = await authApi.appleAuth(
        firebaseUser.email || '',
        displayName,
        firebaseUser.photoURL || undefined,
      );
      const backendUser = res.data.user;

      const mappedUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        displayName: backendUser.displayName || displayName || '',
        emailVerified: true, // Apple users are always verified
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: { language: '{{DEFAULT_LANGUAGE}}', theme: 'system', currency: 'USD', notificationsEnabled: true },
      };

      await authService.registerFcmToken();
      return mappedUser;
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) throw new Error('Apple Sign In was cancelled');
      throw new Error(error?.response?.data?.message || error?.message || 'Apple Sign In failed');
    }
  },

  /**
   * Logout
   * Signs out of Firebase + Google + clears local tokens
   */
  logout: async (): Promise<void> => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut().catch(() => {}); // ignore if not logged in with Google
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  },

  /**
   * Register FCM push token with your backend after login.
   *
   * TO CUSTOMIZE: replace the fcmApi.register() call with your own backend endpoint.
   * Your backend just needs to store the token per user so you can send push notifications.
   */
  registerFcmToken: async (): Promise<void> => {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const { STORAGE_KEYS } = await import('../utils/constants');
      const { fcmApi } = await import('../api/services/fcmApi');

      let token = await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN);
      if (!token) {
        try {
          const { notificationService } = await import('./notificationService');
          token = await notificationService.getToken();
        } catch (e) {
          console.warn('[{{APP_NAME}}] notificationService not available, skipping FCM token retrieval');
        }
      }
      if (token) {
        await fcmApi.register(token);
      }
    } catch (err) {
      console.warn('[{{APP_NAME}}] FCM token registration failed:', err);
    }
  },

  /**
   * Reset password — sends OTP via your backend
   * TO CUSTOMIZE: replace authApi.forgotPassword() with your own implementation.
   */
  resetPassword: async (email: string): Promise<void> => {
    try {
      const { authApi } = await import('../api/services/authApi');
      await authApi.forgotPassword(email);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to send reset email');
    }
  },

  /**
   * Get current Firebase user (for session persistence check)
   */
  getCurrentUser: async (): Promise<User | null> => {
    const firebaseUser = auth().currentUser;
    if (firebaseUser) return mapFirebaseUser(firebaseUser);
    return null;
  },

  /**
   * Listen to Firebase auth state changes
   */
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return auth().onAuthStateChanged((firebaseUser) => {
      callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    });
  },
};

// ─── Firebase Error Map ───────────────────────────────────────────────────────
const mapFirebaseError = (code: string): string => {
  const errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password is too weak (min 6 chars)',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid credentials',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/account-exists-with-different-credential':
      'An account already exists with this email but different sign-in method.',
  };
  return errorMap[code] || '';
};
