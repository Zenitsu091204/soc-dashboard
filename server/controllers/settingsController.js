const prisma = require('../utils/prisma');

// @desc    Get all active integrations
// @route   GET /api/settings/integrations
// @access  Private/Admin
const getIntegrations = async (req, res) => {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(integrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ message: 'Server error fetching integrations' });
  }
};

// @desc    Update an integration
// @route   PATCH /api/settings/integrations/:id
// @access  Private/Admin
const updateIntegration = async (req, res) => {
  const { id } = req.params;
  const { status, apiKey, endpoint, config } = req.body;

  try {
    const integration = await prisma.integration.update({
      where: { id },
      data: {
        status,
        apiKey,
        endpoint,
        config: config ? JSON.stringify(config) : undefined
      }
    });
    res.json(integration);
  } catch (error) {
    console.error('Update integration error:', error);
    res.status(500).json({ message: 'Server error updating integration' });
  }
};

// @desc    Get all workspace settings
// @route   GET /api/settings/workspace
// @access  Private/Admin
const getWorkspaceSettings = async (req, res) => {
  try {
    const settings = await prisma.workspaceSetting.findMany();
    // Transform into a key-value object for easier frontend consumption
    const settingsMap = settings.reduce((acc, s) => {
      let val = s.value;
      if (s.type === 'number') val = Number(val);
      if (s.type === 'boolean') val = val === 'true';
      acc[s.key] = val;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
};

// @desc    Update workspace settings
// @route   POST /api/settings/workspace
// @access  Private/Admin
const updateWorkspaceSettings = async (req, res) => {
  const updates = req.body; // { key: value, ... }

  try {
    const result = await prisma.$transaction(
      Object.entries(updates).map(([key, value]) => {
        let type = typeof value;
        let stringValue = String(value);
        
        return prisma.workspaceSetting.upsert({
          where: { key },
          update: { value: stringValue, type },
          create: { key, value: stringValue, type }
        });
      })
    );
    res.json({ message: 'Settings updated successfully', count: result.length });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};

module.exports = {
  getIntegrations,
  updateIntegration,
  getWorkspaceSettings,
  updateWorkspaceSettings,
};
