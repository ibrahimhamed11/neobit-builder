# {{APP_NAME}} — Setup Guide

Welcome to your {{APP_NAME}} project! This guide covers Firebase setup, common issues, and customization.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Link Fonts & Modules (Required!)
This step links vector icon fonts and custom fonts for Android/iOS:
```bash
npx react-native link                    # Link all fonts
# On Windows: use `npm run android:link` or manual setup
```

### 3. iOS Setup
```bash
npm run ios:pods  # Link native pods (required once)
npm start         # Start Metro dev server
npm run ios       # In another terminal
```

### 4. Android Setup
```bash
npm start         # Start Metro dev server
npm run android   # In another terminal
```

**⚠️ If icons still show as "X" on Android:**
- Run `npx react-native link` again
- Or rebuild: `npm run android -- --reset-cache`

---

## Firebase Setup

### Android
1. Download `google-services.json` from Firebase Console
2. Place it at: `android/app/google-services.json`
3. Update `android/build.gradle` if needed (usually auto-configured)

### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Drag it into Xcode project (in iOS folder)
3. Ensure it's added to all targets

---

## Common Issues & Fixes

### ❌ Module Resolution Errors (ConfigContext, sampleData)
**Error:** `Unable to resolve module ../../config/ConfigContext` or `../../data/sampleData`

**Fix:** Clear Metro cache:
```bash
npm start -- --reset-cache
```

Or:
```bash
rm -rf node_modules/.cache
npm start
```

Then rebuild:
```bash
npm run android    # or npm run ios
```

### ❌ Icon Display Issues ("X" instead of icons)
**Error:** Icons show as "X" instead of the material icons (especially on Android)

**Quick Fix:**
```bash
# 1. Link fonts
npm run link:fonts

# 2. Clear all caches
npm start -- --reset-cache
rm -rf node_modules/.cache
cd android && ./gradlew clean && cd ..

# 3. Rebuild
npm run android
```

**If still not working:**
- **Android:** Check `android/app/src/main/assets/fonts/` has `.ttf` files
- **iOS:** Run `npm run ios:pods` then `npm run ios`
- Last resort: Delete `node_modules` and `npm install --legacy-peer-deps` again

### ❌ Language Switch Not Refreshing
**Error:** Changing language doesn't update the UI or direction

**Fix:** This is intentional — the app restarts when switching between RTL (Arabic) and LTR (English). 

If it's not restarting:
1. Check that `AppRestartModule` is properly linked:
   - **Android:** Check `android/app/src/main/java/com/yourcompany/yourapp/AppRestartModule.kt` exists
   - **iOS:** Check that `AppRestartModule.m` is in your Xcode project
2. Rebuild: `npm run android` or `npm run ios`

### ❌ Metro Cache Issues
The dev server caches module resolution. If you add new files and get module-not-found errors:
```bash
npm start -- --reset-cache
```

### ❌ "Text shows as 'x'" (Arabic Font Not Loaded)
**Error:** Arabic text shows garbled or fallback characters

**Fix:** Ensure fonts are linked:
```bash
# Android
npm run android -- --reset-cache

# iOS (rebuild Pods)
npm run ios:pods
npm run ios
```

---

## Customization

### Change Primary Color
Edit `src/App.tsx`:
```tsx
.withConfig({
  theme: {
    primaryColor: '#YOUR_HEX_COLOR',  // Change this
  },
})
```

### Add Custom Screens
1. Create your screen in `src/screens/YourScreen/index.tsx`
2. Add to the navigation stack in `src/navigation/RootNavigator.tsx`

### Customize API Endpoints
Edit `src/App.tsx`:
```tsx
.withConfig({
  api: {
    baseUrl: 'https://your-api.com/api',
  },
})
```

### Toggle Features
Edit `src/App.tsx` to enable/disable features:
```tsx
.withConfig({
  features: {
    googleSignIn: true,    // Google sign-in
    appleSignIn: true,     // Apple sign-in
    pushNotifications: true, // FCM / Push notifications
  },
})
```

---

## Project Structure

```
src/
├── api/             # API calls & services
├── components/      # Reusable components (Button, Input, etc.)
├── config/          # App configuration (ConfigContext, NeobitConfig)
├── data/            # Mock/sample data
├── hooks/           # Custom React hooks
├── i18n/            # Translations (ar.json, en.json)
├── navigation/      # Navigation stacks & routes
├── screens/         # Screen components (Login, Home, Profile, etc.)
├── store/           # Zustand stores (auth, theme, language)
├── theme/           # Design tokens (colors, spacing, fonts)
├── types/           # TypeScript interfaces
└── utils/           # Helper functions
```

---

## Demo Credentials (if demoMode enabled)

Default test account:
- **Email:** demo@example.com
- **Password:** demo1234

This only works if `features.demoMode: true` in your config.

---

## Backend API Contract

Your app expects these endpoints (customize as needed):

### Authentication
- `POST /auth/login` — Login with email/password
- `POST /auth/signup` — Create account
- `POST /auth/forgot-password` — Send reset email
- `GET /auth/verify-email` — Verify email token

### User Profile
- `GET /user/profile` — Get current user
- `PUT /user/profile` — Update profile
- `GET /user/stats` — Dashboard stats
- `GET /user/notifications` — Notification list

Implement these in `src/services/api.ts` and update the store accordingly.

---

## Need Help?

- 📖 [NeoBit Package Docs](https://github.com/ibrahimhamed11/neobit-builder)
- 🔗 [React Native Docs](https://reactnative.dev/)
- 📱 Check Metro console (run `npm start`) for errors

---

**Happy coding! 🚀**
