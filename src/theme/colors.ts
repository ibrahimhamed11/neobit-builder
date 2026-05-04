/**
 * NeobitApp Color Palette
 */

export const Colors = {
  // Brand Primary
  primary: '#0F766E',
  primaryLight: '#1A9E8C',
  primaryDark: '#0D665E',
  primarySurface: '#E6F5F3',

  // Accent (Gold)
  accent: '#D4A017',
  accentLight: '#E8C558',
  accentDark: '#B8860B',
  accentSurface: '#FFF8E1',

  // Navy
  navy: '#0F172A',
  navyLight: '#1E293B',
  navySurface: '#334155',

  // Backgrounds
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textAccent: '#D4A017',
  textLink: '#0F766E',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderFocus: '#0F766E',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.2)',

  // Skeleton
  skeleton: '#E5E7EB',
  skeletonHighlight: '#F3F4F6',

  // Misc
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
