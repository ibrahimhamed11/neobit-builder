/**
 * {{APP_NAME}} — Root Component
 *
 * All source files are yours to edit — screens, components,
 * navigation, stores, theme, i18n are all inside src/.
 */
import React from 'react';
import { Text, TextInput, I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import RootNavigator from './navigation/RootNavigator';
import i18n, { initI18n } from './i18n';
import { useAppReady } from './i18n/useLanguage';
import { useThemeStore } from './store/themeStore';

const KUFI_FONT_CONFIG = { fontFamily: 'NotoKufiArabic-Regular', letterSpacing: 0 };
const arabicPaperFonts = configureFonts({ config: KUFI_FONT_CONFIG });

function buildPaperTheme(isDark: boolean) {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  if (!I18nManager.isRTL) return base;
  return { ...base, fonts: arabicPaperFonts };
}

// ── i18n is initialized once at module level ──────────────────────────────────
initI18n();

const AppRoot = () => {
  const { isDark } = useThemeStore();
  const isReady = useAppReady();

  // Apply Kufi font to plain RN Text in Arabic mode
  React.useEffect(() => {
    if (I18nManager.isRTL) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = { fontFamily: 'NotoKufiArabic-Regular' };
      (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
      (TextInput as any).defaultProps.style = { fontFamily: 'NotoKufiArabic-Regular' };
    } else {
      if ((Text as any).defaultProps) (Text as any).defaultProps.style = {};
      if ((TextInput as any).defaultProps) (TextInput as any).defaultProps.style = {};
    }
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={buildPaperTheme(isDark)}>
            <RootNavigator />
          </PaperProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppRoot;
