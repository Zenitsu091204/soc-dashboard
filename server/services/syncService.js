const prisma = require('../utils/prisma');
const openctiService = require('./openctiService');
const auditService = require('./auditService');

/**
 * Synchronize threat intelligence from OpenCTI to the local database.
 */
const syncIntelligence = async (userId = 'SYSTEM') => {
  console.log('Starting OpenCTI synchronization...');
  
  await auditService.logAction({
    userId,
    action: 'SYNC_STARTED',
    entityType: 'Service',
    details: 'OpenCTI intelligence synchronization initiated',
  });

  try {
    const intel = await openctiService.fetchAllIntel();

    const results = {
      indicators: 0,
      campaigns: 0,
      actors: 0,
      fresh: 0,
    };

    // 1. Sync Indicators (IOCs)
    for (const indicator of intel.indicators) {
      try {
        const value = indicator.name; 
        
        const existingIoc = await prisma.ioc.findUnique({ where: { value } });
        
        await prisma.ioc.upsert({
          where: { value },
          update: {
            confidence: indicator.confidence,
            name: indicator.name,
            description: indicator.description,
            pattern: indicator.pattern,
          },
          create: {
            type: indicator.type.toLowerCase().includes('ip') ? 'ip' : 
                  indicator.type.toLowerCase().includes('domain') ? 'domain' : 'hash',
            value,
            name: indicator.name,
            description: indicator.description,
            pattern: indicator.pattern,
            confidence: indicator.confidence,
          }
        });

        if (!existingIoc) results.fresh++;

        // SOC Evolution: Tiered Automation Logic
        const ioc = await prisma.ioc.findUnique({ where: { value } });
        const existingRule = await prisma.rule.findFirst({ where: { indicatorId: ioc.id } });
        
        if (!existingRule) {
          const ruleService = require('./ruleService');
          const ruleData = await ruleService.generateRule(ioc);
          
          if (ruleData) {
            // Tier 1: Confidence > 90 -> Auto-deploy (Active)
            if (indicator.confidence > 90) {
              ruleData.status = 'active';
              await prisma.rule.create({ data: ruleData });
              console.log(`[AUTO-DEPLOY] Active rule for high-confidence IOC: ${value}`);
            } 
            // Tier 2: Confidence > 70 -> Auto-generate (Pending)
            else if (indicator.confidence > 70) {
              ruleData.status = 'pending';
              await prisma.rule.create({ data: ruleData });
              console.log(`[AUTO-GENERATE] Pending rule for medium-confidence IOC: ${value}`);
            }
          }
        }

        results.indicators++;
      } catch (err) {
        console.error(`Error syncing indicator ${indicator.name}:`, err.message);
      }
    }

    // 2. Sync Campaigns
    for (const campaign of intel.campaigns) {
      try {
        await prisma.campaign.upsert({
          where: { id: campaign.id },
          update: {
            title: campaign.name,
            description: campaign.description,
            status: campaign.status || 'Active',
            severity: campaign.confidence > 80 ? 'Critical' : campaign.confidence > 50 ? 'High' : 'Medium',
          },
          create: {
            id: campaign.id,
            title: campaign.name,
            description: campaign.description,
            status: campaign.status || 'Active',
            severity: campaign.confidence > 80 ? 'Critical' : campaign.confidence > 50 ? 'High' : 'Medium',
          }
        });
        results.campaigns++;
      } catch (err) {
        console.error(`Error syncing campaign ${campaign.name}:`, err.message);
      }
    }

    // 3. Sync Threat Actors
    for (const actor of intel.actors) {
      try {
        await prisma.threatActor.upsert({
          where: { name: actor.name },
          update: {
            lastSeen: new Date(),
          },
          create: {
            name: actor.name,
            type: 'State-sponsored',
            lastSeen: new Date(),
          }
        });
        results.actors++;
      } catch (err) {
        console.error(`Error syncing actor ${actor.name}:`, err.message);
      }
    }

    await prisma.syncStatus.upsert({
      where: { serviceName: 'OpenCTI' },
      update: { 
        lastSync: new Date(), 
        status: 'success', 
        message: `Synced ${results.indicators} IOCs`,
        iocCount: results.indicators,
        freshness: results.fresh
      },
      create: { 
        serviceName: 'OpenCTI', 
        lastSync: new Date(), 
        status: 'success', 
        message: `Initial sync success`,
        iocCount: results.indicators,
        freshness: results.fresh
      }
    });

    await auditService.logAction({
      userId,
      action: 'SYNC_SUCCESS',
      entityType: 'Service',
      details: {
        message: 'OpenCTI synchronization completed successfully',
        results
      }
    });

    return results;
  } catch (error) {
    await prisma.syncStatus.upsert({
      where: { serviceName: 'OpenCTI' },
      update: { lastSync: new Date(), status: 'error', message: error.message },
      create: { serviceName: 'OpenCTI', lastSync: new Date(), status: 'error', message: error.message }
    });

    await auditService.logAction({
      userId,
      action: 'SYNC_FAILURE',
      entityType: 'Service',
      details: error.message,
    });

    throw error;
  }
};

module.exports = {
  syncIntelligence,
};
