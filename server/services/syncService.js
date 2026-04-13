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
      reports: 0,
      sightings: 0,
      incidents: 0,
      observables: 0,
      malware: 0,
      intrusionSets: 0,
      relationships: 0,
      connectors: 0,
      fresh: 0,
    };

    // 1. Sync Indicators (IOCs)
    for (const indicator of intel.indicators) {
      try {
        const value = indicator.name; 
        const existingIoc = await prisma.ioc.findUnique({ where: { value } });
        const isImportant = indicator.confidence > 80;
        
        await prisma.ioc.upsert({
          where: { value },
          update: {
            confidence: indicator.confidence,
            name: indicator.name,
            description: indicator.description,
            pattern: indicator.pattern,
            important: isImportant,
          },
          create: {
            type: indicator.type.toLowerCase().includes('ip') ? 'ip' : 
                  indicator.type.toLowerCase().includes('domain') ? 'domain' : 'hash',
            value,
            name: indicator.name,
            description: indicator.description,
            pattern: indicator.pattern,
            confidence: indicator.confidence,
            important: isImportant,
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
            if (indicator.confidence > 90) {
              ruleData.status = 'active';
              await prisma.rule.create({ data: ruleData });
            } else if (indicator.confidence > 70) {
              ruleData.status = 'pending';
              await prisma.rule.create({ data: ruleData });
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
        const severity = campaign.confidence > 80 ? 'Critical' : campaign.confidence > 50 ? 'High' : 'Medium';
        const isImportant = severity === 'Critical' || severity === 'High';
        
        await prisma.campaign.upsert({
          where: { id: campaign.id },
          update: {
            title: campaign.name,
            description: campaign.description,
            status: campaign.status || 'Active',
            severity: severity,
            important: isImportant,
          },
          create: {
            id: campaign.id,
            title: campaign.name,
            description: campaign.description,
            status: campaign.status || 'Active',
            severity: severity,
            important: isImportant,
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
        const isImportant = actor.confidence > 80;
        await prisma.threatActor.upsert({
          where: { name: actor.name },
          update: { 
            lastSeen: new Date(),
            important: isImportant,
          },
          create: {
            name: actor.name,
            type: 'State-sponsored',
            lastSeen: new Date(),
            important: isImportant,
          }
        });
        results.actors++;
      } catch (err) {
        console.error(`Error syncing actor ${actor.name}:`, err.message);
      }
    }

    // 4. Sync Reports (Mark as Important if recent or high status)
    for (const report of intel.reports) {
      try {
        await prisma.openCtiReport.upsert({
          where: { id: report.id },
          update: {
            status: report.status,
            important: report.status === 'New' || !!report.marking,
          },
          create: {
            id: report.id,
            name: report.name,
            description: report.description,
            published: report.published ? new Date(report.published) : null,
            status: report.status,
            marking: report.marking,
            important: report.status === 'New' || !!report.marking,
          }
        });
        results.reports++;
      } catch (err) {}
    }

    // 5. Sync Incidents (Always Important)
    for (const incident of intel.incidents) {
      try {
        await prisma.openCtiIncident.upsert({
          where: { id: incident.id },
          update: {
            severity: incident.severity,
            status: incident.status,
          },
          create: {
            id: incident.id,
            name: incident.name,
            description: incident.description,
            type: incident.type,
            severity: incident.severity,
            source: incident.source,
            firstSeen: incident.firstSeen ? new Date(incident.firstSeen) : null,
            lastSeen: incident.lastSeen ? new Date(incident.lastSeen) : null,
            important: true,
          }
        });
        results.incidents++;
      } catch (err) {}
    }

    // 6. Sync Malware (Important)
    for (const mw of intel.malware) {
      try {
        await prisma.openCtiMalware.upsert({
          where: { id: mw.id },
          update: { lastSeen: mw.lastSeen ? new Date(mw.lastSeen) : null },
          create: {
            id: mw.id,
            name: mw.name,
            description: mw.description,
            firstSeen: mw.firstSeen ? new Date(mw.firstSeen) : null,
            lastSeen: mw.lastSeen ? new Date(mw.lastSeen) : null,
            important: true,
          }
        });
        results.malware++;
      } catch (err) {}
    }

    // 7. Sync Relationships (System Data - Not flagged as important for UI list)
    for (const rel of intel.relationships) {
      try {
        await prisma.openCtiRelationship.upsert({
          where: { id: rel.id },
          update: { confidence: rel.confidence },
          create: {
            id: rel.id,
            sourceId: rel.sourceId,
            sourceType: rel.sourceType,
            targetId: rel.targetId,
            targetType: rel.targetType,
            relationshipType: rel.type,
            description: rel.description,
            confidence: rel.confidence,
          }
        });
        results.relationships++;
      } catch (err) {}
    }

    // 8. Sync Connectors
    for (const conn of intel.connectors) {
      try {
        await prisma.openCtiConnector.upsert({
          where: { id: conn.id },
          update: { status: conn.status, lastSeen: conn.updatedAt ? new Date(conn.updatedAt) : null },
          create: {
            id: conn.id,
            name: conn.name,
            type: conn.type,
            status: conn.status,
            lastSeen: conn.updatedAt ? new Date(conn.updatedAt) : null,
          }
        });
        results.connectors++;
      } catch (err) {}
    }

    await prisma.syncStatus.upsert({
      where: { serviceName: 'OpenCTI' },
      update: { 
        lastSync: new Date(), 
        status: 'success', 
        message: `Synced ${results.indicators} IOCs, ${results.reports} Reports, ${results.malware} Malware`,
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
