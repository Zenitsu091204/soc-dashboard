const prisma = require('../utils/prisma');
const { logAction } = require('../services/auditService');

/**
 * Get all incidents (Cases).
 */
const getIncidents = async (req, res) => {
  try {
    const incidents = await prisma.case.findMany({
      include: { 
        _count: {
          select: { alerts: true, incidentIocs: true, incidentRules: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get incident by ID with all relations.
 */
const getIncidentById = async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await prisma.case.findUnique({
      where: { id },
      include: {
        alerts: true,
        incidentIocs: { include: { ioc: true } },
        incidentRules: { include: { rule: true } },
      }
    });
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch incident details' });
  }
};

/**
 * Update incident status, notes, or assignment.
 */
const updateIncident = async (req, res) => {
  const { id } = req.params;
  const { status, notes, assignedTo, resolution, priority } = req.body;

  try {
    const incident = await prisma.case.update({
      where: { id },
      data: { status, notes, assignedTo, resolution, priority },
    });

    await logAction({
      userId: req.user.id,
      action: 'INCIDENT_UPDATED',
      entityType: 'Case',
      entityId: id,
      details: { status, assignedTo, priority },
    });

    res.json(incident);
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ message: 'Failed to update incident' });
  }
};

/**
 * Link an IOC to an incident.
 */
const linkIoc = async (req, res) => {
  const { id } = req.params;
  const { iocId } = req.body;

  try {
    await prisma.caseIoc.create({
      data: { caseId: id, iocId }
    });

    await logAction({
      userId: req.user.id,
      action: 'INCIDENT_IOC_LINKED',
      entityType: 'Case',
      entityId: id,
      details: { iocId },
    });

    res.json({ message: 'IOC linked to incident successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to link IOC' });
  }
};

/**
 * Link a Rule to an incident.
 */
const linkRule = async (req, res) => {
  const { id } = req.params;
  const { ruleId } = req.body;

  try {
    await prisma.caseRule.create({
      data: { caseId: id, ruleId }
    });

    await logAction({
      userId: req.user.id,
      action: 'INCIDENT_RULE_LINKED',
      entityType: 'Case',
      entityId: id,
      details: { ruleId },
    });

    res.json({ message: 'Rule linked to incident successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to link Rule' });
  }
};

/**
 * Get incident timeline (audits + alerts).
 */
const getIncidentTimeline = async (req, res) => {
  const { id } = req.params;
  try {
    const auditLogs = await prisma.auditLog.findMany({
      where: { 
        OR: [
          { entityId: id, entityType: 'Case' },
          { entityId: id, entityType: 'INCIDENT' } // Compatibility with old logs
        ]
      },
      orderBy: { timestamp: 'desc' },
    });
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch timeline' });
  }
};

module.exports = {
  getIncidents,
  getIncidentById,
  updateIncident,
  linkIoc,
  linkRule,
  getIncidentTimeline,
};
