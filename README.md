# 🚀 create-neobit-app

<p align="center">
  <img src="https://img.shields.io/npm/v/create-neobit-app?color=0F766E&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/create-neobit-app?color=0F766E&style=flat-square" alt="downloads" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/React%20Native-0.76%2B-61DAFB?style=flat-square&logo=react" alt="react native" />
  <img src="https://img.shields.io/badge/TypeScript-ready-3178C6?style=flat-square&logo=typescript" alt="typescript" />
</p>

<p align="center">
  <strong>A complete React Native app framework.</strong><br/>
  Drop in one component — get auth, navigation, theming, i18n (Arabic + English RTL), and a full screen suite instantly.
</p>

---

## ✨ What You Get

| Feature | Description |
|---|---|
| 🔐 **Auth Screens** | Login, Signup, Forgot Password, OTP, Reset Password, Verify Email |
| 🏠 **App Screens** | Home, Profile, Edit Profile, Settings, Notifications, Splash |
| 🎨 **Theme System** | Light/Dark mode, primary color override, 60+ design tokens |
| 🌍 **i18n** | Arabic + English, full RTL with automatic app restart |
| 🧭 **Navigation** | Bottom tabs + native stack, pre-wired and ready |
| 🗂️ **State** | Zustand stores for auth, theme, language — all persisted |
| ⚙️ **Config-driven** | Override colors, API URL, feature flags — one config object |
| 🔌 **Firebase** | Optional Firebase auth (Google, Apple, Email) |

---

## 📦 Installation

```bash
npm install create-neobit-app
# or
yarn add create-neobit-app
```

### Peer Dependencies

```bash
npm install \
  @react-navigation/native \
  @react-navigation/native-stack \
  @react-navigation/bottom-tabs \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  react-native-paper \
  react-native-vector-icons \
  react-native-linear-gradient \
  @react-native-async-storage/async-storage
```

For iOS run `pod install` afterwards.

---

## 🚀 Quick Start — Builder API

```tsx
// App.tsx
import { NeobitBuilder } from 'create-neobit-app';

export default NeobitBuilder.create()
  .withConfig({
    identity: {
      appName: 'MyApp',
      displayName: 'My Application',
    },
    theme: {
      primaryColor: '#0F766E',
      mode: 'system',
    },
    api: {
      baseUrl: 'https://api.myapp.com',
    },
    features: {
      googleSignIn: false,
      appleSignIn: false,
    },
  })
  .launch();
```

That's it — a complete app with auth flow, tabs, dark mode, and Arabic/English RTL support.

---

## 🛠️ Full Configuration Reference

```tsx
NeobitBuilder.create().withConfig({
  // App identity
  identity: {
    appName: 'MyApp',
    displayName: 'My App',
    bundleId: 'com.myapp',
  },

  // Visual theme
  theme: {
    primaryColor: '#0F766E',   // brand color
    mode: 'system',            // 'light' | 'dark' | 'system'
  },

  // API
  api: {
    baseUrl: 'https://api.myapp.com',
    timeout: 10000,
  },

  // Auth
  auth: {
    requireEmailVerification: true,
    rememberMe: true,
  },

  // Feature flags
  features: {
    googleSignIn: false,
    appleSignIn: false,
    remoteConfig: false,
    pushNotifications: false,
    biometricAuth: false,
  },

  // i18n — default is Arabic
  i18n: {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
  },
})
```

---

## 🔌 Custom Screens

Replace any built-in screen with your own:

```tsx
import { NeobitBuilder } from 'create-neobit-app';
import MyHomeScreen from './screens/MyHomeScreen';
import MySplashScreen from './screens/MySplashScreen';

export default NeobitBuilder.create()
  .withConfig({ /* ... */ })
  .withScreens({
    Home: MyHomeScreen,
    Splash: MySplashScreen,
  })
  .launch();
```

---

## 🎨 Theme & Colors

### Use the theme in your own screens

```tsx
import { useAppTheme } from 'create-neobit-app';

const MyComponent = () => {
  const { colors, isDark, isRTL, textAlign, flexDirection } = useAppTheme();

  return (
    <View style={{ backgroundColor: colors.background, flexDirection }}>
      <Text style={{ color: colors.text, textAlign }}>Hello!</Text>
    </View>
  );
};
```

### Toggle dark mode

```tsx
import { useThemeStore } from 'create-neobit-app';

const { setMode, toggleTheme } = useThemeStore();

setMode('dark');     // explicit
toggleTheme();       // flip light ↔ dark
```

### Available color tokens

```ts
colors.primary          // brand teal
colors.background       // screen background
colors.card             // card/surface
colors.text             // primary text
colors.textSecondary    // secondary text
colors.textTertiary     // muted text
colors.border           // dividers
colors.primarySurface   // tinted primary background
colors.error            // error red
colors.errorLight       // light error tint
colors.success          // success green
colors.successLight     // light success tint
colors.headerBackground // top bar background
colors.tabBar           // bottom tab background
colors.overlay          // modal scrim
// ...and 40+ more tokens
```

---

## 🌍 i18n & RTL

Full Arabic + English. RTL is automatic — the app restarts once when language direction changes (loop-prevention built in).

