# 🚀 create-neobit-app

<p align="center">
  <img src="https://img.shields.io/npm/v/create-neobit-app?color=0F766E&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/create-neobit-app?color=0F766E&style=flat-square" alt="downloads" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/React%20Native-0.76%2B-61DAFB?style=flat-square&logo=react" alt="react native" />
  <img src="https://img.shields.io/badge/TypeScript-ready-3178C6?style=flat-square&logo=typescript" alt="typescript" />
</p>

<p align="center">
  <strong>🎯 Build production-ready React Native apps in minutes, not months.</strong><br/>
  Get a complete app framework with authentication, navigation, theming, i18n (Arabic + English RTL),<br/>
  and 20+ pre-built screens. Use as a CLI tool to scaffold new projects or as a library for existing apps.
</p>

---

## 🎯 Two Ways to Use NeoBit

### 1️⃣ **Fastest: CLI Scaffolding** (Recommended for new projects)
```bash
npx create-neobit-app my-app
cd my-app
npm start
```
Creates a **production-ready** React Native app with all features configured and ready to customize.

### 2️⃣ **Flexible: Library Integration** (For existing projects)
```bash
npm install create-neobit-app
# Add peer dependencies...
```
Drop the `NeobitBuilder` into your existing app's `App.tsx` and get full features with complete control.

---

## ✨ What You Get

| Feature | Count | Description |
|---|---|---|
| 🔐 **Auth Screens** | 7 screens | Login, Signup, Forgot Password, OTP, Reset Password, Verify Email, Splash |
| 🏠 **App Screens** | 7 screens | Home, Profile, Edit Profile, Settings, Notifications, Maintenance, Force Update |
| 🎨 **Theme System** | 60+ tokens | Light/Dark mode, primary color override, full design system |
| 🌍 **i18n & RTL** | 2 langs | Arabic + English with automatic RTL handling and app restart detection |
| 🧭 **Navigation** | Pre-configured | Bottom tabs + native stack, ready for extensions |
| 🗂️ **State Management** | 3 stores | Zustand with persistence: auth, theme, language |
| 🧩 **UI Components** | 12+ components | Pre-styled buttons, inputs, cards, headers, avatars, lists, etc. |
| ⚙️ **Config-driven** | 100+ options | Override colors, API, features, fonts, spacing via single config |
| 🔌 **Firebase** | Optional | Google, Apple, Email auth with auto-detection |
| 🔐 **Security** | Built-in | Token refresh, secure storage, HTTPS enforcement |
| 🎯 **TypeScript** | Full coverage | Complete type safety end-to-end |
| 📱 **Platform Support** | iOS + Android | Cross-platform with platform-specific optimizations |

---

## 📦 Installation & Setup

### Option A: CLI (Recommended for New Projects)

```bash
npx create-neobit-app my-app
cd my-app
npm install
npm run ios:pods  # iOS only
npm start
```

✅ Everything pre-configured  
✅ All peer dependencies included  
✅ Example screens ready to customize  
✅ Ready for immediate development  

### Option B: Library Installation (For Existing Projects)

```bash
npm install create-neobit-app
# or
yarn add create-neobit-app
```

#### Step 1: Install Peer Dependencies

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
  @react-native-async-storage/async-storage \
  zustand \
  axios \
  i18next \
  react-i18next
```

#### Step 2: Install iOS Pods

```bash
cd ios && pod install && cd ..
```

#### Step 3: Link Assets (Optional but Recommended)

```bash
react-native link react-native-vector-icons
react-native link react-native-linear-gradient
```

> **Troubleshooting**: If Metro won't start on port 8081, run: `npm run fix-metro`

---

## 🚀 Quick Start — Builder API

### Minimal Setup (5 minutes)

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
    },
    api: {
      baseUrl: 'https://api.myapp.com',
    },
  })
  .launch();
```

That's it! 🎉 You now have:
- ✅ Complete auth flow (login, signup, forgot password, OTP verification)
- ✅ Fully styled screen suite (home, profile, settings, notifications)
- ✅ Dark mode + RTL support for Arabic & English
- ✅ Bottom navigation with typed routing
- ✅ Persistent state management
- ✅ Pre-configured API client with auth tokens

### Next Step: Customize

