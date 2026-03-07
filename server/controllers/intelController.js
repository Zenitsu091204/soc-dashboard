const prisma = require('../utils/prisma');

// @desc    Get all Threat Actors
// @route   GET /api/intel/actors
// @access  Private
const getThreatActors = async (req, res) => {
  try {
    const actors = await prisma.threatActor.findMany({
      orderBy: { lastSeen: 'desc' },
    });
    res.json(actors);
  } catch (error) {
    console.error('Get threat actors error:', error);
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

module.exports = {
  getThreatActors,
  getIocs,
};
