# How to Use Neobit Builder Package

## Installation & Setup

### 1. Install Package
```bash
npm install neobit-builder
# or with local file reference:
npm install file:../neobit-builder
```

### 2. Create App Entry Point (app.js or App.tsx)
```javascript
import React from 'react';
import { NeobitApp } from 'neobit-builder';

export default function App() {
  return (
    <NeobitApp
      config={{
        theme: { primaryColor: '#1a7f5a', mode: 'system' },
        identity: { appName: 'MyApp', displayName: 'My App' },
        api: { baseUrl: 'https://api.example.com/api' },
        features: {
          googleSignIn: false,
          appleSignIn: false,
          guestMode: true,
          remoteConfig: false,
          pushNotifications: false,
        },
      }}
    />
  );
}
```

**That's it!** NeobitApp handles:
- ✅ i18n initialization (English & Arabic)
- ✅ Theme management (Light/Dark)
- ✅ Authentication navigation
- ✅ All screens and components
- ✅ Material Community Icons

## What's Included

### ✅ Authentication
- Login / Signup screens
- Email verification
- Password reset
- Guest mode support
- Auth state management (Zustand)

### ✅ Internationalization (i18n)
- **Supported Languages:** English (en), Arabic (ar)
- **Automatic Language Detection:** Detects system language
- **RTL Support:** Automatic for Arabic
- **Translations:** Common, Auth, Navigation, Home, Profile, Settings

### ✅ Icons
- **Material Community Icons** from react-native-vector-icons
- All navigation and form icons included
- Icons render properly with native font linking

### ✅ Navigation
- **Auth Stack:** Login, Signup, Password Reset screens
- **App Stack:** Home, Profile, Settings, Fixes tabs
- **Bottom Tab Navigation:** With i18n labels and icons
- **Automatic Routing:** Based on auth state

### ✅ Theme
- Light / Dark mode support
- Customizable primary color
- Theme persistence with AsyncStorage

## Development Setup

### Run Example App
```bash
cd example

# Clean build
npm run clean:metro

# Start dev server with cache reset
npm run start:reset

# In another terminal: build & run APK
npm run android
```

### Force Fresh Bundle
```bash
# Kill all metro/react-native processes
pkill -f "react-native\|metro"

# Clear all caches
rm -rf /tmp/metro-*
rm -rf node_modules/.cache
watchman watch-del-all

# Reinstall deps
npm install

# Clean Android build
npm run android:clean

# Fresh build & run
npm run android
```

## Translation Keys

Access translations with `useTranslation()` hook from react-i18next:

```javascript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('common.loading')}</Text>;
}
```

### Available Translation Keys:
- `common.*` - Loading, Error, Success, Cancel, Save, Delete, Edit, Back, Logout
- `auth.*` - Login, Signup, Email verification, Password reset
- `navigation.*` - Home, Profile, Settings, Fixes
- `home.*` - Welcome, Title
- `profile.*` - Profile, Edit Profile, Display Name, Email, Phone, Logout
- `settings.*` - Settings, Language, Theme, Dark Mode, Notifications, About

## Switch Language Programmatically

```javascript
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <>
      <Button onPress={() => switchLanguage('en')}>English</Button>
      <Button onPress={() => switchLanguage('ar')}>العربية</Button>
    </>
  );
}
```

## Troubleshooting

### Icons Not Showing
- Ensure `react-native.config.js` exists in Android project
- Run: `npm run android:clean` to rebuild native modules
- Clear Android build cache: `rm -rf android/build`

### Old Code Still Running
- Kill all processes: `pkill -f "react-native\|metro\|node.*bundle"`
- Clear cache: `rm -rf /tmp/metro-*`
- Rebuild: `npm run android`

### I18n Not Loading
- Ensure I18nextProvider wraps the app (it's in NeobitApp)
- Check translations are in `src/i18n/locales/*.json`
- Verify language JSON files exist

### Network Errors
- Expected in example app (no real backend)
- Configure real API endpoint in NeobitApp config
- Mock responses for testing

