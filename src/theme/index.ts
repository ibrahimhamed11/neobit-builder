/**
 * {{APP_NAME}} — Theme System
 *
 * Usage in any component:
 *   import { useAppTheme } from '../hooks/useAppTheme';
 *   const { colors, fonts, spacing } = useAppTheme();
 *
 * TO CUSTOMIZE:
 *   - Change primary color in colors.ts
 *   - Change fonts in fonts.ts
 *   - Adjust spacing in spacing.ts
 */

export { Colors } from './colors';
export { FontFamily, FontSize, FontWeight, LineHeight, TextStyles, getLanguageFontFamily, makeTextStyles } from './fonts';
export { Spacing, BorderRadius, Shadows, IconSize } from './spacing';
export { LightTheme } from './light';
export { DarkTheme } from './dark';
export type { ThemeColors } from './light';

import { LightTheme } from './light';
import { DarkTheme } from './dark';
import { Spacing, BorderRadius, Shadows, IconSize } from './spacing';
import { FontFamily, FontSize, FontWeight, LineHeight, TextStyles } from './fonts';

export const getAppTheme = (isDark: boolean) => {
  const colorScheme = isDark ? DarkTheme : LightTheme;
  return {
    ...colorScheme,
    fonts: { family: FontFamily, size: FontSize, weight: FontWeight, lineHeight: LineHeight, styles: TextStyles },
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    iconSize: IconSize,
  };
};

export type AppTheme = ReturnType<typeof getAppTheme>;
