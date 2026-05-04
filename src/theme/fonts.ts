/**
 * NeobitApp Font System — Arabic-first with English fallback
 *
 * Arabic: NotoKufiArabic (Kufi style — matches Hesba-style apps)
 * English: Roboto (Android) / System (iOS)
 */

import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const FontFamily = {
  arabic: {
    regular: 'NotoKufiArabic-Regular',
    medium: 'NotoKufiArabic-Medium',
    semiBold: 'NotoKufiArabic-SemiBold',
    bold: 'NotoKufiArabic-Bold',
    extraBold: 'NotoKufiArabic-ExtraBold',
    light: 'NotoKufiArabic-Light',
  },
  english: {
    regular: isIOS ? 'System' : 'Roboto',
    medium: isIOS ? 'System' : 'Roboto-Medium',
    semiBold: isIOS ? 'System' : 'Roboto-Medium',
    bold: isIOS ? 'System' : 'Roboto-Bold',
    extraBold: isIOS ? 'System' : 'Roboto-Bold',
    light: isIOS ? 'System' : 'Roboto-Light',
  },
  system: {
    regular: isIOS ? 'System' : 'sans-serif',
    medium: isIOS ? 'System' : 'sans-serif-medium',
    bold: isIOS ? 'System' : 'sans-serif',
    light: isIOS ? 'System' : 'sans-serif-light',
  },
  // Legacy flat API kept for backwards compat
  regular: isIOS ? 'System' : 'sans-serif',
  medium: isIOS ? 'System' : 'sans-serif-medium',
  semiBold: isIOS ? 'System' : 'sans-serif',
  bold: isIOS ? 'System' : 'sans-serif',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
  hero: 40,
} as const;

export const FontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

/**
 * Returns the correct font family set for the given language direction.
 * Arabic → NotoKufiArabic (Kufi style)
 * English → Roboto / System
 */
export function getLanguageFontFamily(isRTL: boolean) {
  return isRTL ? FontFamily.arabic : FontFamily.english;
}

/**
 * Builds language-aware TextStyles.
 * Arabic text uses NotoKufiArabic; English uses system/Roboto.
 */
export function makeTextStyles(isRTL: boolean) {
  const f = getLanguageFontFamily(isRTL);
  return {
    heroBalance: {
      fontFamily: f.bold,
      fontSize: FontSize.hero,
      fontWeight: FontWeight.bold,
      lineHeight: FontSize.hero * LineHeight.tight,
    },
    heading1: {
      fontFamily: f.bold,
      fontSize: FontSize.xxxl,
      fontWeight: FontWeight.bold,
    },
    heading2: {
      fontFamily: f.semiBold,
      fontSize: FontSize.xxl,
      fontWeight: FontWeight.semiBold,
    },
    heading3: {
      fontFamily: f.semiBold,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.semiBold,
    },
    subtitle: {
      fontFamily: f.medium,
      fontSize: FontSize.lg,
      fontWeight: FontWeight.medium,
    },
    body: {
      fontFamily: f.regular,
      fontSize: FontSize.md,
      fontWeight: FontWeight.regular,
    },
    bodySmall: {
      fontFamily: f.regular,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.regular,
    },
    caption: {
      fontFamily: f.regular,
      fontSize: FontSize.xs,
      fontWeight: FontWeight.regular,
    },
    button: {
      fontFamily: f.semiBold,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semiBold,
    },
  } as const;
}

export const TextStyles = {
  heroBalance: {
    fontFamily: FontFamily.arabic.bold,
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.hero * LineHeight.tight,
  },
  heading1: {
    fontFamily: FontFamily.arabic.bold,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
  },
  heading2: {
    fontFamily: FontFamily.arabic.semiBold,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.semiBold,
  },
  heading3: {
    fontFamily: FontFamily.arabic.semiBold,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
  },
  subtitle: {
    fontFamily: FontFamily.arabic.medium,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
  body: {
    fontFamily: FontFamily.arabic.regular,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
  },
  bodySmall: {
    fontFamily: FontFamily.arabic.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
  },
  caption: {
    fontFamily: FontFamily.arabic.regular,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
  button: {
    fontFamily: FontFamily.arabic.semiBold,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
  },
} as const;