```tsx
// App.tsx
import { NeobitBuilder } from 'create-neobit-app';
import MyHomeScreen from './screens/Home';
import MyProfileScreen from './screens/Profile';

export default NeobitBuilder.create()
  .withConfig({
    identity: { appName: 'MyApp', displayName: 'My App' },
    theme: { primaryColor: '#FF6B6B' },
    api: { baseUrl: 'https://api.myapp.com' },
    features: {
      googleSignIn: true,
      biometricAuth: true,
    },
  })
  .withScreens({
    Home: MyHomeScreen,      // Replace default
    Profile: MyProfileScreen, // Replace default
    // Others use built-in screens
  })
  .launch();
```

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

## 🗂️ State Management (Zustand)

All stores are **automatically persisted** using AsyncStorage.

### Auth Store

```tsx
import { useAuthStore } from 'create-neobit-app';

const MyComponent = () => {
  const {
    user,                 // Current user object
    tokens: {
      accessToken,
      refreshToken,
    },
    isAuthenticated,      // Boolean
    isLoading,            // Loading state
    error,                // Last error
    login,                // (email, password) => Promise
    signup,               // (email, password, name) => Promise
    logout,               // () => Promise
    updateProfile,        // (data) => Promise
    changePassword,       // (old, new) => Promise
    deleteAccount,        // () => Promise
  } = useAuthStore();

  return (
    <>
      {user && <Text>Welcome, {user.name}!</Text>}
      <AppButton
        label={isAuthenticated ? 'Sign Out' : 'Sign In'}
        onPress={isAuthenticated ? logout : () => navigation.navigate('Login')}
      />
    </>
  );
};
```

### Theme Store

```tsx
import { useThemeStore } from 'create-neobit-app';

const MyComponent = () => {
  const {
    mode,              // 'light' | 'dark' | 'system'
    isDark,            // Boolean
    primaryColor,      // Current brand color
    setMode,           // (mode) => void
    toggleTheme,       // () => void
    setPrimaryColor,   // (color) => void
  } = useThemeStore();

  return (
    <>
      <Text>Theme: {mode}</Text>
      <AppButton
        label={isDark ? '☀️ Light' : '🌙 Dark'}
        onPress={toggleTheme}
      />
    </>
  );
};
```

### Language Store

```tsx
import { useLanguageStore } from 'create-neobit-app';

const MyComponent = () => {
  const {
    language,         // 'ar' | 'en'
    isRTL,            // Boolean
    setLanguage,      // (lang) => Promise (triggers RTL restart if needed)
    toggleLanguage,   // () => Promise
  } = useLanguageStore();

  return (
    <>
      <Text>{language === 'ar' ? 'العربية' : 'English'}</Text>
      <AppButton
        label="Toggle Language"
        onPress={toggleLanguage}
      />
    </>
  );
};
```

---

## 🧩 UI Components Library

All components are theme-aware, RTL-compatible, and TypeScript-ready.

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
Multiple variants for every use case.

```tsx
// Primary action
<AppButton
  label="Sign In"
  onPress={handleLogin}
  loading={isLoading}
  variant="primary"    // 'primary' | 'outline' | 'ghost'
/>

// Secondary action
<AppButton
  label="Cancel"
  variant="outline"
  onPress={() => navigation.goBack()}
/>

// Destructive action
<AppButton
  label="Delete"
  variant="primary"
  color="error"
  onPress={handleDelete}
  disabled={!canDelete}
/>
```

### AppInput
Fully featured form field with validation.

```tsx
<AppInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  leftIcon="email-outline"
  rightIcon="close"
  onRightPress={() => setEmail('')}
  error={errors.email}
  helperText="We'll never share your email"
  placeholder="you@example.com"
  editable={!isLoading}
/>
```

### AppCard
Container for content with consistent styling.

```tsx
<AppCard>
  <Text>Card content</Text>
</AppCard>

<AppCard
  pressable
  onPress={() => navigation.navigate('Details')}
  style={{ marginBottom: 16 }}
>
  <Text>Tap me!</Text>
</AppCard>
```

### AppHeader
Top navigation bar with back button & actions.

```tsx
<AppHeader
  title="Profile"
  subtitle="Manage your account"
  onBackPress={() => navigation.goBack()}
  rightAction={{
    icon: 'menu',
    onPress: () => setMenuOpen(true),
  }}
/>
```

### AppAvatar
User profile image with fallback.

```tsx
<AppAvatar
  uri={user.avatar}
  size="large"              // 'small' | 'medium' | 'large'
  initials={user.name}
/>
```

### AppBadge
Status indicators and badges.

