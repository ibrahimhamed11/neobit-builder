/**
 * i18n/useLanguage.ts — React hooks for language & RTL
 */

import { useCallback, useState, useEffect, useRef } from 'react';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { initI18n, setAppLanguage, toggleLanguage as _toggleLanguage } from './index';
import { DEFAULT_LANGUAGE } from './constants';
import type { SupportedLanguage, SetLanguageOptions, UseLanguageResult, AppReadyResult, AppReadyState } from './types';

export function useRTL(): boolean {
  const [isRTL] = useState<boolean>(() => I18nManager.isRTL);
  return isRTL;
}

export function useLanguage(): UseLanguageResult {
  const { i18n } = useTranslation();
  const language = (i18n.language ?? DEFAULT_LANGUAGE) as SupportedLanguage;
  const isRTL = i18n.dir() === 'rtl';

  const setLanguage = useCallback(
    (lang: SupportedLanguage, options?: SetLanguageOptions): Promise<void> =>
      setAppLanguage(lang, options),
    [],
  );

  const toggle = useCallback(
    (options?: SetLanguageOptions): Promise<void> => _toggleLanguage(options),
    [],
  );

  return {
    language,
    currentLanguage: language,
    isRTL,
    setLanguage,
    toggleLanguage: toggle,
  };
}

export function useAppReady(): AppReadyResult {
  const [state, setState] = useState<AppReadyState>('idle');
  const [language, setLanguage] = useState<SupportedLanguage | undefined>(undefined);
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    let cancelled = false;

    (async () => {
      try {
        setState('initialising');
        await initI18n();
        if (cancelled) return;

        setState('applying_rtl');
        const resolvedLang = (i18next.language ?? DEFAULT_LANGUAGE) as SupportedLanguage;
        if (cancelled) return;

        setLanguage(resolvedLang);
        setState('ready');
      } catch {
        if (cancelled) return;
        setLanguage(DEFAULT_LANGUAGE);
        setState('ready');
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return {
    isReady: state === 'ready',
    state,
    language,
    isRTL: language === 'ar',
  };
}
