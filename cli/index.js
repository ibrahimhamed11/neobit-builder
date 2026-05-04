#!/usr/bin/env node
'use strict';

const readline = require('readline');
const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

// ── Tiny colour helpers (no deps) ──────────────────────────────────────────────
const c = {
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

const PACKAGE_ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR  = path.join(PACKAGE_ROOT, 'template');
const SRC_DIR       = path.join(PACKAGE_ROOT, 'src');

// ── CLI prompt helpers ─────────────────────────────────────────────────────────
function ask(rl, question, defaultVal = '') {
  return new Promise((resolve) => {
    const hint = defaultVal ? c.dim(` (${defaultVal})`) : '';
    rl.question(`  ${question}${hint}: `, (ans) => {
      resolve(ans.trim() || defaultVal);
    });
  });
}

function askYN(rl, question, def = true) {
  return new Promise((resolve) => {
    const hint = c.dim(def ? ' [Y/n]' : ' [y/N]');
    rl.question(`  ${question}${hint}: `, (ans) => {
      const a = ans.trim().toLowerCase();
      resolve(a ? (a === 'y' || a === 'yes') : def);
    });
  });
}

// ── File utilities ─────────────────────────────────────────────────────────────
function copyDir(src, dest, exclude = new Set()) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d, new Set());
    else fs.copyFileSync(s, d);
  }
}

const TEXT_EXTS = new Set(['.ts','.tsx','.js','.jsx','.json','.md','.txt','.xml','.gradle','.plist','.yaml','.yml','.env']);

function replaceInDir(dir, tokens) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { replaceInDir(full, tokens); continue; }
    if (!TEXT_EXTS.has(path.extname(entry.name))) continue;
    let src = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [k, v] of Object.entries(tokens)) {
      if (src.includes(k)) { src = src.split(k).join(v); changed = true; }
    }
    if (changed) fs.writeFileSync(full, src);
  }
}

