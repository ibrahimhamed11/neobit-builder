export type SupportedLanguage = 'en' | 'ar';

export interface LanguageInfo {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  direction: 'ltr' | 'rtl';
}

export interface RTLApplyResult {
  directionChanged: boolean;
}

export interface SetLanguageOptions {
  restartOnDirectionChange?: boolean;
}

export type AppReadyState = 'idle' | 'initialising' | 'applying_rtl' | 'ready';

export interface AppReadyResult {
  isReady: boolean;
  state: AppReadyState;
  language: SupportedLanguage | undefined;
  isRTL: boolean;
}

export interface UseLanguageResult {
  language: SupportedLanguage;
  currentLanguage: SupportedLanguage;
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage, options?: SetLanguageOptions) => Promise<void>;
  toggleLanguage: (options?: SetLanguageOptions) => Promise<void>;
}
