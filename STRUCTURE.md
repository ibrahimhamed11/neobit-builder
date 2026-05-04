# 🏗️ neobit-builder Project Structure

## Complete Directory Layout

```
neobit-builder/                    ← Standalone Framework Package
│
├── 📄 README.md                   ← Complete documentation & quick start
├── 📄 DEVELOPMENT.md              ← Development guide & setup instructions
├── 📄 STRUCTURE.md                ← This file
├── 📦 package.json                ← Main npm package (includes CLI bin entry)
├── 🔧 tsconfig.json               ← TypeScript configuration
├── 🎨 babel.config.js             ← Babel configuration
│
├── 📁 src/                        ← Library Source Code (324 KB)
│   ├── NeobitApp.tsx              ← 🚀 Main entry component
│   ├── index.ts                   ← 📤 Public API exports
│   │
│   ├── components/                ← 🧩 11 Reusable UI Components
│   │   ├── AppButton/             ├─ Styled button (filled/outline/ghost)
│   │   ├── AppInput/              ├─ Text input with icons & validation
│   │   ├── AppCard/               ├─ Card container
│   │   ├── AppHeader/             ├─ Screen header
│   │   ├── AppAvatar/             ├─ User avatar with fallback
│   │   ├── AppBadge/              ├─ Badge/count indicator
│   │   ├── AppDivider/            ├─ Divider with label
│   │   ├── AppListItem/           ├─ List item with icon & chevron
│   │   ├── AppSnackbar/           ├─ Toast notification
│   │   ├── EmptyState/            ├─ Empty state placeholder
│   │   ├── ScreenWrapper/         └─ Safe area + scroll view wrapper
│   │
│   ├── screens/                   ← 🎬 Pre-Built Screens
│   │   ├── Login/                 ├─ Login screen
│   │   ├── Signup/                ├─ Signup screen
│   │   ├── ForgotPassword/        ├─ Password recovery
│   │   ├── VerifyEmail/           ├─ Email verification
│   │   ├── ResetOTP/              ├─ OTP input
│   │   ├── NewPassword/           ├─ Set new password
│   │   ├── Home/                  ├─ Home/dashboard
│   │   ├── Profile/               ├─ User profile
│   │   ├── Settings/              ├─ App settings
│   │   └── EditProfile/           └─ Edit profile info
│   │
│   ├── navigation/                ← 🧭 Navigation Setup
│   │   ├── RootNavigator.tsx      ├─ Boot sequence & gate logic
│   │   ├── AuthStack.tsx          ├─ Auth screen stack
│   │   ├── AppStack.tsx           ├─ App screen stack
│   │   └── MainTabs.tsx           └─ Bottom tab navigation
│   │
│   ├── theme/                     ← 🎨 Design System
│   │   ├── colors.ts              ├─ buildColors() function
│   │   ├── light.ts               ├─ Light theme tokens
│   │   ├── dark.ts                ├─ Dark theme tokens
│   │   ├── fonts.ts               ├─ Typography styles
│   │   ├── spacing.ts             ├─ Spacing & sizes
│   │   └── index.ts               └─ getAppTheme() export
│   │
│   ├── hooks/                     ← 🪝 Custom Hooks
│   │   └── useAppTheme.ts         └─ useAppTheme()
│   │
│   ├── store/                     ← 💾 State Management (Zustand)
│   │   ├── _config.ts             ├─ Module-level config
│   │   ├── authStore.ts           ├─ Auth state & actions
│   │   └── themeStore.ts          └─ Theme state & persistence
│   │
│   ├── api/                       ← 🔗 HTTP & API
│   │   ├── client.ts              ├─ Axios instance with interceptors
│   │   ├── config.ts              ├─ API config & base URL
│   │   ├── endpoints.ts           ├─ API endpoint definitions
│   │   └── services/
│   │       ├── authApi.ts         ├─ Auth HTTP methods
│   │       └── fcmApi.ts          └─ Firebase Cloud Messaging
│   │
│   ├── services/                  ← 🔐 Business Logic
│   │   ├── authService.ts         ├─ Firebase Auth + Social Login
│   │   └── remoteConfigService.ts └─ Firebase Remote Config
│   │
│   ├── config/                    ← ⚙️ Configuration System
│   │   ├── NeobitConfig.ts        ├─ Config types & defaults
│   │   └── ConfigContext.tsx      └─ React context & provider
│   │
│   ├── i18n/                      ← 🌍 Internationalization
│   │   ├── en.json                ├─ English translations
│   │   ├── ar.json                ├─ Arabic translations
│   │   └── index.ts               └─ i18next initialization
│   │
│   ├── types/                     ← 📘 TypeScript Types
│   │   └── index.ts               └─ User, ApiResponse, NavigationTypes
│   │
│   ├── utils/                     ← 🛠️ Utilities
│   │   ├── constants.ts           ├─ Storage keys, defaults
│   │   └── sessionEvents.ts       └─ Session event emitter
│   │
│   └── data/                      ← 📊 Mock Data
│       └── sampleData.ts          └─ Sample app data
│
├── 📁 example/                    ← Example React Native App (1.8 GB)
│   ├── app.js                     ← App component using <NeobitApp />
│   ├── index.js                   ← React Native entry point
│   ├── metro.config.js            ← Metro bundler config (points to ../src)
│   ├── app.json                   ← React Native app config
│   ├── package.json               ← Example app dependencies
│   ├── babel.config.js
│   ├── 📱 android/                ← Android native project
│   │   ├── app/
│   │   ├── build.gradle
│   │   └── ...
│   ├── 📱 ios/                    ← iOS native project
│   │   ├── Pods/
│   │   ├── Podfile
│   │   ├── ExampleApp.xcodeproj/
│   │   └── ...
│   └── node_modules/              ← Example app dependencies
│
├── 📁 cli/                        ← CLI Commands
│   └── index.js                   ← pop-builder command handler
│       ├── start                  ├─ Start example app
│       ├── start:ios              ├─ Start on iOS
│       ├── start:android          ├─ Start on Android
│       ├── build                  ├─ Build library
│       ├── typecheck              ├─ Type checking
│       ├── clean                  ├─ Clean artifacts
│       └── help                   └─ Show help
│
├── 📁 lib/                        ← Build Output (Generated)
│   ├── commonjs/                  ├─ CommonJS bundle
│   ├── module/                    ├─ ES modules
│   └── typescript/                └─ Type definitions
│
├── 📁 node_modules/               ← Dependencies (293 MB)
│
└── 📁 .vscode/                    ← VS Code settings
```

