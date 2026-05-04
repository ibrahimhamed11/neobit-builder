/**
 * useAppTheme — Central theme hook for all screens & components.
 *
 * Returns colors, fonts, spacing, isDark, isRTL, direction helpers.
 * Automatically updates when user switches dark/light mode or language.
 */

import { useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useRTL } from '../i18n/useLanguage';
import { LightTheme } from '../theme/light';
import { DarkTheme } from '../theme/dark';
import { FontFamily, FontSize, FontWeight, LineHeight, getLanguageFontFamily, makeTextStyles } from '../theme/fonts';
import { Spacing, BorderRadius, Shadows, IconSize, HitSlop } from '../theme/spacing';

export type ThemeColors = { [K in keyof typeof LightTheme.colors]: string };

export const useAppTheme = () => {
  const isDark = useThemeStore((s) => s.isDark);
  const isRTL = useRTL();

  return useMemo(() => {
    const scheme = isDark ? DarkTheme : LightTheme;
    const colors = scheme.colors as ThemeColors;

    return {
      isDark,
      isRTL,
      direction: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row-reverse' | 'row',
      colors,
      fonts: {
        family: getLanguageFontFamily(isRTL),
        size: FontSize,
        weight: FontWeight,
        lineHeight: LineHeight,
        styles: makeTextStyles(isRTL),
        allFamilies: FontFamily,
      },
      spacing: Spacing,
      borderRadius: BorderRadius,
      shadows: Shadows,
      iconSize: IconSize,
      hitSlop: HitSlop,
    };
  }, [isDark, isRTL]);
};
