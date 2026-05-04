/**
 * {{APP_NAME}} — API Environment Config
 *
 * Switch between local and production:
 *   npm run env:local       → uses local backend (your machine IP)
 *   npm run env:production  → uses production backend
 */

import { Platform } from 'react-native';

export type ApiEnv = 'local' | 'production';

// ⬇️ Change this or use the npm scripts
export const API_ENV: ApiEnv = 'production';

// Your machine's local IP — update when your network changes
const LOCAL_IP = '{{LOCAL_IP}}';

const LOCAL_URL = Platform.select({
  android: `http://${LOCAL_IP}:3000/api`,
  ios: `http://${LOCAL_IP}:3000/api`,
}) as string;

const BASE_URLS: Record<ApiEnv, string> = {
  local: LOCAL_URL,
  production: '{{API_BASE_URL}}',
};

export const BASE_URL = BASE_URLS[API_ENV];

export const getBaseUrl = (env?: ApiEnv): string => BASE_URLS[env || API_ENV];
