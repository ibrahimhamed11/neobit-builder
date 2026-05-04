/**
 * Language Store (Zustand) — Hesba-compatible
 *
 * Manages i18n language state with RTL support.
 * Persists preference via AsyncStorage.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANG_STORAGE_KEY, DEFAULT_LANGUAGE } from '../i18n/constants';
import { changeLanguage, isRTL } from '../i18n';

type Language = 'ar' | 'en';

interface LanguageStore {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: DEFAULT_LANGUAGE as Language,
  isRTL: DEFAULT_LANGUAGE === 'ar',

  setLanguage: async (lang: Language) => {
    try {
      await changeLanguage(lang);
      await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
      set({ language: lang, isRTL: isRTL(lang) });
    } catch {}
  },

  hydrate: async () => {
    try {
      const savedLang = (await AsyncStorage.getItem(LANG_STORAGE_KEY)) as Language | null;
      const lang = savedLang || (DEFAULT_LANGUAGE as Language);
      await changeLanguage(lang);
      set({ language: lang, isRTL: isRTL(lang) });
    } catch {}
  },
}));
