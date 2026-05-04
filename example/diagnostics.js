/**
 * Diagnostic script to trace TurboModule registration issues
 */

console.log('[DIAGNOSTICS] App startup');

// Log turboModuleProxy availability
const turboProxy = global.__turboModuleProxy;
console.log('[DIAGNOSTICS] __turboModuleProxy exists:', turboProxy !== undefined);
console.log('[DIAGNOSTICS] __turboModuleProxy type:', typeof turboProxy);

// Test if we can call turboModuleProxy
if (turboProxy) {
  console.log('[DIAGNOSTICS] Testing TurboModule lookups...');

  const testModules = [
    'DeviceInfo',
    'RCTDeviceInfo',
    'NativeDeviceInfo',
    'Dimensions',
    'PixelRatio',
    'UIManager',
  ];

  testModules.forEach(name => {
    try {
      const module = turboProxy(name);
      console.log(`[DIAGNOSTICS] Module "${name}": ${module ? 'FOUND' : 'NOT FOUND'}`);
    } catch (e) {
      console.log(`[DIAGNOSTICS] Module "${name}": ERROR - ${e.message}`);
    }
  });
}

// Log NativeModules availability (legacy bridge)
const NativeModules = require('react-native').NativeModules;
console.log('[DIAGNOSTICS] NativeModules keys:', Object.keys(NativeModules).slice(0, 10).join(', '));
console.log('[DIAGNOSTICS] NativeModules has DeviceInfo:', !!NativeModules.DeviceInfo);
console.log('[DIAGNOSTICS] NativeModules has RNDeviceInfo:', !!NativeModules.RNDeviceInfo);

// Log bridgeless mode indicators
console.log('[DIAGNOSTICS] RN$Bridgeless:', global.RN$Bridgeless);
console.log('[DIAGNOSTICS] RN$TurboInterop:', global.RN$TurboInterop);
console.log('[DIAGNOSTICS] __DEV__:', __DEV__);

// Log React Native version (if available)
try {
  const RNVersion = require('react-native/package.json').version;
  console.log('[DIAGNOSTICS] React Native version:', RNVersion);
} catch (e) {
  console.log('[DIAGNOSTICS] Could not determine RN version');
}

console.log('[DIAGNOSTICS] Setup complete');
