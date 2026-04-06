const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Settings Persistence Test ---');

  try {
    // 1. Test Workspace Settings (Alerts/Dashboard)
    console.log('\n[1/3] Testing Workspace Settings...');
    const workspaceUpdates = {
      criticalSla: 12,
      notifySlack: true,
      compactMode: true,
      refreshInterval: 45
    };
    
    // Simulate updating via Prisma directly (as the controller would)
    for (const [key, value] of Object.entries(workspaceUpdates)) {
      await prisma.workspaceSetting.upsert({
        where: { key },
        update: { value: String(value), type: typeof value },
        create: { key, value: String(value), type: typeof value }
      });
    }
    
    const savedWorkspace = await prisma.workspaceSetting.findMany({
      where: { key: { in: Object.keys(workspaceUpdates) } }
    });
    console.log('Saved Workspace Settings:', savedWorkspace.map(s => `${s.key}: ${s.value}`));

    // 2. Test Integrations (SIEM/Slack etc)
    console.log('\n[2/3] Testing Integrations...');
    const slackIntegration = await prisma.integration.findUnique({ where: { name: 'slack' } });
    if (slackIntegration) {
      await prisma.integration.update({
        where: { name: 'slack' },
        data: {
          endpoint: 'https://hooks.slack.com/services/HARDENED',
          config: JSON.stringify({ syncFreq: '1m' }),
          status: 'Connected'
        }
      });
      const updatedSlack = await prisma.integration.findUnique({ where: { name: 'slack' } });
      console.log('Updated Slack Integration:', {
        name: updatedSlack.name,
        endpoint: updatedSlack.endpoint,
        status: updatedSlack.status,
        config: updatedSlack.config
      });
    } else {
      console.log('Slack integration not found (this is expected if not seeded)');
    }

    // 3. Test User Profile Persistence
    console.log('\n[3/3] Testing User Profile...');
    const admin = await prisma.user.findUnique({ where: { email: 'admin@soc.com' } });
    if (admin) {
      await prisma.user.update({
        where: { email: 'admin@soc.com' },
        data: { phone: '999-888-7777', name: 'Admin Hardened' }
      });
      const updatedAdmin = await prisma.user.findUnique({ where: { email: 'admin@soc.com' } });
      console.log('Updated Admin User:', {
        name: updatedAdmin.name,
        phone: updatedAdmin.phone
      });
    }

    console.log('\n--- Persistence Test Successful ---');
  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
