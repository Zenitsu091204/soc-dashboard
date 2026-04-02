const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const prisma = require('../utils/prisma');
const execPromise = util.promisify(exec);

const NAXSI_RULES_PATH = process.env.NAXSI_RULES_PATH || path.join(__dirname, '../../config/naxsi_rules.conf');
const NAXSI_BACKUP_PATH = NAXSI_RULES_PATH + '.bak';
const RELOAD_COMMAND = process.env.FIREWALL_RELOAD_CMD || 'nginx -s reload';

/**
 * Update the NAXSI configuration file with active rules, with rollback support.
 */
const updateRulesFile = async (rules) => {
  try {
    // 1. Create backup of current file if it exists
    try {
      await fs.copyFile(NAXSI_RULES_PATH, NAXSI_BACKUP_PATH);
    } catch (e) {
      // Ignore if source doesn't exist
    }

    // 2. Ensure the directory exists
    await fs.mkdir(path.dirname(NAXSI_RULES_PATH), { recursive: true });

    const activeRules = rules.filter(r => r.status === 'active');
    const content = activeRules.map(r => r.content).join('\n');

    // 3. Write new config
    await fs.writeFile(NAXSI_RULES_PATH, content, 'utf8');
    console.log(`Successfully updated NAXSI rules file at ${NAXSI_RULES_PATH}`);
  } catch (error) {
    console.error('Error updating NAXSI rules file:', error.message);
    throw error;
  }
};

/**
 * Restore from backup in case of deployment failure.
 */
const rollbackRules = async () => {
  try {
    await fs.copyFile(NAXSI_BACKUP_PATH, NAXSI_RULES_PATH);
    console.log('Successfully rolled back NAXSI config to previous stable state.');
  } catch (error) {
    console.error('CRITICAL: Rollback failed:', error.message);
  }
};

/**
 * Verify that the active rules in the database are present in the config file.
 */
const verifyRuleStatus = async (rules) => {
  try {
    const fileContent = await fs.readFile(NAXSI_RULES_PATH, 'utf8');
    const activeRules = rules.filter(r => r.status === 'active');
    
    for (const rule of activeRules) {
      const isPresent = fileContent.includes(rule.content);
      await prisma.rule.update({
        where: { id: rule.id },
        data: { 
          lastVerified: new Date(),
          verificationStatus: isPresent ? 'success' : 'failed'
        }
      });
    }
  } catch (error) {
    console.error('Verification failed:', error.message);
  }
};

/**
 * Reload the firewall/proxy configuration with retry logic.
 */
const reloadFirewall = async (retries = 3) => {
  try {
    if (process.env.NODE_ENV === 'development' && !process.env.FORCE_RELOAD) {
      console.log(`[MOCK] Executing reload command: ${RELOAD_COMMAND}`);
      return { stdout: 'Mock reload successful', stderr: '' };
    }

    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        const { stdout, stderr } = await execPromise(RELOAD_COMMAND);
        return { stdout, stderr };
      } catch (err) {
        lastError = err;
        console.warn(`Reload attempt ${i + 1} failed, retrying...`);
        await new Promise(res => setTimeout(res, 1000));
      }
    }
    throw lastError;
  } catch (error) {
    console.error('Error reloading firewall after retries:', error.message);
    // If reload fails after retries, trigger rollback
    await rollbackRules();
    throw error;
  }
};

module.exports = {
  updateRulesFile,
  reloadFirewall,
  verifyRuleStatus,
  rollbackRules,
};
