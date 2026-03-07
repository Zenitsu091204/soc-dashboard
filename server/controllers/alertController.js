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

// @desc    Get all alerts (with optional pagination)
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const { startDate, endDate, threatActor } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }
    if (threatActor) {
      where.description = { contains: threatActor, mode: 'insensitive' };
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [alerts, total] = await Promise.all([
        prisma.alert.findMany({
          where,
          skip,
          take: limit,
          orderBy: { timestamp: 'desc' },
        }),
        prisma.alert.count({ where }),
      ]);
      return res.json({ data: alerts, meta: { total, page, limit } });
    }

    const alerts = await prisma.alert.findMany({
      where,
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

    if (req.io) {
      req.io.emit('newAlert', alert);
    }

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

    if (req.io) {
      req.io.emit('alertUpdated', alert);
    }

    res.json(alert);
  } catch (error) {
    // P2025 = Record to update not found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Alert not found' });
    }
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/alerts/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // Run all queries in parallel for better performance
    const [totalAlerts, criticalAlerts, highAlerts, openCases, activeIocs] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { severity: 'critical' } }),
      prisma.alert.count({ where: { severity: 'high' } }),
      prisma.case.count({ where: { status: 'open' } }),
      prisma.ioc.count(),
    ]);

    res.json({
      totalAlerts,
      criticalAlerts,
      highAlerts,
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
