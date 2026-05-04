import type { SupportedLanguage } from './types';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const satisfies readonly SupportedLanguage[];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
export const LANG_STORAGE_KEY = 'neobit_language';
export const RESTART_GUARD_KEY = 'neobit_rtl_restart_guard';

export const LANGUAGE_INFO = {
  en: { code: 'en' as SupportedLanguage, nativeName: 'English', englishName: 'English', direction: 'ltr' as const },
  ar: { code: 'ar' as SupportedLanguage, nativeName: 'العربية', englishName: 'Arabic', direction: 'rtl' as const },
} as const;

export const RTL_LANGUAGES = new Set<SupportedLanguage>(['ar']);
