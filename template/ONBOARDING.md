# {{APP_NAME}} — Onboarding Checklist

Use this checklist to ensure your app is properly set up before starting development.

---

## 📋 Pre-Development Setup

### Phase 1: Initial Installation (5 minutes)

- [ ] **Navigated to project:** `cd {{APP_NAME}}`
- [ ] **Installed dependencies:** `npm install --legacy-peer-deps`
- [ ] **iOS CocoaPods installed:** `npm run ios:pods` (macOS only)
- [ ] **Metro dev server running:** `npm start`
- [ ] **App runs on Android:** `npm run android` (or emulator)
- [ ] **App runs on iOS:** `npm run ios` (or simulator)

### Phase 2: Firebase Setup (15 minutes)

#### Create Firebase Project
- [ ] Created Firebase project: [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Project name: `{{APP_NAME}}`
- [ ] Google Analytics: Enabled ✓

#### Android Firebase Setup
- [ ] Registered Android app in Firebase
  - Package name: `{{BUNDLE_ID}}`
- [ ] Downloaded `google-services.json`
- [ ] Saved to: `android/app/google-services.json`
- [ ] Verified file exists: `ls -la android/app/google-services.json`

#### iOS Firebase Setup (macOS only)
- [ ] Registered iOS app in Firebase
  - Bundle ID: `{{BUNDLE_ID}}`
- [ ] Downloaded `GoogleService-Info.plist`
- [ ] Opened Xcode: `open ios/{{APP_NAME}}.xcworkspace`
- [ ] Added plist to all targets in Xcode
- [ ] Rebuilt iOS: `npm run ios`

#### Firebase Authentication
- [ ] Enabled Email/Password auth
- [ ] Enabled Google Sign-In (if `googleSignIn: true`)
- [ ] Enabled Apple Sign-In (if `appleSignIn: true`)

### Phase 3: Environment Configuration (10 minutes)

#### Create .env.local
- [ ] Created `.env.local` file (not committed)
- [ ] Added Firebase credentials:
  ```env
  FIREBASE_API_KEY=xxx
  FIREBASE_AUTH_DOMAIN=xxx
  FIREBASE_PROJECT_ID=xxx
  ```
- [ ] Added API configuration:
  ```env
  API_BASE_URL=https://your-api.com/api
  API_TIMEOUT=10000
  ```

#### Configure App
- [ ] Updated `src/App.tsx` with:
  - [ ] App name: `appName: '{{APP_NAME}}'`
  - [ ] Display name: `displayName: '{{DISPLAY_NAME}}'`
  - [ ] Primary color: `primaryColor: '{{PRIMARY_COLOR}}'`
  - [ ] API base URL: `baseUrl: process.env.API_BASE_URL`
  - [ ] Enabled features (Google, Apple, Push, etc.)
- [ ] Tested app still runs: `npm start`

---

## 🎨 Customization

### Phase 4: Brand Customization (20 minutes)

#### Visual Design
- [ ] Updated primary color in `src/App.tsx`
- [ ] Updated app display name in `app.json` and `src/App.tsx`
- [ ] Checked app icon displays correctly
- [ ] Verified fonts display properly (no "X" icons)

#### Navigation & Screens
- [ ] Reviewed navigation structure in `src/navigation/RootNavigator.tsx`
- [ ] Identified screens to customize:
  - [ ] LoginScreen (`src/screens/LoginScreen/`)
  - [ ] HomeScreen (`src/screens/HomeScreen/`)
  - [ ] ProfileScreen (`src/screens/ProfileScreen/`)
- [ ] Added custom screens as needed in `src/screens/`

#### Translations
- [ ] Added custom text to `src/i18n/en.json` (English)
- [ ] Added custom text to `src/i18n/ar.json` (Arabic)
- [ ] Tested language switching in app settings
- [ ] Verified RTL works for Arabic

### Phase 5: Feature Configuration (15 minutes)

#### Authentication Features
- [ ] Decided: Google Sign-In enabled? Updated `src/App.tsx`
- [ ] Decided: Apple Sign-In enabled? Updated `src/App.tsx`
- [ ] Decided: Guest mode enabled? Updated `src/App.tsx`
- [ ] Decided: Email verification required? Updated `src/App.tsx`

#### Firebase Features
- [ ] Decided: Firebase Analytics needed? Updated `src/App.tsx`
- [ ] Decided: Crashlytics enabled? Updated `src/App.tsx`
- [ ] Decided: Push notifications (FCM) enabled? Updated `src/App.tsx`
- [ ] Decided: Remote Config needed? Updated `src/App.tsx`

#### Additional Features
- [ ] Decided: Biometric auth needed? Updated `src/App.tsx`
- [ ] Decided: Dark mode support? (Enabled by default)
- [ ] Decided: Offline support needed? (Plan API caching)

---

## 🔧 Backend Integration

### Phase 6: API Setup (varies)

#### Backend Readiness
- [ ] Backend API service exists and is accessible
- [ ] Base URL known: `https://your-api.com/api`
- [ ] CORS configured for mobile app domain

#### API Endpoints
- [ ] Implemented: `POST /auth/login`
- [ ] Implemented: `POST /auth/signup`
- [ ] Implemented: `POST /auth/forgot-password`
- [ ] Implemented: `GET /auth/verify-email`
- [ ] Implemented: `GET /user/profile`
- [ ] Implemented: `PUT /user/profile`
- [ ] Implemented: `GET /user/notifications`

#### API Integration in App
- [ ] Updated API base URL in `src/App.tsx`
- [ ] Implemented API calls in `src/services/api.ts`
- [ ] Connected login flow to backend
- [ ] Connected signup flow to backend
- [ ] Connected profile fetch to backend
- [ ] Tested authentication end-to-end

#### Testing Endpoints
- [ ] Tested with Postman / Insomnia
- [ ] All endpoints returning correct data
- [ ] Error handling implemented
- [ ] Timeout and retry logic in place

---

## 📱 Testing

### Phase 7: Quality Assurance (30 minutes)

#### Functional Testing
- [ ] **Authentication Flow:**
  - [ ] Email/password login works
  - [ ] Google Sign-In works (if enabled)
  - [ ] Apple Sign-In works (if enabled)
  - [ ] Password reset works
  - [ ] Logout works

- [ ] **Navigation:**
  - [ ] Auth stack shows for unauthenticated users
  - [ ] App stack shows after login
  - [ ] Bottom tabs work
  - [ ] Back button works
  - [ ] Deep linking works (if implemented)

- [ ] **Theme & Localization:**
  - [ ] Dark mode toggle works
  - [ ] Light mode works
  - [ ] Language switch works (AR ↔ EN)
  - [ ] RTL layout correct for Arabic
  - [ ] LTR layout correct for English

- [ ] **Firebase (if enabled):**
  - [ ] Analytics events firing
  - [ ] Crashlytics reports errors
  - [ ] Push notifications received
  - [ ] Remote Config values loaded

#### Performance Testing
- [ ] App starts in < 3 seconds
- [ ] No laggy scrolling
- [ ] Animations smooth
- [ ] No memory leaks (check DevTools)

#### Device Testing
- [ ] Tested on Android device/emulator
- [ ] Tested on iOS device/simulator
- [ ] Tested on different screen sizes
- [ ] Tested with slow network (throttle in DevTools)

#### Edge Cases
- [ ] Logout and login again
- [ ] Kill app and reopen
- [ ] Switch languages multiple times
- [ ] Toggle dark mode multiple times
- [ ] Test with no internet connection

---

## 🚀 Deployment Preparation

### Phase 8: Production Build Setup (30 minutes)

#### Android Release
- [ ] Updated version in `android/app/build.gradle`
- [ ] Updated version in `package.json`
- [ ] Created/configured signing key
- [ ] Built release APK: `npm run android:build:apk`
- [ ] Built App Bundle: `npm run android:build:bundle`
- [ ] Tested on real device (side-loaded APK)

#### iOS Release
- [ ] Updated version in `ios/{{APP_NAME}}/Info.plist`
- [ ] Updated version in `package.json`
- [ ] Created app in App Store Connect
- [ ] Configured provisioning profiles in Xcode
- [ ] Built for release: Product → Build
- [ ] Archived app: Product → Archive

#### Distribution
- [ ] Uploaded to Google Play Console (Android)
- [ ] Uploaded to TestFlight (iOS)
- [ ] Internal testing completed
- [ ] Ready for external beta testing

---

## 📚 Documentation

### Phase 9: Team Documentation (20 minutes)

#### Project Documentation
- [ ] Read QUICKSTART.md — understand 5-min setup
- [ ] Read SETUP.md — understand detailed setup
- [ ] Read ONBOARDING.md — this checklist
- [ ] Documented custom screens you added
- [ ] Documented API endpoints integrated
- [ ] Documented environment variables needed
- [ ] Created README.md for team

#### Code Documentation
- [ ] Added JSDoc comments to custom components
- [ ] Documented store structure in `src/store/README.md`
- [ ] Documented API structure in `src/services/README.md`
- [ ] Documented custom hooks in `src/hooks/README.md`

#### Team Onboarding
- [ ] Created setup guide for new developers
- [ ] Listed prerequisites (Node, CocoaPods, Xcode, etc.)
- [ ] Documented how to get Firebase credentials
- [ ] Documented how to set up `.env.local`
- [ ] Created troubleshooting guide

---

## 🔐 Security Checklist

### Phase 10: Security Review (20 minutes)

#### Credential Management
- [ ] `google-services.json` in `.gitignore`
- [ ] `GoogleService-Info.plist` in `.gitignore`
- [ ] `.env.local` in `.gitignore`
- [ ] `.env` file in `.gitignore`
- [ ] No Firebase keys in code
- [ ] No API keys in code
- [ ] No private keys in repository

#### Authentication Security
- [ ] Firebase Auth rules configured
- [ ] Email verification enabled (if required)
- [ ] Password requirements enforced
- [ ] Session tokens stored securely
- [ ] HTTPS only for API calls
- [ ] No credentials logged to console

#### API Security
- [ ] API uses HTTPS
- [ ] API implements rate limiting
- [ ] API validates all inputs
- [ ] API implements CORS correctly
- [ ] API has proper error handling
- [ ] API doesn't expose sensitive data

#### Data Privacy
- [ ] Privacy policy written and linked
- [ ] Data collection methods documented
- [ ] User consent implemented (if needed)
- [ ] Data retention policy defined
- [ ] GDPR compliant (if applicable)

---

## ✅ Final Verification

### Phase 11: Final Review (15 minutes)

#### Code Quality
- [ ] Run: `npm run typecheck` (no errors)
- [ ] Code follows project conventions
- [ ] No console.log() in production code
- [ ] No commented-out code
- [ ] No TODO comments left

#### Version Control
- [ ] Git initialized: `git init`
- [ ] `.gitignore` configured correctly
- [ ] Sensitive files not committed
- [ ] First commit created: `git add . && git commit -m "Initial commit"`

#### Release Readiness
- [ ] Version numbers consistent
- [ ] Build runs successfully
- [ ] No unresolved errors or warnings
- [ ] App ready for beta testing
- [ ] Release notes prepared

---

## 🎉 You're Done!

Congratulations! Your app is:

✅ **Technically Ready**
- Scaffolded with modern React Native setup
- Firebase integrated and configured
- Navigation wired up
- Theming and i18n working

✅ **Functionally Complete**
- Authentication flows implemented
- API integrated
- All features tested
- Deployment ready

✅ **Well Documented**
- Team has setup guides
- Code is documented
- Troubleshooting guide available

---

## 📝 Next Steps

1. **For immediate development:**
   - Start with `npm start`
   - Edit `src/screens/` to customize
   - Run on device to test

2. **For team collaboration:**
   - Share QUICKSTART.md and SETUP.md
   - Set up git repository
   - Create pull request templates

3. **For deployment:**
   - Beta test on internal team
   - Get feedback
   - Fix issues
   - Release to app stores

---

## 🆘 Need Help?

- 📖 **SETUP.md** — Comprehensive guide with troubleshooting
- 📱 **QUICKSTART.md** — 5-minute quick start
- 🔗 **[React Native Docs](https://reactnative.dev)**
- 🔥 **[Firebase Docs](https://firebase.google.com/docs)**
- 💬 **[NeoBit GitHub](https://github.com/ibrahimhamed11/neobit-builder)**

---

**Last Updated:** {{DATE}}

**Version:** {{APP_VERSION}}

**Firebase Project:** {{BUNDLE_ID}}

**API Base URL:** {{API_BASE_URL}}
