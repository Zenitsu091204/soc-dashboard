const prisma = require('../utils/prisma');
const ruleService = require('../services/ruleService');
const naxsiService = require('../services/naxsiService');
const { logAction } = require('../services/auditService');

/**
 * Get all rules.
 */
const getRules = async (req, res) => {
  try {
    const rules = await prisma.rule.findMany({
      include: { indicator: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rules);
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Generate a rule from an IOC.
 */
const createRuleFromIoc = async (req, res) => {
  const { iocId } = req.body;
  
  try {
    const ioc = await prisma.ioc.findUnique({ where: { id: iocId } });
    if (!ioc) return res.status(404).json({ message: 'IOC not found' });

    const ruleData = await ruleService.generateRule(ioc);
    const rule = await prisma.rule.create({ data: ruleData });

    res.status(201).json(rule);
  } catch (error) {
    console.error('Create rule error:', error);
    res.status(500).json({ message: 'Failed to generate rule' });
  }
};

/**
 * Update rule status and sync with the config file.
 */
const updateRuleStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // active, disabled, rejected
  
  try {
    const rule = await prisma.rule.update({
      where: { id },
      data: { status }
    });

    // Log the action
    await logAction({
      userId: req.user.id,
      action: 'RULE_STATUS_UPDATED',
      entityType: 'RULE',
      entityId: id,
      details: { status },
    });

    // If active, sync all active rules to the file
    const allRules = await prisma.rule.findMany();
    await naxsiService.updateRulesFile(allRules);

    res.json(rule);
  } catch (error) {
    console.error('Update rule status error:', error);
    res.status(500).json({ message: 'Failed to update rule status' });
  }
};

/**
 * Deploy all active rules and reload the firewall.
 */
const deployRules = async (req, res) => {
  try {
    const activeRules = await prisma.rule.findMany({ where: { status: 'active' } });
    await naxsiService.updateRulesFile(activeRules);
    const results = await naxsiService.reloadFirewall();
    
    // Log the action
    await logAction({
      userId: req.user.id,
      action: 'FIREWALL_RELOADED',
      entityType: 'SYSTEM',
      details: { activeRulesCount: activeRules.length, results },
    });

    res.json({ message: 'Firewall reloaded successfully', results });
  } catch (error) {
    console.error('Deploy rules error:', error);
    res.status(500).json({ message: 'Failed to deploy rules and reload' });
  }
};

module.exports = {
  getRules,
  createRuleFromIoc,
  updateRuleStatus,
  deployRules,
};
