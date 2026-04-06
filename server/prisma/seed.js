/**
 * seed.js — Production Seed
 *
 * Seeds only the minimum required structural data:
 *   1. Default admin and analyst users (change passwords post-deploy)
 *   2. Integration stubs (configured via Settings UI after deploy)
 *   3. Default workspace settings
 *
 * NO mock alerts, fake IOCs, dummy threat actors, or generated incidents.
 * All operational data enters through the live application (WAF, OpenCTI sync, manual entry).
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production seed...\n');

  // ── 1. Users ──────────────────────────────────────────────────────────────
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('password123', salt);

  await prisma.user.upsert({
    where: { email: 'admin@soc.com' },
    update: {},
    create: { email: 'admin@soc.com', name: 'Admin User', password: hashed, role: 'admin' },
  });
  await prisma.user.upsert({
    where: { email: 'analyst@soc.com' },
    update: {},
    create: { email: 'analyst@soc.com', name: 'SOC Analyst', password: hashed, role: 'analyst' },
  });
  console.log('✅ Default users created (remember to change passwords!)');

  // ── 2. Integration Stubs ─────────────────────────────────────────────────
  // These are empty stubs — configure API keys and endpoints via Settings → Integrations
  const integrations = [
    {
      name: 'siem',
      status: 'Disconnected',
      apiKey: '',
      endpoint: '',
      config: JSON.stringify({ index: 'logs-*', retention: 90 }),
    },
    {
      name: 'slack',
      status: 'Disconnected',
      apiKey: '',
      endpoint: '',
      config: JSON.stringify({ channel: '#alerts-critical' }),
    },
    {
      name: 'virustotal',
      status: 'Disconnected',
      apiKey: '',
      endpoint: 'https://www.virustotal.com/api/v3',
    },
  ];

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { name: integration.name },
      update: {},
      create: integration,
    });
  }
  console.log('✅ Integration stubs created (configure via Settings page)');

  // ── 3. Workspace Settings ────────────────────────────────────────────────
  const settings = [
    { key: 'criticalSla', value: '15',    type: 'number' },
    { key: 'highSla',     value: '60',    type: 'number' },
    { key: 'retention',   value: '90',    type: 'number' },
    { key: 'autoRefresh', value: 'true',  type: 'boolean' },
    { key: 'compactMode', value: 'false', type: 'boolean' },
    { key: 'timezone',    value: 'UTC',   type: 'string' },
  ];

  for (const s of settings) {
    await prisma.workspaceSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Workspace settings initialized');

  console.log('\n🎉 Production seed complete!');
  console.log('');
  console.log('  Admin:   admin@soc.com    / password123  ⚠️  CHANGE THIS');
  console.log('  Analyst: analyst@soc.com  / password123  ⚠️  CHANGE THIS');
  console.log('');
  console.log('  Next steps:');
  console.log('  1. Change default passwords via Settings → Team Management');
  console.log('  2. Configure integrations via Settings → Integrations');
  console.log('  3. Set OPENCTI_URL + OPENCTI_TOKEN in .env to enable intel sync');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
