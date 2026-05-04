/**
 * NeobitApp Dark Theme
 */

import { Colors } from './colors';

export const DarkTheme = {
  dark: true,
  colors: {
    primary: Colors.primaryLight,
    primaryLight: '#2DD4BF',
    primaryDark: Colors.primary,
    primarySurface: 'rgba(26, 158, 140, 0.15)',

    accent: Colors.accentLight,
    accentLight: '#F0D68A',
    accentDark: Colors.accent,
    accentSurface: 'rgba(212, 160, 23, 0.15)',

    background: '#0B1120',
    backgroundSecondary: '#111827',
    surface: '#1E293B',
    surfaceVariant: '#253348',

    card: '#1E293B',
    cardElevated: '#253348',

    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: Colors.textPrimary,
    textAccent: Colors.accentLight,
    textLink: Colors.primaryLight,

    border: '#374151',
    borderLight: '#1F2937',
    borderFocus: Colors.primaryLight,

    notification: '#F87171',
    tabBarActive: Colors.primaryLight,
    tabBarInactive: '#6B7280',
    tabBarBackground: '#111827',
    tabBar: '#111827',

    headerBackground: '#111827',
    headerText: '#F9FAFB',
    headerTint: '#F9FAFB',
    statusBar: '#0B1120',

    success: '#34D399',
    successLight: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    error: '#F87171',
    errorLight: 'rgba(248, 113, 113, 0.15)',
    info: '#60A5FA',
    infoLight: 'rgba(96, 165, 250, 0.15)',

    inputBackground: '#1E293B',
    inputBorder: '#374151',
    inputText: '#F9FAFB',
    inputPlaceholder: '#6B7280',
    placeholder: '#6B7280',

    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    skeleton: '#374151',
    skeletonHighlight: '#4B5563',

    divider: '#1F2937',
    ripple: 'rgba(45, 212, 191, 0.12)',
    disabled: '#374151',
    disabledText: '#6B7280',
    icon: '#D1D5DB',
  },
} as const;
