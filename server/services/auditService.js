const prisma = require('../utils/prisma');

/**
 * Log an action to the AuditLog.
 */
const logAction = async ({ userId, action, entityType, entityId, details }) => {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
      },
    });
    return log;
  } catch (error) {
    console.error('Audit logging failed:', error);
    // Don't throw - we don't want to break the main flow if auditing fails
  }
};

module.exports = {
  logAction,
};