```tsx
<AppBadge label="New" variant="success" />
<AppBadge label="3" color="error" />
```

### AppListItem
Consistent list row component.

```tsx
<AppListItem
  title="Dark Mode"
  subtitle="Automatic based on system"
  right={<Switch value={isDark} onValueChange={toggleTheme} />}
  onPress={() => showThemeOptions()}
/>
```

### EmptyState
No-data screens with icon + message.

```tsx
<EmptyState
  icon="bell-outline"
  title="No notifications"
  subtitle="You're all caught up!"
  action={{
    label: 'Check back later',
    onPress: () => {}, // optional
  }}
/>
```

### ScreenWrapper
Safe area + keyboard handling.

```tsx
<ScreenWrapper>
  <Text>Content automatically handles safe areas</Text>
</ScreenWrapper>
```

### LoadingOverlay
Full-screen loading indicator.

```tsx
<LoadingOverlay
  visible={isLoading}
  message="Signing in..."
/>
```

### AppSnackbar
Toast notifications.

```tsx
import { useSnackbar } from 'create-neobit-app';

const { show } = useSnackbar();

show({
  message: 'Profile updated!',
  duration: 3000,
  action: { label: 'Undo', onPress: () => {} },
});
```

---

## 🪝 Hooks & Utilities

### useAppTheme
Get theme colors and RTL info for custom styling.

```tsx
import { useAppTheme } from 'create-neobit-app';

const MyComponent = () => {
  const {
    colors,        // 60+ design tokens
    isDark,        // Boolean
    isRTL,         // Boolean
    textAlign,     // 'left' | 'right'
    flexDirection, // 'row' | 'row-reverse'
  } = useAppTheme();

  return (
    <View style={{
      backgroundColor: colors.background,
      flexDirection,
    }}>
      <Text style={{ color: colors.text, textAlign }}>
        Styled automatically for RTL!
      </Text>
    </View>
  );
};
```

### useSnackbar
Show toast notifications.

```tsx
import { useSnackbar } from 'create-neobit-app';

const MyComponent = () => {
  const { show } = useSnackbar();

  return (
    <AppButton
      label="Show Message"
      onPress={() => show({
        message: 'Success!',
        type: 'success',  // 'success' | 'error' | 'info'
        duration: 3000,
      })}
    />
  );
};
```

### useApi
Pre-configured HTTP client with auth token injection.

```tsx
import { useApi } from 'create-neobit-app';

const MyComponent = () => {
  const api = useApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/profile');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  return <AppButton label="Load Profile" onPress={fetchData} />;
};
```

---

## ⚙️ Advanced Configuration

### Full Config Options

```tsx
NeobitBuilder.create().withConfig({
  // App Identity
  identity: {
    appName: 'MyApp',           // Short name for system
    displayName: 'My App',      // Name shown to users
    bundleId: 'com.myapp.prod', // iOS bundle ID
    packageName: 'com.myapp',   // Android package name
    version: '1.0.0',           // App version
  },

  // Visual Theme
  theme: {
    primaryColor: '#0F766E',
    mode: 'system',             // 'light' | 'dark' | 'system'
    fontFamily: 'custom-font',  // Optional custom font
  },

  // API Configuration
  api: {
    baseUrl: 'https://api.myapp.com',
    timeout: 10000,
    headers: {                  // Custom headers
      'X-App-Version': '1.0.0',
    },
  },

  // Authentication
  auth: {
    requireEmailVerification: true,
    rememberMe: true,
    sessionTimeout: 3600000,   // 1 hour in ms
    refreshTokenEndpoint: '/auth/refresh',
  },

  // Feature Flags
  features: {
    googleSignIn: false,
    appleSignIn: false,         // iOS only
    facebookSignIn: false,
    remoteConfig: false,        // Firebase Remote Config
    pushNotifications: false,   // Firebase Cloud Messaging
    biometricAuth: false,       // Fingerprint/Face ID
    analytics: false,           // Firebase Analytics
  },

  // Internationalization
  i18n: {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    fallbackLanguage: 'en',
  },

  // API Endpoints (for user/auth services)
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/password',
    deleteAccount: '/users/account',
  },
})
```

### Custom API Service

```tsx
// services/customApi.ts
import { useApi } from 'create-neobit-app';

export const useCustomApi = () => {
  const api = useApi();

  return {
    getUser: () => api.get('/users/me'),
    createPost: (title, content) =>
      api.post('/posts', { title, content }),
    uploadFile: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  };
};
```

