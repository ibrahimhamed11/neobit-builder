#!/usr/bin/env node

/**
 * Font Linking Script
 * Copies fonts from assets/fonts to native Android/iOS directories
 * This is needed because `react-native link` is deprecated in React Native 0.85+
 */

const fs = require('fs');
const path = require('path');

const FONTS_SOURCE = path.join(__dirname, '../assets/fonts');
const ANDROID_FONTS_DEST = path.join(__dirname, '../android/app/src/main/assets/fonts');
const IOS_FONTS_DEST = path.join(__dirname, '../ios/Fonts');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
}

function copyFonts(source, destination) {
  ensureDir(destination);

  if (!fs.existsSync(source)) {
    console.warn(`⚠ Source directory not found: ${source}`);
    return;
  }

  const fonts = fs.readdirSync(source).filter((f) => f.endsWith('.ttf'));

  fonts.forEach((font) => {
    const src = path.join(source, font);
    const dest = path.join(destination, font);

    try {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied: ${font}`);
    } catch (err) {
      console.error(`✗ Failed to copy ${font}:`, err.message);
    }
  });

  console.log(`\n✓ Fonts linked to ${destination}`);
}

console.log('\n📦 Linking React Native fonts...\n');

// Copy to Android
console.log('Android fonts:');
copyFonts(FONTS_SOURCE, ANDROID_FONTS_DEST);

// Copy to iOS
console.log('\niOS fonts:');
copyFonts(FONTS_SOURCE, IOS_FONTS_DEST);

console.log('\n✓ Font linking complete!\n');
