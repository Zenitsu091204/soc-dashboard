const { z } = require('zod');
const prisma = require('../utils/prisma');

// Validation schema for creating an alert
const createAlertSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  severity: z.enum(['low', 'medium', 'high', 'critical'], { message: 'Invalid severity level' }),
  source: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['open', 'investigating', 'resolved']).optional().default('open'),
});

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
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private/Admin
const createAlert = async (req, res) => {
  const parse = createAlertSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: parse.error.errors[0].message });
  }

  const { title, severity, source, description, status } = parse.data;

  try {
    const alert = await prisma.alert.create({
      data: {
        title,
        severity,
        source,
        description,
        status,
        timestamp: new Date(),
      },
    });
    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update alert status
// @route   PATCH /api/alerts/:id
// @access  Private
const updateAlertStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['open', 'investigating', 'resolved'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(alert);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/alerts/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // Run all 4 queries in parallel for better performance
    const [totalAlerts, criticalAlerts, openCases, activeIocs] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { severity: 'critical' } }),
      prisma.case.count({ where: { status: 'open' } }),
      prisma.ioc.count(),
    ]);

    res.json({
      totalAlerts,
      criticalAlerts,
      openCases,
      activeIocs,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlertStatus,
  getStats,
};
