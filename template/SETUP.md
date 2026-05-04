# {{APP_NAME}} — Complete Setup Guide

Welcome to your {{APP_NAME}} project! This guide covers initial setup, Firebase configuration, development workflow, and troubleshooting.

---

## 📋 Table of Contents
1. [Initial Setup (Step 1-5)](#initial-setup)
2. [Firebase Configuration](#firebase-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running on Devices](#running-on-devices)
5. [Development Workflow](#development-workflow)
6. [Building for Production](#building-for-production)
7. [Customization](#customization)
8. [Common Issues & Fixes](#common-issues--fixes)
9. [Project Structure](#project-structure)

---

## Initial Setup

### Step 1: Navigate to Project Directory
```bash
cd {{APP_NAME}}
```

### Step 2: Install Dependencies
```bash
npm install --legacy-peer-deps
```

**What this does:**
- Installs all npm packages (React Native, Firebase, Navigation, etc.)
- Runs postinstall scripts to link native fonts
- Sets up the development environment

**⏱️ Expect 3-5 minutes depending on internet speed**

### Step 3: iOS Setup (If building for iOS)
```bash
npm run ios:pods
```

**What this does:**
- Installs CocoaPods dependencies (required for native iOS modules)
- Links Firebase, React Native, and other native modules
- **Run this once after initial setup, or when native dependencies change**

**Prerequisites:**
- macOS (required for iOS development)
- Xcode installed (`xcode-select --install` if needed)
- CocoaPods (`sudo gem install cocoapods` if needed)

### Step 4: Verify Installation
Check that critical files exist:

**Android:**
```bash
# Fonts should be linked
ls android/app/src/main/assets/fonts/ | wc -l    # Should show 25+

# Native modules should exist
ls android/app/src/main/java/com/*/  # Should show Java files
```

**iOS:**
```bash
# Pods installed
ls ios/Pods/ | wc -l    # Should show many packages

# Fonts linked
ls ios/Fonts/ | wc -l   # Should show 25+
```

### Step 5: Start Metro Dev Server
```bash
npm start
```

**What this shows:**
- Metro bundler ready to serve your app code
- Keep this terminal open while developing
- Metro auto-reloads when you save files (Fast Refresh)

**To reset cache later:**
```bash
npm start -- --reset-cache
```

---

## Firebase Setup

> ⚠️ **Critical:** Firebase credentials contain sensitive data. Never commit them to version control. Use `.gitignore` to exclude them (already configured).

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Name: `{{APP_NAME}}`
4. Enable Google Analytics (optional but recommended)

### Step 2: Register Android App

1. In Firebase Console, click **+ Add app** → Select **Android**
2. Fill in:
   - **Package name:** `{{BUNDLE_ID}}`
   - **App nickname:** (optional)
   - **SHA-1 fingerprint:** (get with `npm run android:fingerprint` after first build)
3. Download `google-services.json`
4. Save to: `android/app/google-services.json` (at project root, not in git)

**Verify:**
```bash
ls -la android/app/google-services.json    # Should exist
file android/app/google-services.json      # Should be JSON
```

### Step 3: Register iOS App (if building for iOS)

1. In Firebase Console, click **+ Add app** → Select **iOS**
2. Fill in:
   - **Bundle ID:** `{{BUNDLE_ID}}`
   - **App nickname:** (optional)
3. Download `GoogleService-Info.plist`
4. Open Xcode: `open ios/{{APP_NAME}}.xcworkspace`
5. Drag `GoogleService-Info.plist` into Xcode (add to all targets)

**Verify in Xcode:**
- Left panel → `{{APP_NAME}}` folder
- Should see `GoogleService-Info.plist` file
- Build phases → Copy Bundle Resources → Should include the plist

### Step 4: Configure Authentication Methods (Optional)

In Firebase Console → **Authentication** → **Sign-in method:**

- **Email/Password:** Enable (default, always enabled)
- **Google:** Enable if `googleSignIn: true` in config
- **Apple:** Enable if `appleSignIn: true` in config
- **Anonymous:** Enable for guest mode

### Step 5: Enable Remote Config (Optional)

In Firebase Console → **Remote Config:**

This is useful for feature flags, maintenance mode, and A/B testing. See [Remote Config Setup](#remote-config-setup) below.

---

## Environment Configuration

### Create .env.local File

Create `.env.local` at project root (not committed):

```env
# Firebase
FIREBASE_API_KEY={{FIREBASE_API_KEY}}
FIREBASE_AUTH_DOMAIN={{BUNDLE_ID}}.firebaseapp.com
FIREBASE_PROJECT_ID={{PROJECT_ID}}
FIREBASE_STORAGE_BUCKET={{PROJECT_ID}}.appspot.com
FIREBASE_MESSAGING_SENDER_ID={{MESSAGING_SENDER_ID}}
FIREBASE_APP_ID={{APP_ID}}

# API
API_BASE_URL=https://api.yourbackend.com/api
API_TIMEOUT=10000

# Development
LOG_LEVEL=debug
LOCAL_IP=192.168.1.100
```

Get these values from Firebase Console → **Project Settings** (⚙️ icon) → **Your apps** section.

### Update App Configuration

Edit `src/App.tsx` and configure:

```tsx
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
      mode: 'system',  // 'light' | 'dark' | 'system'
    },
    api: {
      baseUrl: process.env.API_BASE_URL || 'https://api.yourbackend.com/api',
      timeout: 10000,
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
      biometricAuth: false,
    },
    i18n: {
      defaultLanguage: 'ar',  // Arabic by default
      supportedLanguages: ['ar', 'en'],
    },
  })
  .launch();
```

---

## Running on Devices

### Android Emulator / Device

**Start Metro:**
```bash
npm start
```

**In a new terminal, build and run:**
```bash
npm run android
```

**On physical device:**
1. Connect Android device via USB
2. Enable Developer Mode on device
3. Run: `npm run android`
4. App auto-installs and launches

**Troubleshoot:**
```bash
# List connected devices
adb devices

# Kill existing connection and rebuild
adb kill-server
npm run android
```

### iOS Simulator / Device

**Prerequisite:** `npm run ios:pods` (done once during setup)

**Start Metro:**
```bash
npm start
```

**In a new terminal, build and run:**
```bash
npm run ios
```

**On physical device:**
1. Connect iPhone via USB
2. In Xcode: Xcode → Settings → Accounts → Add your Apple ID
3. Run: `npm run ios -- --device`
4. Select your device when prompted

**Troubleshoot:**
```bash
# Reset Pods
rm -rf ios/Pods ios/Podfile.lock
npm run ios:pods
npm run ios
```

---

## Development Workflow

### 1. Start Development Server
```bash
npm start
```

Keep this running. Metro watches for file changes and hot-reloads your app.

### 2. Edit and Test
- Edit `src/screens/`, `src/components/`, `src/stores/`, etc.
- Save files → Metro reloads → See changes instantly
- No rebuild needed for JavaScript changes!

### 3. Test Specific Screens
Edit `src/App.tsx` to show a single screen:

```tsx
import { LoginScreen } from './screens/LoginScreen';

export default function App() {
  return <LoginScreen />;
}
```

Then rebuild: `npm run android` or `npm run ios`

### 4. Using Redux DevTools (Optional)
For debugging Zustand stores:

```bash
npm install zustand-devtools
```

Then in your store:
```tsx
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools((set) => ({
    // ... store logic
  }))
);
```

### 5. Android Studio / Xcode Development
For advanced debugging or native module development:

**Android Studio:**
```bash
open -a "Android Studio" android/
```

**Xcode:**
```bash
open ios/{{APP_NAME}}.xcworkspace
```

---

## Building for Production

### Android Release Build

```bash
# Build APK
npm run android:build:apk

# Or build Bundle (for Play Store)
npm run android:build:bundle
```

**Before building:**
1. Update version in `android/app/build.gradle`
2. Create/update signing key
3. Ensure `google-services.json` is in place

**Output:**
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- Bundle: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Release Build

```bash
# Build for App Store
npm run ios:build

# Or manually in Xcode
open ios/{{APP_NAME}}.xcworkspace
# → Product → Build for → Running
```

**Before building:**
1. Update version in `ios/{{APP_NAME}}/Info.plist`
2. Ensure provisioning profiles are set up in Xcode
3. Ensure `GoogleService-Info.plist` is added to targets

---

## Customization

### Change Primary Color
Edit `src/App.tsx`:
```tsx
.withConfig({
  theme: {
    primaryColor: '#FF5733',  // Change this hex color
  },
})
```

### Change App Display Name
Edit `app.json`:
```json
{
  "name": "{{APP_NAME}}",
  "displayName": "My Cool App"
}
```

Also update `src/App.tsx`:
```tsx
.withConfig({
  identity: {
    displayName: 'My Cool App',
  },
})
```

### Add Custom Screens
1. Create `src/screens/YourScreen/index.tsx`
2. Export from `src/screens/index.ts`
3. Add to navigation in `src/navigation/RootNavigator.tsx`

Example:
```tsx
// src/screens/YourScreen/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const YourScreen: React.FC = ({ navigation }) => {
  const { colors } = useAppTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Your Screen</Text>
    </View>
  );
};

export default YourScreen;
```

### Customize API Endpoints
Edit `src/App.tsx`:
```tsx
.withConfig({
  api: {
    baseUrl: 'https://api.yourcompany.com/v1',
    timeout: 15000,
  },
})
```

Then implement endpoints in `src/services/api.ts`.

### Toggle Features
Edit `src/App.tsx`:
```tsx
.withConfig({
  features: {
    googleSignIn: true,
    appleSignIn: true,
    pushNotifications: true,
    remoteConfig: true,
    biometricAuth: true,
  },
})
```

### Add Translations
Edit JSON files:
- `src/i18n/en.json` — English translations
- `src/i18n/ar.json` — Arabic translations

Use in components:
```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('home.welcome')}</Text>;
};
```

### Customize Theme Colors
Edit `src/theme/index.ts` to add custom color tokens:

```ts
export const colors = {
  primary: '#0F766E',
  secondary: '#FF5733',
  // ... add more
};
```

---

## Common Issues & Fixes

### ❌ "Unable to resolve module" Error
**Error:** `Unable to resolve module ../../config/ConfigContext` or similar

**Fix:**
```bash
npm start -- --reset-cache
```

Then rebuild:
```bash
npm run android    # or npm run ios
```

### ❌ Icons Show as "X"
**Why:** Fonts aren't linked to native directories

**Fix:**
```bash
# Re-link fonts
npm run link:fonts

# Clear caches
npm start -- --reset-cache

# Rebuild
npm run android -- --reset-cache
# or
npm run ios:pods
npm run ios
```

**Verify fonts exist:**
```bash
ls android/app/src/main/assets/fonts/ | wc -l    # Should show 25+
ls ios/Fonts/ | wc -l                            # Should show 25+
```

### ❌ Firebase Not Working
**Error:** Firebase methods fail or app crashes on auth

**Fix:**
1. Verify `google-services.json` is in `android/app/` (not node_modules)
2. Verify `GoogleService-Info.plist` is in Xcode project (added to targets)
3. Rebuild: `npm run android` or `npm run ios`

**Check files exist:**
```bash
cat android/app/google-services.json | head -20    # Should be valid JSON
file ios/{{APP_NAME}}/GoogleService-Info.plist     # Should be a plist
```

### ❌ Language Switch Not Refreshing
**Expected behavior:** App restarts when switching between RTL (Arabic) and LTR (English)

**If not restarting:**
1. Verify `AppRestartModule` is linked:
   - **Android:** `android/app/src/main/java/com/*/AppRestartModule.kt` should exist
   - **iOS:** `ios/{{APP_NAME}}/AppRestartModule.m` should exist
2. Rebuild: `npm run android` or `npm run ios`

### ❌ Metro Cache Issues
Clear Metro cache:
```bash
rm -rf $TMPDIR/metro-*
npm start -- --reset-cache
```

### ❌ "Text shows as 'X'" (Arabic Font)
**Why:** Arabic font not loaded

**Fix:**
```bash
npm run android -- --reset-cache
# or
npm run ios:pods
npm run ios
```

### ❌ "Too many open files" (macOS)
**Why:** macOS file limit reached during development

**Fix:**
```bash
ulimit -n 65536
npm start
```

### ❌ Gradle Build Fails (Android)
**Fix:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### ❌ Pod Install Fails (iOS)
**Fix:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

---

## Remote Config Setup (Optional)

Firebase Remote Config lets you update app behavior without releasing a new version.

### 1. Enable Remote Config
In Firebase Console → **Remote Config** → Create your first parameter

Example parameters:
```json
{
  "maintenanceMode": {
    "defaultValue": false,
    "description": "Show maintenance screen"
  },
  "minimumAppVersion": {
    "defaultValue": "1.0.0",
    "description": "Minimum version required"
  },
  "featureFlagNewUI": {
    "defaultValue": false,
    "description": "Enable new UI design"
  }
}
```

### 2. Use in App
```tsx
import remoteConfig from '@react-native-firebase/remote-config';

useEffect(() => {
  remoteConfig()
    .fetchAndActivate()
    .then(() => {
      const maintenanceMode = remoteConfig().getValue('maintenanceMode').asBoolean();
      if (maintenanceMode) {
        // Show maintenance screen
      }
    });
}, []);
```

---

## Project Structure

```
{{APP_NAME}}/
├── src/
│   ├── App.tsx                 # Entry point (configuration)
│   ├── api/                    # API calls & services
│   ├── components/             # Reusable UI components
│   │   ├── AppButton/
│   │   ├── AppInput/
│   │   └── ... (11 total)
│   ├── hooks/                  # Custom React hooks
│   │   └── useAppTheme.ts
│   ├── i18n/                   # Translations
│   │   ├── en.json
│   │   ├── ar.json
│   │   └── index.ts
│   ├── navigation/             # Navigation stacks
│   │   ├── AuthStack.tsx
│   │   ├── AppStack.tsx
│   │   └── RootNavigator.tsx
│   ├── screens/                # Screen components
│   │   ├── LoginScreen/
│   │   ├── HomeScreen/
│   │   ├── ProfileScreen/
│   │   └── ... (13 screens)
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── languageStore.ts
│   ├── theme/                  # Design tokens
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Helper functions
├── android/
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── assets/fonts/  (fonts auto-linked)
│   │   │       └── java/          (AppRestartModule.kt)
│   │   ├── google-services.json   (Firebase, not committed)
│   │   └── build.gradle
│   └── build.gradle
├── ios/
│   ├── Pods/                   (CocoaPods, auto-installed)
│   ├── {{APP_NAME}}/
│   │   ├── AppRestartModule.m  (language restart)
│   │   └── GoogleService-Info.plist (Firebase, not committed)
│   └── Podfile
├── index.js                    # Entry point (do not modify)
├── app.json                    # React Native config
├── package.json                # Dependencies & scripts
├── metro.config.js             # Metro bundler config
├── .env.local                  # Environment variables (not committed)
├── .gitignore                  # Git ignore rules
└── SETUP.md                    # This file
```

---

## Available Scripts

```bash
# Development
npm start                        # Start Metro dev server
npm run android                  # Build & run on Android
npm run ios                      # Build & run on iOS

# Utilities
npm run ios:pods                 # Install iOS CocoaPods (run once after setup)
npm run link:fonts               # Manually link fonts
npm run android:fingerprint      # Get Android SHA-1 for Firebase
npm run clean                    # Clean build artifacts

# Debugging
npm run typecheck                # TypeScript type checking
```

---

## Demo Credentials

Default test account:
- **Email:** `demo@example.com`
- **Password:** `demo1234`

These only work if demo mode is enabled in `src/App.tsx`.

---

## Backend API Contract

Your app expects these endpoints:

### Authentication
- `POST /auth/login` — Email/password login
- `POST /auth/signup` — Create new account
- `POST /auth/forgot-password` — Send reset email
- `GET /auth/verify-email?token=...` — Verify email
- `POST /auth/reset-password` — Set new password

### User Profile
- `GET /user/profile` — Get current user
- `PUT /user/profile` — Update profile
- `GET /user/stats` — Dashboard statistics
- `GET /user/notifications` — Notification list
- `POST /user/logout` — Logout & invalidate session

Customize in `src/services/api.ts`.

---

## Need Help?

- 📖 [NeoBit Builder Docs](https://github.com/ibrahimhamed11/neobit-builder)
- 🔗 [React Native Docs](https://reactnative.dev/)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 📱 Metro Console: Run `npm start` to see live errors
- 🐛 [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

---

## Tips & Best Practices

1. **Always run `npm start` first** before running android/ios commands
2. **Use `.gitignore`** to avoid committing Firebase credentials and `.env` files
3. **Clear Metro cache** (`npm start -- --reset-cache`) if you encounter strange module errors
4. **Keep dependencies updated:** `npm update` (check breaking changes)
5. **Test on real devices** for accurate performance and behavior
6. **Use TypeScript** for type safety — `npm run typecheck` before committing

---

**Happy coding! 🚀**

Last updated: {{DATE}}
