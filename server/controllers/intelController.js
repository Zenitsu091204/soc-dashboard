const prisma = require('../utils/prisma');
const openCtiService = require('../services/openctiService');
const syncService = require('../services/syncService');

// @desc    Get all Threat Actors (with optional pagination)
// @route   GET /api/intel/actors
// @access  Private
const getThreatActors = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const importantOnly = req.query.important === 'true';

    const where = {};
    if (importantOnly) where.important = true;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [actors, total] = await Promise.all([
        prisma.threatActor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { lastSeen: 'desc' },
        }),
        prisma.threatActor.count({ where }),
      ]);
      return res.json({ data: actors, meta: { total, page, limit } });
    }

    const actors = await prisma.threatActor.findMany({
      where,
      orderBy: { lastSeen: 'desc' },
    });
    res.json(actors);
  } catch (error) {
    console.error('Get threat actors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get individual Threat Actor by ID
// @route   GET /api/intel/actors/:id
// @access  Private
const getThreatActorById = async (req, res) => {
  try {
    const actor = await prisma.threatActor.findUnique({
      where: { id: req.params.id },
    });
    if (!actor) {
      return res.status(404).json({ message: 'Threat Actor not found' });
    }
    res.json(actor);
  } catch (error) {
    console.error('Get threat actor by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all IOCs (with optional pagination)
// @route   GET /api/intel/iocs
// @access  Private
const getIocs = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const importantOnly = req.query.important === 'true';

    const where = {};
    if (importantOnly) where.important = true;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [iocs, total] = await Promise.all([
        prisma.ioc.findMany({
          where,
          skip,
          take: limit,
          orderBy: { seenAt: 'desc' },
        }),
        prisma.ioc.count({ where }),
      ]);
      return res.json({ data: iocs, meta: { total, page, limit } });
    }

    const iocs = await prisma.ioc.findMany({
      where,
      orderBy: { seenAt: 'desc' },
    });
    res.json(iocs);
  } catch (error) {
    console.error('Get IOCs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get individual IOC by ID
// @route   GET /api/intel/iocs/:id
// @access  Private
const getIocById = async (req, res) => {
  try {
    const ioc = await prisma.ioc.findUnique({
      where: { id: req.params.id },
    });
    if (!ioc) {
      return res.status(404).json({ message: 'IOC not found' });
    }
    res.json(ioc);
  } catch (error) {
    console.error('Get IOC by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

let openCtiCache = { data: null, timestamp: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// @desc    Get OpenCTI correlations/matches
// @route   GET /api/intel/opencti-matches
// @access  Private
const getOpenCtiMatches = async (req, res) => {
  try {
    // Fetch high-confidence indicators from our local database (populated by sync)
    const matches = await prisma.ioc.findMany({
      where: { confidence: { gt: 0 } },
      orderBy: { confidence: 'desc' },
      take: 20,
    });

    const formattedMatches = matches.map(m => ({
      id: m.id,
      actor: 'OpenCTI Source',
      type: m.type,
      value: m.value,
      confidence: m.confidence,
      risk: m.confidence > 80 ? 'Critical' : m.confidence > 50 ? 'High' : 'Medium',
    }));

    res.json(formattedMatches);
  } catch (error) {
    console.error('Get OpenCTI matches error:', error.message);
    res.status(500).json({ message: 'Failed to fetch OpenCTI correlations' });
  }
};

// @desc    Create a new IOC
// @route   POST /api/intel/iocs
// @access  Private
const createIoc = async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ message: 'Type and value are required' });
  }

  try {
    const ioc = await prisma.ioc.create({
      data: { type, value },
    });

    res.status(201).json(ioc);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'IOC already exists' });
    }
    console.error('Create IOC error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Test OpenCTI Connection
// @route   GET /api/intel/test-connection
// @access  Private
const testCtiConnection = async (req, res) => {
  const result = await openCtiService.testConnection();
  res.json(result);
};

// @desc    Trigger manual sync with OpenCTI
// @route   POST /api/intel/sync
// @access  Private
const triggerSync = async (req, res) => {
  try {
    const userId = req.user?.id || 'SYSTEM';
    const results = await syncService.syncIntelligence(userId);
    res.json({ message: 'Sync complete', results });
  } catch (error) {
    console.error('Trigger sync error:', error);
    res.status(500).json({ message: 'Sync failed' });
  }
};

// @desc    Get latest sync status
// @route   GET /api/intel/sync/status
// @access  Private
const getSyncStatus = async (req, res) => {
  try {
    const status = await prisma.syncStatus.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    res.json(status || { status: 'never_run', iocCount: 0, message: 'No sync history found' });
  } catch (error) {
    console.error('Get sync status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get OpenCTI Reports
// @route   GET /api/intel/reports
const getReports = async (req, res) => {
  try {
    const importantOnly = req.query.important === 'true';
    const where = importantOnly ? { important: true } : {};
    const reports = await prisma.openCtiReport.findMany({
      where,
      orderBy: { published: 'desc' },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// @desc    Get OpenCTI Incidents
// @route   GET /api/intel/incidents
const getIncidents = async (req, res) => {
  try {
    const importantOnly = req.query.important === 'true';
    const where = importantOnly ? { important: true } : {};
    const incidents = await prisma.openCtiIncident.findMany({
      where,
      orderBy: { firstSeen: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
};

// @desc    Get OpenCTI Malware
// @route   GET /api/intel/malware
const getMalware = async (req, res) => {
  try {
    const importantOnly = req.query.important === 'true';
    const where = importantOnly ? { important: true } : {};
    const malware = await prisma.openCtiMalware.findMany({
      where,
      orderBy: { lastSeen: 'desc' },
    });
    res.json(malware);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch malware' });
  }
};

// @desc    Get Relationships
// @route   GET /api/intel/relationships
const getRelationships = async (req, res) => {
  try {
    const relationships = await prisma.openCtiRelationship.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch relationships' });
  }
};

// @desc    Get Connectors
// @route   GET /api/intel/connectors
const getConnectors = async (req, res) => {
  try {
    const connectors = await prisma.openCtiConnector.findMany({
      orderBy: { lastSeen: 'desc' },
    });
    res.json(connectors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch connectors' });
  }
};

module.exports = {
  getThreatActors,
  getThreatActorById,
  getIocs,
  getIocById,
  getOpenCtiMatches,
  createIoc,
  testCtiConnection,
  triggerSync,
  getSyncStatus,
  getReports,
  getIncidents,
  getMalware,
  getRelationships,
  getConnectors,
};
