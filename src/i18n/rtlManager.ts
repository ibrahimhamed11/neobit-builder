/**
 * i18n/rtlManager.ts — RTL/LTR layout direction management
 *
 * Handles I18nManager flags and app restart when direction changes.
 * Includes restart-loop prevention via AsyncStorage guard flag.
 *
 * Uses a custom native AppRestart module (no third-party dependency).
 * Android: activity.recreate() on the UI thread — safe, no permissions needed.
 * iOS:     RCTTriggerReloadCommandListeners → full JS bundle reload.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, NativeModules, Platform } from 'react-native';
import { RESTART_GUARD_KEY, RTL_LANGUAGES } from './constants';
import type { SupportedLanguage, RTLApplyResult } from './types';

async function triggerRestart(): Promise<void> {
  const { AppRestart } = NativeModules;

  if (AppRestart?.restart) {
    // Custom native module — works on both Android & iOS
    AppRestart.restart();
    return;
  }

  // Fallback: try react-native-restart (if installed)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RNRestart = require('react-native-restart').default;
    RNRestart.restart();
  } catch {
    // Neither native module nor react-native-restart available.
    // On Android we can still try Activity.recreate() as a last resort.
    if (Platform.OS === 'android') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { DevSettings } = require('react-native');
        DevSettings?.reload?.();
      } catch {}
    }
  }
}

function requiresRTL(lang: SupportedLanguage): boolean {
  return RTL_LANGUAGES.has(lang);
}

function applyI18nManagerFlags(isRTL: boolean): void {
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export function applyRTLForLanguage(lang: SupportedLanguage): RTLApplyResult {
  const targetIsRTL = requiresRTL(lang);
  const currentIsRTL = I18nManager.isRTL;
  applyI18nManagerFlags(targetIsRTL);
  return { directionChanged: currentIsRTL !== targetIsRTL };
}

export async function restartApp(): Promise<void> {
  try {
    await AsyncStorage.setItem(RESTART_GUARD_KEY, 'true');
  } catch {}
  await triggerRestart();
}

export async function clearRestartGuard(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(RESTART_GUARD_KEY);
    if (value === 'true') {
      await AsyncStorage.removeItem(RESTART_GUARD_KEY);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function applyRTLAndRestartIfNeeded(lang: SupportedLanguage): Promise<boolean> {
  const { directionChanged } = applyRTLForLanguage(lang);
  if (directionChanged) {
    await restartApp();
    return true;
  }
  return false;
}
