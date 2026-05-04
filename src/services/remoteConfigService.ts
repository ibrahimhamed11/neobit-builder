/**
 * {{APP_NAME}} — Remote Config Service
 *
 * Fetches values from Firebase Remote Config on app start.
 * Controls:
 *  - Maintenance mode (show maintenance screen to all users)
 *  - Force update   (minimum app version check)
 *  - Store URLs     (direct link to App Store / Play Store)
 *
 * ─── How to use ───────────────────────────────────────────────────────────────
 * 1. Import the ready-made config in `firebase/remote-config.json`
 *    into Firebase Console (Remote Config → ⋮ → Import parameters)
 * 2. To enable maintenance: set `maintenance_mode` = "true" → Publish
 * 3. To force update: set `force_update` = "true" + `minimum_version` = "2.0.0" → Publish
 * 4. Changes take effect within 1 hour (or instantly on next cold start in dev)
 */

import remoteConfig from '@react-native-firebase/remote-config';
import { Platform } from 'react-native';
import { safeDeviceInfo } from '../utils/safeDeviceInfo';

// ─── Remote Config Keys ────────────────────────────────────────────────────────
// Must match the keys in firebase/remote-config.json
export const RC_KEYS = {
  MAINTENANCE_MODE:       'maintenance_mode',          // "true" | "false"
  MAINTENANCE_TITLE_EN:   'maintenance_title_en',
  MAINTENANCE_TITLE_AR:   'maintenance_title_ar',
  MAINTENANCE_MESSAGE_EN: 'maintenance_message_en',
  MAINTENANCE_MESSAGE_AR: 'maintenance_message_ar',
  FORCE_UPDATE:           'force_update',              // "true" | "false"
  MINIMUM_VERSION:        'minimum_version',           // "2.0.0"
  STORE_URL_ANDROID:      'store_url_android',         // Play Store URL
  STORE_URL_IOS:          'store_url_ios',             // App Store URL
};

// ─── Default Values ────────────────────────────────────────────────────────────
// Used before the first fetch or if Firebase is unreachable.
const DEFAULTS = {
  [RC_KEYS.MAINTENANCE_MODE]:       'false',
  [RC_KEYS.MAINTENANCE_TITLE_EN]:   'Under Maintenance',
  [RC_KEYS.MAINTENANCE_TITLE_AR]:   'تحت الصيانة',
  [RC_KEYS.MAINTENANCE_MESSAGE_EN]: "We're performing scheduled maintenance.\nWe'll be back shortly!",
  [RC_KEYS.MAINTENANCE_MESSAGE_AR]: 'نحن نُجري صيانة دورية مجدولة.\nسنعود قريباً!',
  [RC_KEYS.FORCE_UPDATE]:           'false',
  [RC_KEYS.MINIMUM_VERSION]:        '1.0.0',
  [RC_KEYS.STORE_URL_ANDROID]:      '',                // Set this in Firebase Console
  [RC_KEYS.STORE_URL_IOS]:          '',                // Set this in Firebase Console
};

// ─── Fetch & Activate ──────────────────────────────────────────────────────────
/**
 * Call this once on app start (inside RootNavigator.hydrate).
 * Sets defaults first so the app works offline or on first run.
 */
export const fetchRemoteConfig = async (): Promise<void> => {
  try {
    await remoteConfig().setDefaults(DEFAULTS);
    await remoteConfig().setConfigSettings({
      // In production: 1 hour cache. In dev: 0 (always fresh).
      minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
    });
    await remoteConfig().fetchAndActivate();
  } catch (err) {
    // Silently fall back to defaults — never block the user if RC fails
    console.warn('[RemoteConfig] Fetch failed, using defaults:', err);
  }
};

// ─── Value Getters ─────────────────────────────────────────────────────────────
const getString = (key: string): string => {
  try {
    return remoteConfig().getValue(key).asString();
  } catch (error) {
    return DEFAULTS[key as keyof typeof DEFAULTS] || '';
  }
};

/** Is the app under maintenance? */
export const isMaintenanceMode = (): boolean => {
  try {
    return getString(RC_KEYS.MAINTENANCE_MODE) === 'true';
  } catch {
    return false;
  }
};

/** Is the current app version below the required minimum? */
export const isForceUpdateRequired = (): boolean => {
  try {
    if (getString(RC_KEYS.FORCE_UPDATE) !== 'true') return false;
    const minimum = getString(RC_KEYS.MINIMUM_VERSION);
    const current = safeDeviceInfo.getVersion(); // e.g. "1.2.0"
    return compareVersions(current, minimum) < 0;
  } catch (error) {
    console.warn('[RemoteConfig] Force update check failed:', error);
    return false;
  }
};

/** Maintenance screen text (returns EN or AR based on lang) */
export const getMaintenanceContent = (lang = 'en') => ({
  title: getString(
    lang === 'ar' ? RC_KEYS.MAINTENANCE_TITLE_AR : RC_KEYS.MAINTENANCE_TITLE_EN,
  ) || DEFAULTS[RC_KEYS.MAINTENANCE_TITLE_EN],
  message: getString(
    lang === 'ar' ? RC_KEYS.MAINTENANCE_MESSAGE_AR : RC_KEYS.MAINTENANCE_MESSAGE_EN,
  ) || DEFAULTS[RC_KEYS.MAINTENANCE_MESSAGE_EN],
});

/** Returns the correct store URL for the current platform */
export const getStoreUrl = (): string =>
  Platform.OS === 'ios'
    ? getString(RC_KEYS.STORE_URL_IOS)
    : getString(RC_KEYS.STORE_URL_ANDROID);

/** Minimum version string from Remote Config */
export const getMinimumVersion = (): string =>
  getString(RC_KEYS.MINIMUM_VERSION);

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Semver compare: returns -1 if a < b, 0 if equal, 1 if a > b
 * Handles "1.2.3" style strings only.
 */
function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}
