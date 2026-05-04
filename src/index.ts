// ─── Root Component & Builder ──────────────────────────────────────────────────
export { NeobitBuilder, NeobitApp } from './NeobitApp';

// ─── Config ────────────────────────────────────────────────────────────────────
export type {
  NeobitConfig,
  ThemeConfig,
  ApiConfig,
  AuthConfig,
  FeatureFlags,
  I18nConfig,
  AppIdentityConfig,
  ScreenOverrides,
} from './config/NeobitConfig';
export { DEFAULT_CONFIG } from './config/NeobitConfig';
export { useNeobitConfig, useScreenOverrides } from './config/ConfigContext';

// ─── Types ─────────────────────────────────────────────────────────────────────
export type {
  User,
  UserPreferences,
  LoginCredentials,
  SignupCredentials,
  ApiResponse,
  AuthStackParamList,
  AppStackParamList,
  MainTabParamList,
} from './types';

// ─── i18n ──────────────────────────────────────────────────────────────────────
export { initI18n, setAppLanguage, toggleLanguage, changeLanguage, isRTL as isRTLLanguage } from './i18n';
export { useLanguage, useRTL, useAppReady } from './i18n/useLanguage';
export type { SupportedLanguage, UseLanguageResult, AppReadyResult } from './i18n/types';

// ─── Stores ────────────────────────────────────────────────────────────────────
export { useThemeStore } from './store/themeStore';
export { useLanguageStore } from './store/languageStore';

// ─── Hooks ─────────────────────────────────────────────────────────────────────
export { useAppTheme } from './hooks/useAppTheme';
