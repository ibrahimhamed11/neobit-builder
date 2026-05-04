# Neobit v2.5.0 - Live Example App

This example app demonstrates all features of Neobit in a single interactive screen.

## Features Demonstrated

✓ **Complete Auth Flow** - Login, Signup, Forgot Password, Verify Email, OTP, New Password
✓ **Auto-fill Demo Buttons** - Click to instantly fill forms with test data
✓ **Live Navigation** - Jump between all 7 screens instantly
✓ **Theme Switching** - Toggle dark/light mode in real-time
✓ **All Fixes Applied**:
  - Gesture Handler Kotlin patch
  - Firebase error handling (graceful)
  - Custom session events (no Node.js)
  - react-native-screens 4.11.0 (no codegen issues)

## Quick Start

### Copy to your React Native project:

```bash
# Copy app.tsx to your project root
cp example/app.tsx your-project/app.tsx
```

### Or use as reference:

Read through the app.tsx to see:
- How to structure auth screens
- How to implement auto-fill demo features
- How to handle navigation flows
- How to use Material Design components
- How to test all features at runtime

## Testing Flows

### 1. Login Flow
- Click **Login** screen
- Click **"Auto-fill Demo"** button
- See test data: demo@example.com / Demo123!@#
- Click **"Sign In → Home"** to complete flow

### 2. Signup Flow
- Click **Sign Up** screen
- Click **"Auto-fill Demo"** button
- Click **"Create Account → Verify Email"**
- Complete email verification

### 3. Password Reset Flow
- Click **Forgot Password** screen
- Click **"Auto-fill Email"** button
- Click **"Send Link → Check OTP"**
- Complete OTP and new password setup

### 4. Theme Switching
- Click sun/moon icon in header
- Watch all colors update in real-time

## Console Logs

Open your console to see:
- Navigation logs: "📍 Navigated to: Screen Name"
- Firebase error handling (graceful, non-blocking)
- Theme mode changes

## What to Verify

- [ ] All 7 screens load without errors
- [ ] Auto-fill buttons work instantly
- [ ] Navigation between screens is smooth
- [ ] Theme toggle works instantly
- [ ] No Firebase crashes (handled gracefully)
- [ ] Form validation works
- [ ] All buttons are clickable

## Next Steps

When satisfied with testing:

1. Delete app.tsx from project root
2. Create your actual app with: `npx create-neobit-app YourApp`
3. Use the auto-fill patterns in this example for your own screens

---

**Ready to publish? Make sure all tests pass, then provide OTP code to publish v2.5.0 to npm.**
