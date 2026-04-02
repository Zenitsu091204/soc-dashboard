const prisma = require('../utils/prisma');

/**
 * Service to correlate alerts based on shared entities and time windows.
 */
class CorrelationService {
  /**
   * Correlate a newly created alert with existing alerts.
   * @param {Object} alert - The newly created alert.
   */
  static async correlate(alert) {
    const WINDOW_MINUTES = 30; // 30-minute window for correlation
    const windowStart = new Date(alert.timestamp.getTime() - WINDOW_MINUTES * 60 * 1000);

    try {
      // Find recent alerts with the same entity, sourceIp, or destIp
      const matchingAlerts = await prisma.alert.findMany({
        where: {
          id: { not: alert.id },
          timestamp: { gte: windowStart },
          status: { not: 'resolved' },
          OR: [
            { entity: alert.entity && alert.entity !== 'N/A' ? alert.entity : undefined },
            { sourceIp: alert.sourceIp && alert.sourceIp !== 'N/A' ? alert.sourceIp : undefined },
            { destIp: alert.destIp && alert.destIp !== 'N/A' ? alert.destIp : undefined },
          ].filter(Boolean),
        },
        include: { case: true },
        orderBy: { timestamp: 'desc' },
      });

      if (matchingAlerts.length > 0) {
        console.log(`[Correlation] Found ${matchingAlerts.length} matching alerts for alert ${alert.id}`);

        // 1. Check if any matches already belong to a Case
        const existingCase = matchingAlerts.find(a => a.caseId)?.case;

        if (existingCase) {
          // Add this alert to the existing case
          await prisma.alert.update({
            where: { id: alert.id },
            data: { caseId: existingCase.id },
          });
          console.log(`[Correlation] Linked alert ${alert.id} to existing Case: ${existingCase.id}`);
        } else {
          // 2. No existing case, create a new one for all matching alerts
          const newCase = await prisma.case.create({
            data: {
              title: `Automated Incident: ${alert.title}`,
              description: `Automatically correlated group of ${matchingAlerts.length + 1} related alerts.`,
              priority: alert.severity === 'critical' ? 'high' : 'medium',
              status: 'open',
            },
          });

          // Update all matching alerts and the new one to belong to this case
          const alertIdsToUpdate = [alert.id, ...matchingAlerts.map(a => a.id)];
          await prisma.alert.updateMany({
            where: { id: { in: alertIdsToUpdate } },
            data: { caseId: newCase.id },
          });

          console.log(`[Correlation] Created new Case ${newCase.id} for ${alertIdsToUpdate.length} alerts.`);
        }
      }
    } catch (error) {
      console.error('[Correlation Error]:', error);
    }
  }
}

module.exports = CorrelationService;
