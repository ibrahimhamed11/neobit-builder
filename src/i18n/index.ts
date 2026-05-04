/**
 * i18n/index.ts — Init + public API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { reactNativeLanguageDetector } from './languageDetector';
import { applyRTLForLanguage, applyRTLAndRestartIfNeeded, clearRestartGuard } from './rtlManager';
import { LANG_STORAGE_KEY, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './constants';
import type { SupportedLanguage, SetLanguageOptions } from './types';

import ar from './locales/ar.json';
import en from './locales/en.json';

const RESOURCES = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

let _initPromise: Promise<void> | null = null;

export async function initI18n(): Promise<void> {
  if (_initPromise !== null) return _initPromise;

  _initPromise = (async () => {
    await i18next
      .use(initReactI18next)
      .use(reactNativeLanguageDetector)
      .init({
        compatibilityJSON: 'v4',
        fallbackLng: DEFAULT_LANGUAGE,
        resources: RESOURCES,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });

    const wasRestarted = await clearRestartGuard();
    const resolvedLang = (i18next.language ?? DEFAULT_LANGUAGE) as SupportedLanguage;

    if (wasRestarted) {
      applyRTLForLanguage(resolvedLang);
      return;
    }

    await applyRTLAndRestartIfNeeded(resolvedLang);
  })();

  return _initPromise;
}

export async function setAppLanguage(
  lang: SupportedLanguage,
  options: SetLanguageOptions = {},
): Promise<void> {
  const { restartOnDirectionChange = true } = options;
  const safeLang: SupportedLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;

  await AsyncStorage.setItem(LANG_STORAGE_KEY, safeLang);
  await i18next.changeLanguage(safeLang);

  if (restartOnDirectionChange) {
    await applyRTLAndRestartIfNeeded(safeLang);
  } else {
    applyRTLForLanguage(safeLang);
  }
}

export async function toggleLanguage(options?: SetLanguageOptions): Promise<void> {
  const current = (i18next.language ?? DEFAULT_LANGUAGE) as SupportedLanguage;
  const next: SupportedLanguage = current === 'ar' ? 'en' : 'ar';
  await setAppLanguage(next, options);
}

export function isRTL(lang: SupportedLanguage): boolean {
  return lang === 'ar';
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18next.changeLanguage(lang);
}

export { default as i18nextInstance } from 'i18next';
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_INFO, RTL_LANGUAGES, LANG_STORAGE_KEY } from './constants';
export { applyRTLForLanguage, applyRTLAndRestartIfNeeded, clearRestartGuard, restartApp } from './rtlManager';
export type { SupportedLanguage, SetLanguageOptions, AppReadyResult, UseLanguageResult } from './types';

export default i18next;
