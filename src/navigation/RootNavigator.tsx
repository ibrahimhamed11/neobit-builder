/**
 * {{APP_NAME}} — Root Navigator
 *
 * Boot sequence (in order):
 *  1. Fetch Firebase Remote Config       → maintenance mode / force update flags
 *  2. Hydrate theme                      → restore dark/light preference
 *  3. Hydrate auth                       → restore JWT session
 *
 * Route decision:
 *  maintenance_mode = true  → MaintenanceScreen  (blocks everything)
 *  force_update = true
 *    + version < minimum    → ForceUpdateScreen  (blocks everything)
 *  isAuthenticated = false  → AuthStack
 *  emailVerified = false    → VerifyEmail
 *  else                     → AppStack (tabs)
 */

import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { getAppTheme } from '../theme';
import {
  fetchRemoteConfig,
  isMaintenanceMode,
  isForceUpdateRequired,
} from '../services/remoteConfigService';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import MaintenanceScreen from '../screens/Maintenance';
import ForceUpdateScreen from '../screens/ForceUpdate';
import VerifyEmailScreen from '../screens/VerifyEmail';

type AppGate = 'loading' | 'maintenance' | 'forceUpdate' | 'auth' | 'verifyEmail' | 'app';

const RootNavigator: React.FC = () => {
  const { isAuthenticated, emailVerified, hydrate: hydrateAuth, logout } = useAuthStore();
  const { isDark, hydrate: hydrateTheme } = useThemeStore();

  const [gate, setGate] = useState<AppGate>('loading');
  const hadFirebaseUser = useRef(false);
  const firebaseUnsubscribeRef = useRef<(() => void) | undefined>();

  const theme = getAppTheme(isDark);

  // ── Boot sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    const boot = async () => {
      try {
        // Step 1: Remote Config (maintenance + force update)
        await fetchRemoteConfig();

        if (isMaintenanceMode()) {
          setGate('maintenance');
          return;
        }

        if (isForceUpdateRequired()) {
          setGate('forceUpdate');
          return;
        }

        // Step 2: Theme + Auth hydration in parallel
        await Promise.all([hydrateTheme(), hydrateAuth()]);

      } catch {
        // Fallback: skip Remote Config, continue normally
        await Promise.allSettled([hydrateTheme(), hydrateAuth()]);
      } finally {
        // Gate is set reactively below via store state
        setGate((prev) => (prev === 'loading' ? 'auth' : prev));
      }
    };

    boot();
  }, []);

  // ── Auth gate — react to store changes ───────────────────────────────────
  useEffect(() => {
    if (gate === 'loading' || gate === 'maintenance' || gate === 'forceUpdate') return;
    if (!isAuthenticated) setGate('auth');
    else if (!emailVerified) setGate('verifyEmail');
    else setGate('app');
  }, [isAuthenticated, emailVerified, gate]);

  // ── Auto-logout when Firebase account is remotely deleted ────────────────
  useEffect(() => {
    const setupFirebaseListener = async () => {
      try {
        const auth = (await import('@react-native-firebase/auth')).default;
        firebaseUnsubscribeRef.current = auth().onAuthStateChanged((firebaseUser: any) => {
          if (firebaseUser) {
            hadFirebaseUser.current = true;
          } else if (hadFirebaseUser.current && useAuthStore.getState().isAuthenticated) {
            hadFirebaseUser.current = false;
            useAuthStore.getState().logout();
          }
        });
      } catch (error) {
        console.warn('Firebase auth listener setup failed:', (error as Error).message);
      }
    };

    setupFirebaseListener();
    return () => {
      firebaseUnsubscribeRef.current?.();
    };
  }, []);

  // ── Navigation theme ──────────────────────────────────────────────────────
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
    fonts: {
      regular: { fontFamily: theme.fonts.family.regular, fontWeight: '400' as const },
      medium:  { fontFamily: theme.fonts.family.medium,  fontWeight: '500' as const },
      bold:    { fontFamily: theme.fonts.family.bold,    fontWeight: '700' as const },
      heavy:   { fontFamily: theme.fonts.family.bold,    fontWeight: '800' as const },
    },
  };

  // ── Gate rendering ────────────────────────────────────────────────────────
  // Maintenance and Force Update bypass NavigationContainer (no navigation needed)
  if (gate === 'loading') return null;            // Show your splash screen here
  if (gate === 'maintenance') return <MaintenanceScreen />;
  if (gate === 'forceUpdate') return <ForceUpdateScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      {gate === 'auth'        && <AuthStack />}
      {gate === 'verifyEmail' && <VerifyEmailScreen />}
      {gate === 'app'         && <AppStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
