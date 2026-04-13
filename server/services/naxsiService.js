const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const prisma = require('../utils/prisma');
const execPromise = util.promisify(exec);

const NAXSI_RULES_PATH = process.env.NAXSI_RULES_PATH || path.join(__dirname, '../../config/naxsi_rules.conf');
const NAXSI_BACKUP_PATH = NAXSI_RULES_PATH + '.bak';
const RELOAD_COMMAND = process.env.FIREWALL_RELOAD_CMD || 'nginx -s reload';

const CORE_RULES_HEADER = `########################################
# NAXSI CORE RULES (Internal & Libinjection)
########################################
MainRule "msg:weird request" id:1;
MainRule "msg:invalid hex" id:10;
MainRule "msg:invalid POST" id:13;

# Libinjection for SQLi/XSS (applied to all relevant zones)
MainRule "msg:libinjection_sql" "mz:BODY|URL|ARGS|$HEADERS_VAR:Cookie" "s:$SQL:8" id:17;
MainRule "msg:libinjection_xss" "mz:BODY|URL|ARGS|$HEADERS_VAR:Cookie" "s:$XSS:8" id:18;
`;

/**
 * Update the NAXSI configuration file with active rules, including core rules.
 */
const updateRulesFile = async (rules) => {
  try {
    if (process.env.SIMULATE_FIREWALL === 'true' || process.env.NODE_ENV === 'development') {
      console.log(`[SIMULATION] Skipping rule write to ${NAXSI_RULES_PATH}`);
      return;
    }

    // 1. Create backup
    try {
      await fs.copyFile(NAXSI_RULES_PATH, NAXSI_BACKUP_PATH);
    } catch (e) { /* ignore */ }

    // 2. Ensure directory
    await fs.mkdir(path.dirname(NAXSI_RULES_PATH), { recursive: true });

    // 3. Prepare content
    const activeRules = rules.filter(r => r.status === 'active');
    
    // Group rules by category for better readability in the file
    let content = CORE_RULES_HEADER + '\n';
    content += `########################################\n# CUSTOM & OPENCTI GENERATED RULES\n########################################\n`;
    content += activeRules.map(r => r.content).join('\n');

    // 4. Write config
    await fs.writeFile(NAXSI_RULES_PATH, content, 'utf8');
    console.log(`Successfully updated NAXSI rules file at ${NAXSI_RULES_PATH}`);
  } catch (error) {
    console.error('Error updating NAXSI rules file:', error.message);
    throw error;
  }
};

/**
 * Generates the plaintext configuration for the UI Export Console.
 */
const generateExportContent = async (activeRules) => {
  let content = CORE_RULES_HEADER + '\n';
  
  const categories = [
    { title: 'SQL & NoSQL INJECTION', min: 1000, max: 2107 },
    { title: 'XSS & PAYLOADS', min: 1300, max: 2205 },
    { title: 'RCE & SSTI', min: 2300, max: 2304 },
    { title: 'TRAVERSAL & EVASION', min: 1200, max: 2402 },
    { title: 'CUSTOM RULES', min: 20000, max: 29999 }
  ];

  categories.forEach(cat => {
    const subset = activeRules.filter(r => r.naxsiId >= cat.min && r.naxsiId <= cat.max);
    if (subset.length > 0) {
      content += `########################################\n# ${cat.title} (IDs: ${cat.min}-${cat.max})\n########################################\n`;
      content += subset.map(r => r.content).join('\n') + '\n\n';
    }
  });

  return content;
};

/**
 * Restore from backup in case of deployment failure.
 */
const rollbackRules = async () => {
  try {
    await fs.copyFile(NAXSI_BACKUP_PATH, NAXSI_RULES_PATH);
    console.log('Successfully rolled back NAXSI config.');
  } catch (error) {
    console.error('CRITICAL: Rollback failed:', error.message);
  }
};

/**
 * Reload the firewall.
 */
const reloadFirewall = async (retries = 3) => {
  try {
    if (process.env.NODE_ENV === 'development' && !process.env.FORCE_RELOAD) {
      return { stdout: 'Mock reload successful', stderr: '' };
    }
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await execPromise(RELOAD_COMMAND);
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, 1000));
      }
    }
    throw lastError;
  } catch (error) {
    console.error('Error reloading firewall:', error.message);
    await rollbackRules();
    throw error;
  }
};

module.exports = {
  updateRulesFile,
  generateExportContent,
  reloadFirewall,
  rollbackRules,
};
