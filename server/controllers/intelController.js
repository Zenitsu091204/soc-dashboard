const prisma = require('../utils/prisma');
const openCtiService = require('../services/openctiService');

// @desc    Get all Threat Actors (with optional pagination)
// @route   GET /api/intel/actors
// @access  Private
const getThreatActors = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [actors, total] = await Promise.all([
        prisma.threatActor.findMany({
          skip,
          take: limit,
          orderBy: { lastSeen: 'desc' },
        }),
        prisma.threatActor.count(),
      ]);
      return res.json({ data: actors, meta: { total, page, limit } });
    }

    const actors = await prisma.threatActor.findMany({
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

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [iocs, total] = await Promise.all([
        prisma.ioc.findMany({
          skip,
          take: limit,
          orderBy: { seenAt: 'desc' },
        }),
        prisma.ioc.count(),
      ]);
      return res.json({ data: iocs, meta: { total, page, limit } });
    }

    const iocs = await prisma.ioc.findMany({
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
    if (openCtiCache.data && (Date.now() - openCtiCache.timestamp < CACHE_TTL_MS)) {
      return res.json(openCtiCache.data);
    }
    const data = await openCtiService.fetchOpenCtiMatches();
    openCtiCache = { data, timestamp: Date.now() };
    res.json(data);
  } catch (error) {
    console.error('Get OpenCTI matches error:', error.message);
    res.status(500).json({ message: 'Failed to fetch OpenCTI correlations' });
  }
};

module.exports = {
  getThreatActors,
  getThreatActorById,
  getIocs,
  getIocById,
  getOpenCtiMatches,
};