// ── Entry point ────────────────────────────────────────────────────────────────
async function main() {
  const logo = [
    '  ███╗   ██╗███████╗ ██████╗ ██████╗ ██╗████████╗',
    '  ████╗  ██║██╔════╝██╔═══██╗██╔══██╗██║╚══██╔══╝',
    '  ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║   ',
    '  ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║   ',
    '  ██║ ╚████║███████╗╚██████╔╝██████╔╝██║   ██║   ',
    '  ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝   ╚═╝  ',
  ].join('\n');
  console.log('\n' + c.bold(c.cyan(logo)));
  console.log(c.dim('\n  create-neobit-app — Scaffold a production-ready React Native app in seconds.\n'));
  console.log(c.dim('  Developer : ') + c.bold('Ibrahim Hamed'));
  console.log(c.dim('  Contact   : ') + c.bold('ibrahim.hamed112@hotmail.com') + '\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    // ── 1. Collect answers ─────────────────────────────────────────────────────
    let projectName = process.argv[2] && !process.argv[2].startsWith('-') ? process.argv[2] : '';
    if (!projectName) projectName = await ask(rl, '📱 Project name (no spaces)', 'MyApp');

    const displayName   = await ask(rl, '✏️  Display name (shown on device)', projectName);
    const bundleId      = await ask(rl, '📦 Bundle ID', `com.company.${projectName.toLowerCase()}`);
    const apiUrl        = await ask(rl, '🌐 Production API URL', 'https://api.myapp.com/api');
    const localIp       = await ask(rl, '💻 Your local IP (for device dev)', '192.168.1.100');
    const primaryColor  = await ask(rl, '🎨 Primary brand color (hex)', '#0F766E');

    console.log('\n  ' + c.bold('Project mode:'));
    console.log(c.dim('  Clone   → all source files copied into your project (fully customizable)'));
    console.log(c.dim('  Library → thin App.tsx that imports everything from create-neobit-app'));
    const cloneMode = await askYN(rl, '📋 Clone all source files?', true);

    console.log('\n  ' + c.bold('Features:'));
    const googleSignIn = await askYN(rl, '🔍 Google Sign-In?', true);
    const appleSignIn  = await askYN(rl, '🍎 Apple Sign-In?',  true);
    const guestMode    = await askYN(rl, '👤 Guest mode?',     true);

    console.log('\n  ' + c.bold('Firebase:'));
    const fbAnalytics     = await askYN(rl, '📊 Analytics?',        true);
    const fbCrashlytics   = await askYN(rl, '💥 Crashlytics?',      true);
    const fbFCM           = await askYN(rl, '🔔 Push notifications (FCM)?', true);
    const fbRemoteConfig  = await askYN(rl, '⚙️  Remote Config?',     true);

    rl.close();

    const destDir = path.resolve(process.cwd(), projectName);

    // ── Guard: destination must not exist ─────────────────────────────────────
    if (fs.existsSync(destDir)) {
      console.error(c.red(`\n  ✗ Folder "${projectName}" already exists.\n`));
      process.exit(1);
    }

    console.log('\n' + c.green('  ✓') + c.bold(` Creating ${projectName}…\n`));

    // ── 2. react-native init ───────────────────────────────────────────────────
    console.log(c.cyan('  [1/5]') + ' Initializing React Native project…');
    try {
      // Use pipe to suppress RN's ASCII logo — we show NeoBit branding instead
      const initOutput = execSync(
        `npx @react-native-community/cli@latest init ${projectName} --package-name ${bundleId} --skip-install`,
        { encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'] },
      );
      // Show only the useful lines (skip the logo block)
      const usefulLines = (initOutput || '').split('\n').filter(line =>
        line.includes('✔') || line.includes('Run instructions') ||
        line.includes('cd ') || line.includes('npx react-native')
      );
      if (usefulLines.length) console.log(c.dim(usefulLines.slice(0, 4).join('\n')));
    } catch (e) {
      console.error(c.red('\n  ✗ react-native init failed. Needs Node 18+ and internet.\n'));
      process.exit(1);
    }

    // ── 3. Copy source files ─────────────────────────────────────────────────
    console.log(c.cyan('  [2/5]') + ' Scaffolding source files…');

    const destSrc = path.join(destDir, 'src');
    const tmplSrc = path.join(TEMPLATE_DIR, 'src');

    if (cloneMode) {
      // ── CLONE MODE: copy entire src/ library into the project ─────────────
      // Developer owns every screen, component, store, theme file
      const excludeFromSrc = new Set(['NeobitApp.tsx', 'index.ts', 'config', 'data']);
      if (fs.existsSync(SRC_DIR)) {
        copyDir(SRC_DIR, destSrc, excludeFromSrc);
      }
      // Overlay template/src/ on top (standalone App.tsx, authStore entry, etc.)
      if (fs.existsSync(tmplSrc)) {
        // In clone mode, skip the framework App.tsx — use the standalone one
        const cloneSrcOverride = path.join(TEMPLATE_DIR, 'src-clone');
        if (fs.existsSync(cloneSrcOverride)) {
          copyDir(cloneSrcOverride, destSrc);
        }
      }
    } else {
      // ── FRAMEWORK MODE: thin App.tsx imports from create-neobit-app ────────
      // One config object drives auth, nav, theme, i18n — update via npm
      if (fs.existsSync(tmplSrc)) {
        copyDir(tmplSrc, destSrc);
      }
    }

    // ── 4. Copy root template files ───────────────────────────────────────────
    console.log(c.cyan('  [3/5]') + ' Copying project config files…');

    const rootFiles = ['index.js', 'react-native.config.js', 'SETUP.md', '.gitignore'];
    for (const f of rootFiles) {
      const s = path.join(TEMPLATE_DIR, f);
      if (fs.existsSync(s)) fs.copyFileSync(s, path.join(destDir, f));
    }


    // ── 4b. Inject native AppRestart module (Android + iOS) ─────────────────
    console.log(c.cyan('  [3/5]') + ' Injecting native restart module…');

    // Android: copy AppRestartModule.kt + AppRestartPackage.kt and patch MainApplication.kt
    const androidPkgPath    = bundleId.replace(/\./g, '/');
    const androidDestDir    = path.join(destDir, 'android/app/src/main/java', androidPkgPath);
    const androidTmplDir    = path.join(TEMPLATE_DIR, 'android/app/src/main/java/com/APP_PACKAGE_NAME');

    if (fs.existsSync(androidTmplDir) && fs.existsSync(androidDestDir)) {
      for (const file of ['AppRestartModule.kt', 'AppRestartPackage.kt']) {
        let src = fs.readFileSync(path.join(androidTmplDir, file), 'utf8');
        // Replace {{PACKAGE_NAME}} with the actual package name (dots replaced by underscores for safety)
        src = src.replace(/{{PACKAGE_NAME}}/g, bundleId);
        fs.writeFileSync(path.join(androidDestDir, file), src);
      }

      // Patch MainApplication.kt to register AppRestartPackage
      const mainAppPath = path.join(androidDestDir, 'MainApplication.kt');
      if (fs.existsSync(mainAppPath)) {
        let mainApp = fs.readFileSync(mainAppPath, 'utf8');
        if (!mainApp.includes('AppRestartPackage')) {
          mainApp = mainApp.replace(
            /PackageList\(this\)\.packages\.apply\s*\{[^}]*\}/,
            'PackageList(this).packages.apply {\n              add(AppRestartPackage())\n            }',
          );
          fs.writeFileSync(mainAppPath, mainApp);
        }
      }
    }

    // iOS: copy AppRestartModule.m into the Xcode project folder
    const iosModuleSrc = path.join(TEMPLATE_DIR, 'ios/AppRestartModule.m');
    if (fs.existsSync(iosModuleSrc)) {
      const iosProjectDir = path.join(destDir, 'ios', projectName);
      if (fs.existsSync(iosProjectDir)) {
        fs.copyFileSync(iosModuleSrc, path.join(iosProjectDir, 'AppRestartModule.m'));
      }
    }

    // ── 5. Merge package.json ─────────────────────────────────────────────────
    const templatePkgPath = path.join(TEMPLATE_DIR, '_package.json');
    if (fs.existsSync(templatePkgPath)) {
      const tmplPkg = JSON.parse(fs.readFileSync(templatePkgPath, 'utf8'));
      const existingPkgPath = path.join(destDir, 'package.json');
      const existing = JSON.parse(fs.readFileSync(existingPkgPath, 'utf8'));

      // Remove Firebase packages that weren't selected
      const deps = { ...existing.dependencies, ...tmplPkg.dependencies };
      if (cloneMode) delete deps['create-neobit-app']; // clone = no library dep needed
      if (!googleSignIn)  delete deps['@react-native-google-signin/google-signin'];
      if (!appleSignIn)   delete deps['@invertase/react-native-apple-authentication'];
      if (!fbFCM)         { delete deps['@react-native-firebase/messaging']; delete deps['@notifee/react-native']; }
      if (!fbAnalytics)   delete deps['@react-native-firebase/analytics'];
      if (!fbCrashlytics) delete deps['@react-native-firebase/crashlytics'];
      if (!fbRemoteConfig) delete deps['@react-native-firebase/remote-config'];

      const merged = {
        ...existing,
        name:    projectName.toLowerCase(),
        version: '0.0.1',
        scripts: { ...existing.scripts, ...tmplPkg.scripts },
        dependencies:    deps,
        devDependencies: { ...existing.devDependencies, ...tmplPkg.devDependencies },
      };
      fs.writeFileSync(existingPkgPath, JSON.stringify(merged, null, 2));
    }

    // Update app.json
    fs.writeFileSync(
      path.join(destDir, 'app.json'),
      JSON.stringify({ name: projectName, displayName }, null, 2),
    );

    // ── 6. Replace all tokens ─────────────────────────────────────────────────
    console.log(c.cyan('  [4/5]') + ' Applying your configuration…');

    replaceInDir(destDir, {
      '{{APP_NAME}}':      projectName,
      '{{DISPLAY_NAME}}':  displayName,
      '{{BUNDLE_ID}}':     bundleId,
      '{{API_BASE_URL}}':  apiUrl,
      '{{LOCAL_IP}}':      localIp,
      '{{PRIMARY_COLOR}}': primaryColor,
      '{{GOOGLE_SIGN_IN}}': String(googleSignIn),
      '{{APPLE_SIGN_IN}}':  String(appleSignIn),
      '{{FCM}}':            String(fbFCM),
      '{{REMOTE_CONFIG}}':  String(fbRemoteConfig),
    });

    // ── 7. npm install ─────────────────────────────────────────────────────────
    console.log(c.cyan('  [5/5]') + ' Installing dependencies (may take a few minutes)…');
    try {
      execSync('npm install --legacy-peer-deps', { cwd: destDir, stdio: 'inherit' });
    } catch {
      console.warn(c.yellow('\n  ⚠ npm install had warnings — run it manually inside the folder.\n'));
    }

    // ── Done ──────────────────────────────────────────────────────────────────
    console.log('\n' + c.green(c.bold('  ✅  Done! Your project is ready.\n')));
    console.log(c.bold('  Next steps:'));
    console.log(`    ${c.cyan(`cd ${projectName}`)}`);
    console.log(`    ${c.cyan('npm run ios:pods')}  ${c.dim('← iOS only')}`);
    console.log(`    ${c.cyan('npm start')}  ${c.dim('then')}  ${c.cyan('npm run android')}  ${c.dim('or')}  ${c.cyan('npm run ios')}`);
    console.log(`\n  📖  Open ${c.bold('SETUP.md')} for Firebase setup, backend API contract, and customization.\n`);

  } catch (err) {
    rl.close();
    console.error(c.red(`\n  ✗ Error: ${err.message}\n`));
    process.exit(1);
  }
}

main();
