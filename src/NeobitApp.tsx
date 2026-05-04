import React from 'react';
import { Text, TextInput, I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider } from './config/ConfigContext';
import RootNavigator from './navigation/RootNavigator';
import i18n, { initI18n } from './i18n';
import { useAppReady } from './i18n/useLanguage';
import { useThemeStore } from './store/themeStore';
import type { NeobitConfig, ScreenOverrides } from './config/NeobitConfig';

// ─── react-native-paper font theme ────────────────────────────────────────────
// Builds a PaperProvider theme that uses NotoKufiArabic for Arabic mode.
// Paper's Text component ignores RN's defaultProps — it reads from this theme only.
const KUFI_FONT_CONFIG = {
  fontFamily: 'NotoKufiArabic-Regular',
  letterSpacing: 0,
};
const arabicPaperFonts = configureFonts({ config: KUFI_FONT_CONFIG });

function buildPaperTheme(isDark: boolean) {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  if (!I18nManager.isRTL) return base;
  return { ...base, fonts: arabicPaperFonts };
}

// ─── Internal Root Component ───────────────────────────────────────────────────

interface NeobitAppProps {
  config?: NeobitConfig;
  screens?: ScreenOverrides;
}

const NeobitRoot: React.FC<NeobitAppProps> = ({ config, screens }) => {
  const { isReady } = useAppReady();
  const isDark = useThemeStore((s) => s.isDark);

  // Apply global RN Text/TextInput font override HERE (inside component, not IIFE).
  // Reason: after activity.startActivity+finish, the JS module cache is warm so
  // module-level IIFEs do NOT re-run. But component functions DO re-execute on
  // every new component tree mount. This guarantees the override runs AFTER
  // I18nManager.forceRTL() has been called and isRTL is already true.
  if (I18nManager.isRTL) {
    const kufi = 'NotoKufiArabic-Regular';
    (Text as any).defaultProps = (Text as any).defaultProps || {};
    (Text as any).defaultProps.style = { fontFamily: kufi };
    (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
    (TextInput as any).defaultProps.style = { fontFamily: kufi };
  } else {
    // English: clear any previously set Arabic font override
    if ((Text as any).defaultProps?.style?.fontFamily?.includes('NotoKufi')) {
      (Text as any).defaultProps.style = {};
    }
    if ((TextInput as any).defaultProps?.style?.fontFamily?.includes('NotoKufi')) {
      (TextInput as any).defaultProps.style = {};
    }
  }

  if (!isReady) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider config={config} screens={screens}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <PaperProvider theme={buildPaperTheme(isDark)}>
              <RootNavigator />
            </PaperProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ConfigProvider>
    </I18nextProvider>
  );
};

// ─── NeobitBuilder — Instance / Template Pattern ───────────────────────────────

/**
 * NeobitBuilder is the main entry point for initialising the Neobit framework.
 *
 * Create an instance, configure it step-by-step with the fluent API, then call
 * `.launch()` to obtain the React component that you export as your app root.
 *
 * @example
 * // index.js / App.js
 * import { NeobitBuilder } from 'neobit-builder';
 *
 * const app = NeobitBuilder.create()
 *   .withConfig({ api: { baseUrl: 'https://api.example.com' }, ... })
 *   .withScreens({ Login: MyCustomLogin })
 *   .launch();   // ← returns a React.FC, ready to register
 *
 * export default app;
 */
export class NeobitBuilder {
  private _config: NeobitConfig | undefined;
  private _screens: ScreenOverrides | undefined;

  // ── Private constructor — use NeobitBuilder.create() ──────────────────────
  private constructor() {}

  /** Create a fresh NeobitBuilder instance (the starting point). */
  static create(): NeobitBuilder {
    return new NeobitBuilder();
  }

  /** Set / override the app config. Returns `this` for chaining. */
  withConfig(config: NeobitConfig): this {
    this._config = config;
    return this;
  }

  /** Set / override custom screen components. Returns `this` for chaining. */
  withScreens(screens: ScreenOverrides): this {
    this._screens = screens;
    return this;
  }

  /**
   * Finalise the configuration and return a ready-to-use React component.
   * This is what you export as the root of your app.
   */
  launch(): React.FC {
    const config = this._config;
    const screens = this._screens;

    const App: React.FC = () => (
      <NeobitRoot config={config} screens={screens} />
    );
    App.displayName = 'NeobitApp';
    return App;
  }
}

// ─── Legacy named export (backwards compat) ────────────────────────────────────
/** @deprecated Use `NeobitBuilder.create().withConfig(...).launch()` instead. */
export const NeobitApp: React.FC<NeobitAppProps> = (props) => (
  <NeobitRoot {...props} />
);