```tsx
import { useLanguage, setAppLanguage, toggleLanguage } from 'create-neobit-app';

// Inside a component:
const { language, isRTL, toggleLanguage } = useLanguage();

// Outside a component (e.g. in a service):
await setAppLanguage('ar');   // sets Arabic + triggers RTL restart if needed
await toggleLanguage();       // flips en ↔ ar
```

### Extend with your own translations

```ts
import i18n from 'i18next';

i18n.addResourceBundle('en', 'myApp', {
  greeting: 'Hello {{name}}!',
});

// In component:
const { t } = useTranslation('myApp');
t('greeting', { name: 'Islam' }); // → "Hello Islam!"
```

---

## 📱 Built-in Screens

### Auth Flow
| Screen | Description |
|---|---|
| **Splash** | Animated boot, i18n init, auth check |
| **Login** | Email/password + social buttons |
| **Signup** | Registration with validation |
| **ForgotPassword** | Email input + success state |
| **ResetOTP** | 6-digit OTP with countdown resend |
| **NewPassword** | Password + confirm with strength rules |
| **VerifyEmail** | Resend link + polling |

### App Flow
| Screen | Description |
|---|---|
| **Home** | Welcome card + quick-action grid |
| **Profile** | User card + stats |
| **EditProfile** | Edit name, phone, language, avatar |
| **Settings** | Full settings (see below) |
| **Notifications** | Notification list with type icons + mark-read |
| **Maintenance** | Shown when remote config sets `maintenanceMode = true` |
| **ForceUpdate** | Shown when app version is below minimum |

### Settings Screen — Complete Feature List
| Item | Behaviour |
|---|---|
| Profile card | Tap → EditProfile |
| Dark Mode | Switch |
| Language | Tap to toggle AR ↔ EN (RTL restart) |
| Notifications toggle | Switch |
| Notifications history | Navigate to Notifications |
| Change Password | Navigate to EditProfile |
| Privacy Policy | Inline modal |
| About App | Modal with version info |
| Contact Support | Opens `mailto:` |
| Rate App | Opens App Store / Play Store |
| Share App | Native share sheet |
| Terms & Conditions | Opens URL |
| Sign Out | Confirmation modal |
| Delete Account | "Type DELETE" confirmation modal |

---

## 🗂️ Stores

```tsx
import { useAuthStore, useThemeStore, useLanguageStore } from 'create-neobit-app';

// Auth
const { user, isAuthenticated, login, logout, isLoading } = useAuthStore();

// Theme
const { mode, isDark, setMode, toggleTheme } = useThemeStore();

// Language
const { language, isRTL, setLanguage } = useLanguageStore();
```

---

## 🧩 Components

```tsx
import {
  AppButton,
  AppInput,
  AppCard,
  AppHeader,
  AppAvatar,
  AppBadge,
  AppDivider,
  AppListItem,
  AppSnackbar,
  EmptyState,
  LoadingOverlay,
  ScreenWrapper,
} from 'create-neobit-app';
```

### AppButton
```tsx
<AppButton
  label="Sign In"
  onPress={handleLogin}
  loading={isLoading}
  variant="primary"    // 'primary' | 'outline' | 'ghost'
/>
```

### AppInput
```tsx
<AppInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  leftIcon="email-outline"
  error={errors.email}
/>
```

### EmptyState
```tsx
<EmptyState
  icon="bell-outline"
  title="No notifications"
  subtitle="You're all caught up!"
/>
```

---

## 🔥 Firebase (Optional)

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

```tsx
NeobitBuilder.create().withConfig({
  features: {
    googleSignIn: true,
    appleSignIn: true,   // iOS only
  },
})
```

The auth service auto-detects Firebase and switches from REST to Firebase auth automatically.

---

## 🔤 Fonts (Arabic-first)

The package uses **NotoKufiArabic** for Arabic and falls back to system fonts for English. Add the font files to your app's assets (see `react-native.config.js` in the example project).

```ts
// Font families exposed:
FontFamily.arabic.regular   // 'NotoKufiArabic-Regular'
FontFamily.arabic.medium    // 'NotoKufiArabic-Medium'
FontFamily.arabic.semiBold  // 'NotoKufiArabic-SemiBold'
FontFamily.arabic.bold      // 'NotoKufiArabic-Bold'
FontFamily.arabic.extraBold // 'NotoKufiArabic-ExtraBold'
```

---

## 📐 Project Structure

```
neobit-builder/
├── src/
│   ├── NeobitApp.tsx          ← NeobitBuilder class + root component
│   ├── api/                   ← Axios client + auth/user services
│   ├── components/            ← Reusable UI components
│   ├── config/                ← NeobitConfig type + ConfigContext
│   ├── hooks/                 ← useAppTheme
│   ├── i18n/                  ← initI18n, RTL manager, language hooks
│   │   └── locales/           ← en.json + ar.json (full translations)
│   ├── navigation/            ← AuthStack, AppStack, MainTabs, RootNavigator
│   ├── screens/               ← All built-in screens
│   ├── store/                 ← authStore, themeStore, languageStore (Zustand)
│   ├── theme/                 ← colors, light, dark, fonts, spacing
│   └── types/                 ← TypeScript types & navigation param lists
```

---

## 🤝 Contributing

```bash
git clone https://github.com/ibrahimhamed11/neobit-builder
cd neobit-builder
npm install
npm run build
cd example && npm install && npm run android
```

---

## 📄 License

MIT © [Ibrahim Hamed](https://github.com/ibrahimhamed11)
