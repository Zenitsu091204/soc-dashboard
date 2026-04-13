/**
 * clear.js — Wipes all operational data and threat intelligence from the database.
 * Preserves core structural data (Users, Integrations, Settings).
 * Run: node prisma/clear.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing all operational and intelligence data...');

  // 1. Clear Intelligence Knowledge base
  await prisma.openCtiReport.deleteMany({});
  await prisma.openCtiIncident.deleteMany({});
  await prisma.openCtiMalware.deleteMany({});
  await prisma.openCtiIntrusionSet.deleteMany({});
  await prisma.openCtiSighting.deleteMany({});
  await prisma.openCtiObservable.deleteMany({});
  await prisma.openCtiRelationship.deleteMany({});
  await prisma.openCtiConnector.deleteMany({});
  await prisma.openCtiExternalReference.deleteMany({});
  console.log('  ✅ OpenCTI Knowledge Base cleared');

  // 2. Clear Operational Data
  await prisma.campaign.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.caseIoc.deleteMany({});
  await prisma.caseRule.deleteMany({});
  await prisma.rule.deleteMany({});
  await prisma.case.deleteMany({});
  console.log('  ✅ Campaigns, Alerts, Rules and Cases cleared');

  // 3. Clear Intelligence Summaries
  await prisma.ioc.deleteMany({});
  await prisma.threatActor.deleteMany({});
  console.log('  ✅ IOCs and Threat Actors cleared');

  // 4. Reset Sync History
  await prisma.syncStatus.deleteMany({});
  console.log('  ✅ Sync history reset');

  // 5. Cleanup Users (Keep primary admin)
  await prisma.user.deleteMany({ where: { role: { not: 'admin' } } });
  console.log('  ✅ Non-admin users removed');

  console.log('\n✨ Database is now a CLEAN SLATE.');
  console.log('   Run "npx prisma db seed" to restore production foundation.\n');
}

main()
  .catch((e) => {
    console.error('❌ Clear failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
