#!/usr/bin/env node

/**
 * Automated publish script
 * - Bumps version (patch by default, or specify: major/minor/patch)
 * - Rebuilds the library
 * - Publishes to npm with public access
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const versionType = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error(`❌ Invalid version type: ${versionType}`);
  console.error('Usage: npm run publish -- [major|minor|patch]');
  process.exit(1);
}

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('\n🚀 Publishing workflow\n');

// 1. Bump version
console.log(`📦 Bumping version (${versionType})...`);
try {
  execSync(`npm version ${versionType}`, { stdio: 'inherit' });
  console.log('✓ Version bumped\n');
} catch (err) {
  console.error('❌ Failed to bump version');
  process.exit(1);
}

// 2. Build library
console.log('🔨 Building library...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ Library built\n');
} catch (err) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 3. Publish to npm
console.log('📤 Publishing to npm...');
let publishSuccess = true;
try {
  execSync('npm publish --access public', { stdio: 'inherit' });
  console.log('✓ Published to npm\n');
} catch (err) {
  console.error('⚠ npm publish failed:', err.message);
  console.error('\nTroubleshooting npm publish errors:');
  console.error('  - Check npm token is valid: npm whoami');
  console.error('  - Verify .npmrc has correct auth token');
  console.error('  - Check package permissions: npm owner ls create-neobit-app');
  publishSuccess = false;
}

// 4. Push to git
console.log('📍 Pushing to git...');
try {
  const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const newVersion = updatedPackageJson.version;

  execSync('git add .', { stdio: 'inherit' });
  // Only commit if there are changes
  try {
    execSync('git commit -m "chore: bump to ' + newVersion + '"', { stdio: 'pipe' });
  } catch (e) {
    // git commit fails if nothing changed, that's ok
  }

  // Create tag if it doesn't exist
  try {
    execSync(`git tag v${newVersion}`, { stdio: 'pipe' });
  } catch (e) {
    // tag might already exist
  }

  execSync('git push origin main --tags', { stdio: 'inherit' });
  console.log('✓ Pushed to git\n');
} catch (err) {
  console.error('⚠ Git push failed:', err.message);
  console.error('   Version was bumped locally, but not pushed to remote');
}

if (publishSuccess) {
  console.log('✅ Publish workflow completed successfully!\n');
} else {
  console.error('\n⚠ Publish workflow completed with npm publish errors.');
  console.error('   Version bump and git push completed, but npm publish failed.');
  console.error('   Try again with: npm publish --access public\n');
}