### Custom Navigation

```tsx
// navigation/CustomNavigator.tsx
import { NeobitBuilder } from 'create-neobit-app';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const MyCustomNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      {/* Your custom screens */}
    </Stack.Navigator>
  );
};

// Use in App.tsx
NeobitBuilder.create()
  .withConfig({...})
  .withNavigator(MyCustomNavigator)
  .launch();
```

---

## 🔥 Firebase Integration (Optional)

### Setup

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
npx react-native-firebase-setup  # Follow prompts
```

### Enable Features

```tsx
NeobitBuilder.create().withConfig({
  features: {
    googleSignIn: true,   // Google OAuth
    appleSignIn: true,    // Apple OAuth (iOS only)
    analytics: false,     // Firebase Analytics
    remoteConfig: true,   // Firebase Remote Config (for feature flags, maintenance mode)
  },
})
```

The auth service **auto-detects** Firebase and switches from REST to Firebase auth automatically.

### Firebase Authentication Flow

```tsx
// Login with Google (Firebase auto-handles this)
const { login } = useAuthStore();
await login(email, password);  // Works with Firebase or REST API

// OR use OAuth directly if needed
const { signInWithGoogle } = useAuthStore();
await signInWithGoogle();
```

### Remote Config (Feature Flags)

```tsx
import { getRemoteConfig } from 'create-neobit-app';

const config = getRemoteConfig();

// Control maintenance mode
if (config.maintenanceMode) {
  // Shows MaintenanceScreen automatically
}

// Feature flags
if (config.newFeatureEnabled) {
  // Show beta feature
}
```

### Firebase Credentials

Add your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) to the root directory. The setup wizard will handle placement.

---

## 🔤 Fonts & Typography

NeoBit is **Arabic-first** with English support. The package uses **NotoKufiArabic** for Arabic and system fonts for English.

### Default Fonts

```ts
import { FontFamily } from 'create-neobit-app';

// Arabic
FontFamily.arabic.regular    // 'NotoKufiArabic-Regular'
FontFamily.arabic.medium     // 'NotoKufiArabic-Medium'
FontFamily.arabic.semiBold   // 'NotoKufiArabic-SemiBold'
FontFamily.arabic.bold       // 'NotoKufiArabic-Bold'
FontFamily.arabic.extraBold  // 'NotoKufiArabic-ExtraBold'

// English (System fonts)
FontFamily.english.regular   // System regular
FontFamily.english.bold      // System bold
```

### Use in Styles

```tsx
<Text style={{
  fontFamily: FontFamily.arabic.bold,
  fontSize: 18,
}}>
  النص العربي
</Text>
```

### Custom Fonts

Add custom fonts to your React Native config:

```js
// react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
};
```

Then run:

```bash
npx react-native-asset ./assets/fonts/
```

---

## 🆘 Troubleshooting

### Metro Won't Start / Port 8081 Error

```bash
npm run fix-metro
```

Or manually kill the process:

```bash
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
npm start
```

### iOS Pod Installation Fails

```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install --repo-update
cd ..
npm start
```

### Android Build Fails

```bash
# Clear Android cache
cd android
./gradlew clean
cd ..
npm run android
```

### RTL Screens Show Wrong Direction

The app restarts automatically when language changes. If it doesn't:

```bash
npm start -- --reset-cache
```

### Firebase Auth Not Working

1. Verify `GoogleService-Info.plist` (iOS) and `google-services.json` (Android) are in place
2. Check Firebase Console → Authentication → Sign-in methods
3. Enable email/password auth if using email-based sign-in

```bash
npm run android  # Rebuild with Firebase
```

### Dark Mode Not Applying

Clear app cache:

```bash
# iOS
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Android
rm -rf android/.gradle
```

Then rebuild:

```bash
npm run ios  # or npm run android
```

### Translations Not Showing

Check that your language code is in `supportedLanguages`:

```tsx
i18n: {
  supportedLanguages: ['ar', 'en'],  // Only these languages work
}
```

Add missing translations:

```tsx
import i18n from 'i18next';

i18n.addResourceBundle('en', 'custom', {
  hello: 'Hello!',
});
```

---

## ✅ Best Practices

### 1. Use Theme Colors Consistently

```tsx
// ❌ Don't hardcode colors
<View style={{ backgroundColor: '#ffffff' }} />

