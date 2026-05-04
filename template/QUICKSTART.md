# {{APP_NAME}} — Quick Start (5 Minutes)

Your app is ready! Follow these steps to get it running.

---

## ✅ You Already Have

- ✓ Complete React Native project scaffolded
- ✓ Firebase & authentication setup templates
- ✓ Navigation (tabs + auth stack) pre-wired
- ✓ Dark/Light mode theme system
- ✓ Arabic + English i18n with RTL support
- ✓ All dependencies installed
- ✓ Native fonts linked to Android/iOS

---

## 🚀 Step 1: Start Metro (Dev Server)

```bash
npm start
```

**You should see:**
```
                     Welcome to Metro
          Fast - Scalable - Integrated

...
To reload the app press 'r'
To open developer menu press 'd'
```

**Keep this terminal open!** Metro watches your code changes.

---

## 🚀 Step 2: Run on Your Device

**Choose one:**

### Android Emulator / Device
Open **new terminal** in same folder:
```bash
npm run android
```

### iOS Simulator / Device
Open **new terminal** in same folder:
```bash
# First time only:
npm run ios:pods

# Then:
npm run ios
```

---

## ✨ Step 3: Test the App

You should see:
1. **Splash Screen** (NeoBit branded)
2. **Login Screen** with email/password fields
3. **Social buttons** (Google, Apple if enabled)

### Demo Login
- Email: `demo@example.com`
- Password: `demo1234`

---

## 🔥 Step 4: Add Firebase Credentials

### For Android:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select project matching `{{APP_NAME}}`
3. Add Android app with package: `{{BUNDLE_ID}}`
4. Download `google-services.json`
5. Save to: **`android/app/google-services.json`**

### For iOS:
1. In Firebase Console, add iOS app
2. Download `GoogleService-Info.plist`
3. Open Xcode: `open ios/{{APP_NAME}}.xcworkspace`
4. Drag plist into Xcode → add to **all targets**

---

## 📝 Step 5: Configure Your App

Edit `src/App.tsx` and update:

```tsx
.withConfig({
  identity: {
    appName: '{{APP_NAME}}',
    displayName: '{{DISPLAY_NAME}}',
  },
  theme: {
    primaryColor: '{{PRIMARY_COLOR}}',  // Change brand color
  },
  api: {
    baseUrl: 'https://your-api.com/api',  // Your backend
  },
  features: {
    googleSignIn: {{GOOGLE_SIGN_IN}},
    appleSignIn: {{APPLE_SIGN_IN}},
  },
})
```

Save → See changes instantly! (Metro's Fast Refresh)

---

## 🎨 Common Customizations

### Change Primary Color
Edit `src/App.tsx`:
```tsx
primaryColor: '#FF5733',  // Your brand hex
```

### Change App Name
Edit `app.json`:
```json
{
  "displayName": "My Cool App"
}
```

### Hide Features
Edit `src/App.tsx`:
```tsx
features: {
  googleSignIn: false,    // Hide Google button
  appleSignIn: false,     // Hide Apple button
}
```

---

## 📚 Next Steps

### For Complete Setup:
Read **SETUP.md** (in this folder) for:
- Firebase authentication details
- Environment variables
- Building for production
- Troubleshooting
- Project structure

### For Development:
1. Edit `src/screens/` to customize screens
2. Edit `src/components/` to add UI elements
3. Edit `src/App.tsx` to change app config
4. Edit `src/i18n/` to add translations

### For API Integration:
1. Update API base URL in `src/App.tsx`
2. Implement endpoints in `src/services/api.ts`
3. Update Zustand stores in `src/store/`

---

## 🚨 If Something Goes Wrong

### App won't start?
```bash
npm start -- --reset-cache
npm run android  # or npm run ios
```

### Icons show as "X"?
```bash
npm run link:fonts
npm run android -- --reset-cache
```

### Metro shows errors?
Check the error in the Metro console, fix, and save.
Metro auto-reloads when you save!

### Need more help?
Read **SETUP.md** — it has detailed troubleshooting.

---

## 📱 Files You'll Edit

```
src/
├── App.tsx                    ← App configuration
├── screens/
│   ├── LoginScreen/           ← Customize login
│   ├── HomeScreen/            ← Your main screen
│   └── ProfileScreen/         ← User profile
├── components/                ← Add your UI elements
├── stores/
│   └── authStore.ts           ← Auth state
└── i18n/
    ├── en.json                ← English text
    └── ar.json                ← Arabic text
```

Everything else is framework code — you don't need to touch it!

---

## 🎯 Typical Development Flow

1. **Terminal 1:** `npm start` (keep running)
2. **Terminal 2:** `npm run android` or `npm run ios`
3. Edit files in `src/`
4. See changes instantly!
5. Test in emulator/device
6. Commit when ready

---

## 💡 Pro Tips

- **Hot Reload:** Save a file → see changes in 1 second
- **Full Rebuild:** Press `R` twice in Metro console or `npm start -- --reset-cache`
- **Debug:** Use `console.log()` — output appears in Metro console
- **Dark Mode:** Swipe down on settings screen to toggle
- **Language:** Tap language in settings to switch AR ↔ EN

---

## 📞 Still Need Help?

- Read **SETUP.md** (comprehensive guide)
- Visit [React Native Docs](https://reactnative.dev)
- Check [Firebase Docs](https://firebase.google.com/docs)
- Open [NeoBit GitHub](https://github.com/ibrahimhamed11/neobit-builder)

---

**You're all set! Happy coding! 🚀**

Next: Open **SETUP.md** for Firebase configuration and production builds.
