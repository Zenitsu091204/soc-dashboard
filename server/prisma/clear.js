/**
 * clear.js — Wipes all sample/seed data from the database.
 * Keeps the admin account so you can still log in.
 * Run: node prisma/clear.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing all sample data...');

  await prisma.campaign.deleteMany({});
  console.log('  ✅ Campaigns cleared');

  await prisma.alert.deleteMany({});
  console.log('  ✅ Alerts cleared');

  await prisma.case.deleteMany({});
  console.log('  ✅ Cases cleared');

  await prisma.ioc.deleteMany({});
  console.log('  ✅ IOCs cleared');

  await prisma.threatActor.deleteMany({});
  console.log('  ✅ Threat Actors cleared');

  // Keep only the admin user for login — delete everything else
  await prisma.user.deleteMany({ where: { role: { not: 'admin' } } });
  console.log('  ✅ Non-admin users removed');

  console.log('\n✨ Database is clean and ready for production.');
  console.log('   Login: admin@soc.com / password123');
  console.log('   Connect your security tools to start ingesting real data.\n');
}

main()
  .catch((e) => {
    console.error('❌ Clear failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
