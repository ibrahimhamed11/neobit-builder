#!/usr/bin/env node

/**
 * Interactive publish script
 * - Shows current version
 * - Asks for npm token
 * - Asks for version bump type (major/minor/patch)
 * - Bumps version, builds, publishes, and pushes to git
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const npmrcPath = path.join(__dirname, '../.npmrc');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  console.log('\n🚀 Interactive Publishing Workflow\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Show current version
  console.log(`📦 Current Version: ${packageJson.version}\n`);

  // Ask for npm token
  console.log('🔐 NPM Authentication\n');
  const token = await question('Enter your npm token: ');

  if (!token) {
    console.error('\n❌ Token is required');
    rl.close();
    process.exit(1);
  }

  // Ask for version type
  console.log('\n📈 Version Type\n');
  console.log('Available options:');
  console.log('  1. patch (bug fixes) - 2.8.0 → 2.8.1');
  console.log('  2. minor (new features) - 2.8.0 → 2.9.0');
  console.log('  3. major (breaking changes) - 2.8.0 → 3.0.0\n');

  const versionInput = await question('Select version type [1-3] or enter custom version: ');

  let versionType;
  const versionMap = { '1': 'patch', '2': 'minor', '3': 'major' };

  if (versionMap[versionInput]) {
    versionType = versionMap[versionInput];
  } else if (['major', 'minor', 'patch'].includes(versionInput)) {
    versionType = versionInput;
  } else if (versionInput.match(/^\d+\.\d+\.\d+$/)) {
    versionType = versionInput; // Custom version
  } else {
    console.error('\n❌ Invalid version type');
    rl.close();
    process.exit(1);
  }

  rl.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Save token to .npmrc
  console.log('💾 Saving npm token...');
  try {
    const npmrcContent = `//registry.npmjs.org/:_authToken=${token}\n`;
    fs.writeFileSync(npmrcPath, npmrcContent);
    console.log('✓ Token saved to .npmrc\n');
  } catch (err) {
    console.error('❌ Failed to save token');
    process.exit(1);
  }

  // 1. Bump version
  console.log(`📦 Bumping version (${versionType})...`);
  try {
    if (versionType.match(/^\d+\.\d+\.\d+$/)) {
      execSync(`npm version ${versionType}`, { stdio: 'inherit' });
    } else {
      execSync(`npm version ${versionType}`, { stdio: 'inherit' });
    }
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
    console.error('\nTroubleshooting:');
    console.error('  - Verify token belongs to package owner (ibrahimhamed112)');
    console.error('  - Check token has publish scope permissions');
    console.error('  - Try: npm whoami\n');
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

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (publishSuccess) {
    const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`✅ Publish completed! Version ${updatedPackageJson.version} is now live.\n`);
  } else {
    console.error('\n⚠ Publish workflow completed with errors.');
    console.error('   Version bump and git push completed, but npm publish failed.');
    console.error('   Try again: npm publish --access public\n');
  }
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
