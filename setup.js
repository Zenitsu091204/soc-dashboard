const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

/**
 * Executes a command synchronously and logs the output in a clean, consistent way.
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
  console.log('=' + '='.repeat(60));
  console.log('🛡️  SOC Dashboard - Automated Full Setup & Launch');
  console.log('=' + '='.repeat(60) + '\n');

  // 1. Install Dependencies First (needed for Prisma, etc.)
  runCommand('npm install', 'Installing root dependencies');
  runCommand('npm install', 'Installing backend dependencies (server/)', path.join(__dirname, 'server'));
  runCommand('npm install', 'Installing frontend dependencies (client/)', path.join(__dirname, 'client'));

  // 2. Environment Variable Configuration
  const envFile = path.join(__dirname, 'server', '.env');
  const envExampleFile = path.join(__dirname, 'server', '.env.example');

  if (!fs.existsSync(envFile)) {
    console.log('\n⚙️  Configuring environment variables...');
    
    let envContent = '';
    if (fs.existsSync(envExampleFile)) {
      envContent = fs.readFileSync(envExampleFile, 'utf-8');
    } else {
      // Fallback if .env.example is missing
      envContent = `PORT=5000\nNODE_ENV=development\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/soc_dashboard?schema=public"\nCLIENT_ORIGIN=http://localhost:3000\n`;
    }

    // Auto-generate a secure JWT Secret if the placeholder exists
    if (envContent.includes('change_this_to_a_strong_random_secret_before_deploying_to_production')) {
      const newSecret = crypto.randomBytes(64).toString('hex');
      envContent = envContent.replace(
        'change_this_to_a_strong_random_secret_before_deploying_to_production',
        newSecret
      );
    } else if (!envContent.includes('JWT_SECRET=')) {
       envContent += `\nJWT_SECRET="${crypto.randomBytes(64).toString('hex')}"\n`;
    }

    fs.writeFileSync(envFile, envContent);
    console.log('✅ .env file created and secured with unique JWT_SECRET.\n');
  } else {
    console.log('\n✅ .env already exists. Skipping variable generation.\n');
  }

  // 3. Database Migration & Setup
  // Using 'migrate reset' to ensure the DB is perfectly up to date and clean 
  // (applies all migrations, then seeds automatically)
  console.log('🗄️  Starting database migration & seeding...\n');
  console.log('Note: If this stalls, ensure PostgreSQL is running natively (or via Docker) locally on port 5432');
  runCommand('npx prisma migrate reset --force', 'Resetting and seeding database schema', path.join(__dirname, 'server'));

  console.log('\n============================================================');
  console.log('🎉 Setup Complete! Launching the SOC Dashboard...');
  console.log('   (Press Ctrl+C at any time to stop the servers)');
  console.log('============================================================\n');

  // 4. Start the Application
  // Spawning `npm run dev` at the root which uses concurrently to start both frontend & backend
  const appProcess = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  appProcess.on('close', (code) => {
    console.log(`\n🔴 Dashboard stopped with code ${code}`);
  });
}

setup();