---

## 🎯 What Each Part Does

### `/src/` - The Library
- **Complete React Native framework in one package**
- Pre-built screens, components, navigation, theming
- All exported as public API via `src/index.ts`
- Fully typed with TypeScript
- Ready to npm install in any React Native app

### `/example/` - The Demo App
- **Working React Native app demonstrating all features**
- Uses `<NeobitApp />` from `src/`
- Has Android and iOS native projects
- Metro bundler resolves `neobit-builder` to parent `src/`
- Can run on simulator or real device

### `/cli/` - Command Line Interface
- **User-friendly commands for development**
- `pop-builder start` - Run example app
- `pop-builder build` - Build library
- `pop-builder typecheck` - Type check
- Colorful output, help text, error handling

### Root Config Files
- **`package.json`** - npm package with bin entry for CLI
- **`tsconfig.json`** - TypeScript compilation
- **`babel.config.js`** - Babel transpilation
- **`README.md`** - Complete documentation
- **`DEVELOPMENT.md`** - Developer guide

---

## 📦 How It Works

### For Users (npm install)

```bash
npm install neobit-builder
```

```tsx
import { NeobitApp } from 'neobit-builder';

export default function App() {
  return <NeobitApp config={{...}} />;
}
```

### For Developers (Local)

```bash
# Clone / cd to neobit-builder root

# Start example app with hot reload
pop-builder start

# Or manually
npm run example:start

# Edit src/ files → instant reload in example app!
```

---

## 🔄 File Count Summary

```
src/               324 KB    ~50 TypeScript files
example/          1.8 GB     Full RN app + android/ + ios/
cli/                4 KB     CLI entry point
lib/              412 KB     Generated build output
node_modules/     293 MB     Dependencies
```

---

## 🚀 Quick Commands

```bash
# Development
pop-builder start           # Run example app
pop-builder start:ios       # iOS only
pop-builder start:android   # Android only

# Building
pop-builder build          # Build library
pop-builder typecheck      # Type check

# Maintenance
pop-builder clean          # Remove artifacts
pop-builder help           # Show help

# npm equivalents
npm run example:start
npm run example:ios
npm run example:android
npm run build
npm run typecheck
npm run clean
```

---

## 💡 Key Design Principles

1. **Standalone** - Works completely independently
2. **Self-contained** - Library + example + CLI all in one
3. **Development-friendly** - Hot reload, clear structure
4. **Production-ready** - Buildable, publishable to npm
5. **Well-documented** - README, DEVELOPMENT guide, examples
6. **Extensible** - Override screens, customize theme, add features

---

## 📄 Files to Read

1. **`README.md`** - User-facing docs & quick start
2. **`DEVELOPMENT.md`** - Developer setup & workflow
3. **`src/index.ts`** - Public API
4. **`src/NeobitApp.tsx`** - Main component
5. **`src/config/NeobitConfig.ts`** - Configuration options
6. **`cli/index.js`** - CLI implementation
