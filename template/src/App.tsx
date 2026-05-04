/**
 * {{APP_NAME}} — powered by create-neobit-app
 *
 * Customize withConfig() to change colors, API URL, features, and language.
 * To override individual screens, use .withScreens({ Home: MyHomeScreen }).
 */
import { NeobitBuilder } from 'create-neobit-app';

export default NeobitBuilder.create()
  .withConfig({
    identity: {
      appName: '{{APP_NAME}}',
      displayName: '{{DISPLAY_NAME}}',
      bundleId: '{{BUNDLE_ID}}',
    },
    theme: {
      primaryColor: '{{PRIMARY_COLOR}}',
      mode: 'system',
    },
    api: {
      baseUrl: '{{API_BASE_URL}}',
    },
    auth: {
      requireEmailVerification: true,
      rememberMe: true,
    },
    features: {
      googleSignIn: {{GOOGLE_SIGN_IN}},
      appleSignIn: {{APPLE_SIGN_IN}},
      pushNotifications: {{FCM}},
      remoteConfig: {{REMOTE_CONFIG}},
    },
    i18n: {
      defaultLanguage: 'ar',
      supportedLanguages: ['ar', 'en'],
    },
  })
  .launch();
