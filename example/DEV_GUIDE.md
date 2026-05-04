# Development Guide - Neobit Example App

## Quick Start for Android Development

### First Time Setup

```bash
# Navigate to example app directory
cd packages/create-neobit-app/example

# Install dependencies
npm install

# Clean build (if needed)
npm run clean
```

### Running on Android Emulator

#### Option 1: One Command (Recommended)
```bash
npm run android:dev
```
This starts the Metro bundler and runs the app on Android in one command.

#### Option 2: Two Separate Terminals
**Terminal 1 - Start Metro Bundler:**
```bash
npm run start:reset
```

**Terminal 2 - Run on Android:**
```bash
npm run android
```

## Hot Reload & Live Changes

The example app is configured to **watch parent package files** for changes. This means:

✅ **Edit package files** → Changes appear on emulator automatically  
✅ **Edit example/app.tsx** → Changes appear instantly  
✅ **Edit package source** → No rebuild needed, just reload  

### Reloading the App

**Automatic:** Most changes reload automatically when Metro detects file changes.

**Manual reload (if needed):**
- Android Emulator: Press **R** twice (reload app)
- Or shake device emulator: **Ctrl+M** (Android) and tap "Reload"

## Troubleshooting

### App Won't Start
```bash
npm run android:clean
npm run start:reset
npm run android
```

### Metro Shows "Cannot find module"
```bash
npm run clean
npm install
npm run start:reset
```

### Changes Not Appearing
1. Clear watchman cache: `watchman watch-del-all`
2. Clear Metro cache: `npm run start:reset`
3. Reload app: Press **R** twice in Metro bundler

### Port Already in Use
```bash
# Kill process on port 8081
lsof -i :8081 | grep -v PID | awk '{print $2}' | xargs kill -9

# Or use a different port
react-native start --port 8888
```

## Development Workflow

1. **Make changes** to package files (template, src, etc.)
2. **Save files** - Metro watches for changes
3. **App reloads** automatically (or press R twice)
4. **Test on emulator** - See changes instantly

## Testing All Features

Use the example app to verify:
- ✓ Authentication flows (Login, Signup, Password Reset)
- ✓ Navigation between screens
- ✓ Theme switching (dark/light mode)
- ✓ Form validation
- ✓ Auto-fill demo buttons
- ✓ No Firebase errors in console

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run android:dev` | Build and run on Android (recommended) |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm start` | Start Metro bundler |
| `npm run start:reset` | Start Metro with cache cleared |
| `npm run start:verbose` | Start Metro with detailed logs |
| `npm run clean` | Full clean and reinstall |
| `npm run android:clean` | Clean Android build artifacts |

## Pro Tips

💡 **Keep Metro Running:** Don't close the Metro bundler window - just reload with R  
💡 **Two Monitors:** Use one monitor for code, one for emulator  
💡 **Check Logs:** Run Metro with `npm run start:verbose` to see file changes being detected  
💡 **Test Automation:** Create test data with the Auto-fill buttons in the example app  

## Next Steps

After testing with the example app:
1. Make desired changes to the package
2. Test thoroughly in the example app
3. Update version in package.json
4. Publish to npm: `npm run publish:npm`
