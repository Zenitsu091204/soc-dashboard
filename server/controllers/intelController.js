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

// @desc    Get all IOCs
// @route   GET /api/intel/iocs
// @access  Private
const getIocs = async (req, res) => {
  try {
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
