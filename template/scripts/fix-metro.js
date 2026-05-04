#!/usr/bin/env node

/**
 * Fix Metro dev server port conflict
 * Kills any process using port 8081 and optionally restarts Metro
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  console.log('\n🔧 Metro Dev Server Port Fixer\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Find process using port 8081
  console.log('🔍 Checking port 8081...');
  try {
    const result = execSync('lsof -i :8081 -t', { encoding: 'utf8' }).trim();

    if (!result) {
      console.log('✓ Port 8081 is free\n');
      rl.close();
      return;
    }

    const pid = result.split('\n')[0];
    console.log(`✓ Found process using port 8081 (PID: ${pid})\n`);

    // Kill the process
    console.log('💀 Killing process...');
    try {
      execSync(`kill -9 ${pid}`);
      console.log(`✓ Process ${pid} killed\n`);
    } catch (err) {
      console.error(`❌ Failed to kill process: ${err.message}\n`);
      rl.close();
      process.exit(1);
    }

    // Ask if user wants to restart Metro
    const restart = await question('Start Metro dev server? [y/n]: ');

    if (restart === 'y' || restart === 'yes') {
      console.log('\n🚀 Starting Metro...\n');
      rl.close();
      // Run npm start and inherit stdio so output shows in terminal
      execSync('npm start', { stdio: 'inherit' });
    } else {
      console.log('\n✅ Port 8081 is now free. Ready to start Metro.\n');
      rl.close();
    }
  } catch (err) {
    if (err.status === 1 || err.message.includes('not found')) {
      console.log('✓ Port 8081 is free (no processes found)\n');
    } else {
      console.error('❌ Error checking port:', err.message);
    }
    rl.close();
    process.exit(1);
  }
}

main();