// ✅ Do use theme
const { colors } = useAppTheme();
<View style={{ backgroundColor: colors.background }} />
```

### 2. Handle Auth State Properly

```tsx
import { useAuthStore } from 'create-neobit-app';

const MyComponent = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <LoadingOverlay visible />;

  if (!isAuthenticated) {
    return <EmptyState title="Sign in to continue" />;
  }

  return <View>Your content</View>;
};
```

### 3. Use RTL-Safe Flexbox

```tsx
const { flexDirection, textAlign } = useAppTheme();

// ❌ Don't hardcode
<View style={{ flexDirection: 'row' }} />

// ✅ Do use theme hooks
<View style={{ flexDirection }} />
<Text style={{ textAlign }} />
```

### 4. Persist Custom State

```tsx
// Use Zustand for any custom stores
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCustomStore = create(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),
    }),
    { name: 'custom-storage' }
  )
);
```

### 5. Error Handling in Async Operations

```tsx
const { show } = useSnackbar();

try {
  await authStore.login(email, password);
  navigation.navigate('Home');
} catch (error) {
  show({
    message: error.message || 'Login failed',
    type: 'error',
  });
}
```

### 6. Lazy Load Heavy Screens

```tsx
import { lazy, Suspense } from 'react';

const HeavyScreen = lazy(() => import('./HeavyScreen'));

export const App = () => (
  <Suspense fallback={<LoadingOverlay visible />}>
    <HeavyScreen />
  </Suspense>
);
```

### 7. Optimize List Performance

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  estimatedItemSize={100}
/>
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

---

## ❓ FAQ

**Q: Can I use NeoBit in an existing React Native project?**  
A: Yes! Install via npm and wrap your App component with `NeobitBuilder`. You have full control over what to customize.

**Q: Does NeoBit work with Expo?**  
A: Partially. Some native modules (Firebase, Vector Icons) require native compilation. Use `expo prebuild` or switch to bare React Native.

**Q: How do I customize the auth flow?**  
A: Use `.withScreens()` to replace default screens, or hook into `useAuthStore()` to modify behavior.

**Q: Can I add more languages besides Arabic/English?**  
A: Yes! Modify `i18n.supportedLanguages` in config and add translation files to `i18n/locales/`.

**Q: Is the app size large?**  
A: ~45MB for Android, ~50MB for iOS after all dependencies. NeoBit itself is <2MB.

**Q: How do I integrate with my existing API?**  
A: Configure the `baseUrl` and update the `endpoints` object in the config to match your API routes.

**Q: Can I remove built-in screens I don't need?**  
A: Not directly, but you can hide them via navigation logic or replace them with empty components.

**Q: What's the minimum React Native version?**  
A: 0.73+. We test on 0.76+.

**Q: How do I debug the app?**  
A: Use React Native Debugger or Flipper. Enable `DEBUG=*` environment variable for verbose logs.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# Clone the repo
git clone https://github.com/ibrahimhamed11/neobit-builder
cd neobit-builder

# Install dependencies
npm install

# Build the library
npm run build

# Test with the example app
cd example
npm install
npm run ios:pods
npm start
```

### Development Workflow

1. Make changes in `src/`
2. Run `npm run build` to compile
3. Test in the example app
4. Submit a PR with a clear description

### Reporting Issues

Found a bug? [Open an issue](https://github.com/ibrahimhamed11/neobit-builder/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Device/OS version
- NeoBit version

---

## 📚 Resources

- **Documentation**: [Full Setup Guide](./SETUP.md)
- **Quick Start**: [5-min Guide](./QUICKSTART.md)
- **Example App**: [/example](./example)
- **GitHub**: [ibrahimhamed11/neobit-builder](https://github.com/ibrahimhamed11/neobit-builder)
- **NPM**: [@create-neobit-app](https://npmjs.com/package/create-neobit-app)

---

## 💡 Tips & Tricks

### Speed Up Development

```bash
# Use fast mode with Metro
npm start -- --reset-cache

# Use direct module resolution
npm start -- --verbose
```

### Common Custom Screens

Need a custom screen? Replace it:

```tsx
import CustomAuthFlow from './screens/auth/CustomFlow';

.withScreens({
  Login: CustomAuthFlow,
})
```

### Optimize Bundle Size

```bash
# Analyze bundle
npm run analyze

# Remove unused screens
# Update NeobitBuilder to exclude unused parts
```

---

## 📄 License

MIT © [Ibrahim Hamed](https://github.com/ibrahimhamed11)

**Happy building! 🚀**
