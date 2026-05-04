/**
 * NeobitApp — Constants
 * Central place for all storage keys and app-wide constants.
 * Storage keys are functions so they use the app name set at runtime via ConfigContext.
 */

import { getAppName } from '../store/_config';

export const STORAGE_KEYS = {
  get FCM_TOKEN()     { return `${getAppName()}_fcm_token`; },
  get ACCESS_TOKEN()  { return `${getAppName()}_access_token`; },
  get REFRESH_TOKEN() { return `${getAppName()}_refresh_token`; },
  get THEME()         { return `@${getAppName()}_theme`; },
  get INTRO_SEEN()    { return `@${getAppName()}_intro_seen`; },
  get LANGUAGE()      { return `@${getAppName()}_language`; },
};

export const DEFAULT_LANGUAGE = 'en';
