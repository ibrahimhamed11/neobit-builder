# Firebase Remote Config — Maintenance, Force Update & Dynamic Features

Complete guide to using Firebase Remote Config for real-time app control without app releases.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Features](#features)
   - [Maintenance Mode](#maintenance-mode)
   - [Force Update](#force-update)
   - [Custom Parameters](#custom-parameters)
4. [Firebase Console Setup](#firebase-console-setup)
5. [How It Works](#how-it-works)
6. [Examples](#examples)

---

## Overview

Firebase Remote Config allows you to change app behavior **without releasing a new version**:

- ✅ **Maintenance Mode** — Block all users with a custom message (EN/AR)
- ✅ **Force Update** — Require users to update if they're below minimum version
- ✅ **Dynamic Parameters** — Change URLs, feature flags, text, etc.
- ✅ **Language-Aware** — Arabic and English versions of every message
- ✅ **Instant Activation** — Changes can take effect immediately (dev) or within 1 hour (production)

---

## Setup

### Step 1: Firebase Project

In Firebase Console:
1. Go to **Build** → **Remote Config**
2. Click **Create Configuration**

### Step 2: Import Default Parameters

In your generated app or template, find `firebase/remote-config.json`:

```bash
# View the template
cat firebase/remote-config.json
```

**In Firebase Console:**
1. Click **⋮** (three dots) → **Import parameters**
2. Upload `firebase/remote-config.json`
3. Click **Publish**

### Step 3: Enable in App Config

In `src/App.tsx`:

```tsx
export default NeobitBuilder.create()
  .withConfig({
    // ... other config
    features: {
      remoteConfig: true,  // ← Enable this
      googleSignIn: false,
      appleSignIn: false,
      pushNotifications: false,
    },
  })
  .launch();
```

✅ Done! Remote Config is now active.

---

## Features

### 🔧 Maintenance Mode

**Use Case:** Server upgrades, database migrations, emergency maintenance

#### Enable Maintenance

1. Firebase Console → **Remote Config**
2. Find `maintenance_mode` parameter
3. Set value to **`true`**
4. Click **Publish**

Users see this screen:
```
⚙️  Under Maintenance

We're performing scheduled maintenance.
We'll be back shortly!

[Retry] button refreshes every 5 seconds
```

#### Customize Message (English)

1. Find `maintenance_title_en` → Edit → Set your title
2. Find `maintenance_message_en` → Edit → Set your message
3. **Publish**

#### Customize Message (Arabic)

1. Find `maintenance_title_ar` → Edit → Set your title
2. Find `maintenance_message_ar` → Edit → Set your message
3. **Publish**

#### Disable Maintenance

1. Set `maintenance_mode` to **`false`**
2. **Publish**

Users can now access the app again!

**Time to effect:** Instant (dev) → 1 hour (production)

---

### 🚀 Force Update

**Use Case:** Critical bugs, security patches, required features

#### Enable Force Update

1. Firebase Console → **Remote Config**
2. Find `force_update` → Set to **`true`**
3. Find `minimum_version` → Set to version users must have (e.g., `"2.5.0"`)
4. Find `store_url_android` → Paste Play Store link
5. Find `store_url_ios` → Paste App Store link
6. **Publish**

Users with version < `minimum_version` see:

```
🆕 Update Required

New version available!
[Current: 2.3.0]  [Required: 2.5.0]

[Update Now] button → Opens App Store/Play Store
```

Users **cannot dismiss** this screen until they update.

#### Example Versions

```
Current App Version: 2.3.0
Minimum Version Set: 2.5.0
Action: Show force update screen

Current App Version: 2.5.0
Minimum Version Set: 2.5.0
Action: Allow access (versions match)

Current App Version: 2.6.0
Minimum Version Set: 2.5.0
Action: Allow access (user has newer version)
```

#### Get Store URLs

**Android (Play Store):**
1. Open your app on Play Store
2. Copy the URL: `https://play.google.com/store/apps/details?id=com.example.app`

**iOS (App Store):**
1. Open your app on App Store
2. Copy the link: `https://apps.apple.com/app/id1234567890`

#### Disable Force Update

1. Set `force_update` to **`false`**
2. **Publish**

---

### 🎯 Custom Parameters

Create your own parameters for dynamic features:

#### Example 1: Feature Flag

**Parameter:** `new_payment_feature`
**Value:** `"true"` or `"false"`

**In your code:**

```tsx
import remoteConfig from '@react-native-firebase/remote-config';

const isNewPaymentEnabled = remoteConfig()
  .getValue('new_payment_feature')
  .asString() === 'true';

if (isNewPaymentEnabled) {
  // Show new payment UI
} else {
  // Show old payment UI
}
```

#### Example 2: Dynamic URL

**Parameter:** `api_base_url`
**Value:** `"https://api.prod.com"` or `"https://api.staging.com"`

**In your code:**

```tsx
const apiUrl = remoteConfig()
  .getValue('api_base_url')
  .asString();
```

#### Example 3: A/B Testing

**Parameter:** `button_color`
**Value:** `"blue"` for 50% of users, `"red"` for 50% of users

**In your code:**

```tsx
const buttonColor = remoteConfig()
  .getValue('button_color')
  .asString();

return <Button color={buttonColor} />;
```

---

## Firebase Console Setup

### Step 1: Navigate to Remote Config

```
Firebase Console 
  → Select your project
  → Build (left sidebar)
  → Remote Config
```

### Step 2: Add/Edit Parameters

Click **Add parameter**:
- **Parameter key:** `my_parameter` (lowercase, underscores)
- **Default value:** `"default_value"`
- **Description:** What this controls

### Step 3: Publish Changes

Click **Publish** to activate changes.

⚠️ **Without publishing, changes don't take effect!**

### Step 4: Set Conditional Values (Optional)

Show different values to different users:

1. Click a parameter
2. Add condition:
   - **Language** → Show different text in EN/AR
   - **App version** → Different features for different app versions
   - **User percentage** → A/B testing (show to 50% of users)
   - **iOS/Android** → Platform-specific values

Example:
```
Parameter: promotion_text
Default: "Summer Sale 50% Off"
Condition (Arabic users): "خصم صيفي 50٪"
Condition (Android users): "Summer Sale 50% Off on Play Store"
```

---

## How It Works

### App Startup Flow

```
App Starts
  ↓
RootNavigator.hydrate()
  ↓
fetchRemoteConfig()
  ├─ Set defaults (fallback values)
  ├─ Fetch latest from Firebase
  └─ Activate config
  ↓
Check Maintenance Mode?
  ├─ YES → Show MaintenanceScreen (blocks app)
  └─ NO → Check Force Update?
    ├─ YES → Show ForceUpdateScreen (blocks app)
    └─ NO → Show app normally ✓
```

### Caching Strategy

- **Development:** Fetch every time (0ms cache) → instant updates
- **Production:** Cache 1 hour → reduces Firebase API calls

Override in `src/services/remoteConfigService.ts`:
```tsx
minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
```

### Offline Behavior

If Firebase is unreachable or offline:
1. Uses cached values from last fetch
2. Falls back to hardcoded defaults
3. App continues normally (never blocks)

---

## Examples

### Example 1: Emergency Maintenance

**Scenario:** Database migration on Saturday 2 AM

**Actions:**
1. Friday 11 PM → Set `maintenance_mode` = `"true"` in Remote Config
2. Publish
3. All users see maintenance screen instantly (or within 1 hour)
4. Users can retry, and maintenance will auto-clear once mode is disabled

**Deactivate:**
1. After migration → Set `maintenance_mode` = `"false"`
2. Publish
3. Users can now access app

---

### Example 2: Critical Security Patch

**Scenario:** Security vulnerability requires app update

**Actions:**
1. Deploy new version (2.6.0) to App Store/Play Store
2. Firebase Console → Set:
   - `force_update` = `"true"`
   - `minimum_version` = `"2.6.0"`
   - `store_url_ios` = [App Store link]
   - `store_url_android` = [Play Store link]
3. Publish
4. Users with 2.5.0 or older see force update screen
5. Users can only access app after updating to 2.6.0

---

### Example 3: Gradual Rollout with Feature Flag

**Scenario:** New payment feature, enable for 10% first to test

**Actions:**
1. Build app with feature flag check:
   ```tsx
   if (remoteConfig().getValue('new_payment').asString() === 'true') {
     // Show new payment
   }
   ```
2. Set `new_payment` = `"false"` by default
3. Add condition: `"true"` for 10% of users (A/B testing)
4. Monitor errors/feedback
5. If good → Increase to 50%, then 100%
6. If bad → Keep at 0% until fixed

**No app update needed!**

---

### Example 4: Language-Specific Messages

**Scenario:** Customize maintenance message per language

**Setup:**
```
maintenance_title_en: "Under Maintenance"
maintenance_message_en: "We'll be back soon!"

maintenance_title_ar: "تحت الصيانة"
maintenance_message_ar: "سنعود قريباً!"
```

**In Code:**
```tsx
const lang = i18n.language; // 'ar' or 'en'
const { title, message } = getMaintenanceContent(lang);
```

Messages update without rebuilding the app!

---

## Troubleshooting

### Changes Not Taking Effect

**Problem:** I published but users don't see changes

**Solutions:**
1. ✅ Did you click **Publish**? (Common mistake!)
2. ✅ Wait 1 hour in production (due to caching)
3. ✅ In dev: Enable `__DEV__` flag for instant refresh
4. ✅ Force app cold restart (not just background refresh)

### Maintenance Screen Won't Go Away

**Problem:** Users are stuck on maintenance screen

**Solution:**
1. Set `maintenance_mode` = `"false"`
2. Click **Publish**
3. Users will see normal app on next app restart

### Force Update Links Don't Work

**Problem:** Clicking "Update" doesn't open store

**Solution:**
1. Verify `store_url_ios` and `store_url_android` are valid URLs
2. Test URLs in a browser first
3. Make sure you published the changes
4. Check app is actually published on both stores

---

## Remote Config File Reference

### firebase/remote-config.json

```json
{
  "parameters": {
    "maintenance_mode": {
      "defaultValue": { "value": "false" },
      "description": "Show maintenance screen to all users"
    },
    "maintenance_title_en": {
      "defaultValue": { "value": "Under Maintenance" }
    },
    "maintenance_title_ar": {
      "defaultValue": { "value": "تحت الصيانة" }
    },
    "maintenance_message_en": {
      "defaultValue": { "value": "We're under maintenance. We'll be back shortly!" }
    },
    "maintenance_message_ar": {
      "defaultValue": { "value": "نحن تحت الصيانة. سنعود قريباً!" }
    },
    "force_update": {
      "defaultValue": { "value": "false" },
      "description": "Require users to update app"
    },
    "minimum_version": {
      "defaultValue": { "value": "1.0.0" },
      "description": "Minimum app version required (e.g., 2.5.0)"
    },
    "store_url_ios": {
      "defaultValue": { "value": "" },
      "description": "App Store URL for force update"
    },
    "store_url_android": {
      "defaultValue": { "value": "" },
      "description": "Play Store URL for force update"
    }
  }
}
```

---

## Key Takeaways

✅ **Maintenance Mode** — Block users with custom message, no app rebuild needed  
✅ **Force Update** — Require minimum version for security/features  
✅ **Dynamic Control** — Change app behavior without releases  
✅ **Language Support** — Full EN/AR multilingual support  
✅ **Offline Safe** — Falls back to defaults if Firebase unavailable  
✅ **Instant Activation** — Dev (instant), Production (1 hour max)

---

## Support

- **Firebase Docs:** https://firebase.google.com/docs/remote-config
- **Service Code:** `src/services/remoteConfigService.ts`
- **Screens:** `src/screens/Maintenance/`, `src/screens/ForceUpdate/`
