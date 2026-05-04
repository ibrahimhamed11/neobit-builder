/**
 * i18n/languageDetector.ts — Custom i18next language detector for React Native
 *
 * Priority: AsyncStorage → Default (Arabic)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LanguageDetectorAsyncModule } from 'i18next';
import { LANG_STORAGE_KEY, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './constants';
import type { SupportedLanguage } from './types';

function toSupportedLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (!value) return null;
  const base = value.split('-')[0].split('_')[0].toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base)
    ? (base as SupportedLanguage)
    : null;
}

export const reactNativeLanguageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: (): void => {},

  detect: async (): Promise<string> => {
    try {
      const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
      const storedLang = toSupportedLanguage(stored);
      if (storedLang !== null) return storedLang;
      await AsyncStorage.setItem(LANG_STORAGE_KEY, DEFAULT_LANGUAGE);
      return DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  },

  cacheUserLanguage: (): void => {},
};
