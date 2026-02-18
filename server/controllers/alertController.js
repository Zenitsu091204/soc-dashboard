const prisma = require('../utils/prisma');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private/Admin
const createAlert = async (req, res) => {
  try {
    const alert = await prisma.alert.create({
      data: {
        ...req.body,
        timestamp: new Date(),
      },
    });
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update alert status
// @route   PATCH /api/alerts/:id
// @access  Private
const updateAlertStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/alerts/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalAlerts = await prisma.alert.count();
    const criticalAlerts = await prisma.alert.count({
      where: { severity: 'critical' },
    });
    const openCases = await prisma.case.count({
      where: { status: 'open' },
    });
    const activeIocs = await prisma.ioc.count();

    res.json({
      totalAlerts,
      criticalAlerts,
      openCases,
      activeIocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlertStatus,
  getStats,
};
