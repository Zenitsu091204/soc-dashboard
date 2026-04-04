const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Executes a command and logs the output in a clean, consistent way.
 */
function runCommand(command, description, cwd = process.cwd()) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
    console.log(`✅ ${description} complete!`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

/**
 * Main Setup Workflow
 */
async function setup() {
  console.clear();
  console.log('🛡️  SOC Dashboard - Automated Setup Iniciated');
  console.log('============================================\n');

  // 1. Environment Variable Check
  const envFile = path.join(__dirname, 'server', '.env');
  const envExampleFile = path.join(__dirname, 'server', '.env.example');

  if (!fs.existsSync(envFile)) {
    console.log('⚙️  Creating .env from .env.example...');
    fs.copyFileSync(envExampleFile, envFile);
    console.log('✅ .env file created successfully in /server.\n');
  } else {
    console.log('✅ .env already exists. Skipping creation.\n');
  }

  // 2. Install Dependencies
  runCommand('npm install', 'Installing root dependencies');
  runCommand('npm install', 'Installing backend dependencies (server/)', 'server');
  runCommand('npm install', 'Installing frontend dependencies (client/)', 'client');

  // 3. Database Initialization
  console.log('\n🗄️  Starting database migration...');
  runCommand('npx prisma migrate dev --name init', 'Initializing database schema', 'server');

  // 4. Seed Data
  runCommand('node prisma/seed.js', 'Seeding initial demo data', 'server');

  console.log('\n============================================');
  console.log('🎉 SOC Dashboard Setup Complete!');
  console.log('Run the application with: npm run dev');
  console.log('============================================');
}

setup();
