/**
 * NeobitApp Light Theme
 */

import { Colors } from './colors';

export const LightTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    primaryDark: Colors.primaryDark,
    primarySurface: Colors.primarySurface,

    accent: Colors.accent,
    accentLight: Colors.accentLight,
    accentDark: Colors.accentDark,
    accentSurface: Colors.accentSurface,

    background: Colors.background,
    backgroundSecondary: Colors.backgroundSecondary,
    surface: Colors.card,
    surfaceVariant: '#F1F5F9',

    card: Colors.card,
    cardElevated: Colors.cardElevated,

    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textTertiary: Colors.textTertiary,
    textInverse: Colors.textInverse,
    textAccent: Colors.textAccent,
    textLink: Colors.textLink,

    border: Colors.border,
    borderLight: Colors.borderLight,
    borderFocus: Colors.borderFocus,

    notification: Colors.error,
    tabBarActive: Colors.primary,
    tabBarInactive: Colors.textTertiary,
    tabBarBackground: Colors.white,
    tabBar: Colors.white,

    headerBackground: Colors.primary,
    headerText: Colors.white,
    headerTint: Colors.white,
    statusBar: Colors.primaryDark,

    success: Colors.success,
    successLight: Colors.successLight,
    warning: Colors.warning,
    warningLight: Colors.warningLight,
    error: Colors.error,
    errorLight: Colors.errorLight,
    info: Colors.info,
    infoLight: Colors.infoLight,

    inputBackground: Colors.white,
    inputBorder: Colors.border,
    inputText: Colors.textPrimary,
    inputPlaceholder: Colors.textTertiary,
    placeholder: Colors.textTertiary,

    overlay: Colors.overlay,
    overlayLight: Colors.overlayLight,

    skeleton: Colors.skeleton,
    skeletonHighlight: Colors.skeletonHighlight,

    divider: Colors.borderLight,
    ripple: 'rgba(15, 118, 110, 0.12)',
    disabled: '#D1D5DB',
    disabledText: '#9CA3AF',
    icon: Colors.navyLight,
  },
} as const;

export type ThemeColors = typeof LightTheme.colors;
