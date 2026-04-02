const prisma = require('../utils/prisma');

const BASE_RULE_ID = 100000;

/**
 * Generate a NAXSI rule from an IOC.
 */
const generateRule = async (ioc) => {
  // 1. Duplicate Detection - Check if a rule for this indicator already exists
  const existingRule = await prisma.rule.findFirst({
    where: { 
      indicatorId: ioc.id,
      status: { in: ['pending', 'active'] } 
    }
  });

  if (existingRule) {
    console.log(`[RULE-SERVICE] Duplicate rule avoided for IOC: ${ioc.value}`);
    return null; // Signal that no new rule is needed
  }

  const existingRulesCount = await prisma.rule.count();
  const ruleId = BASE_RULE_ID + existingRulesCount + 1;

  let content = '';
  let type = 'NAXSI_MAIN';

  if (ioc.type === 'ip') {
    content = `MainRule "str:${ioc.value}" "msg:OpenCTI Blocked IP" "mz:IP" "s:$BLOCK:1" id:${ruleId};`;
  } else if (ioc.type === 'domain') {
    content = `MainRule "str:${ioc.value}" "msg:OpenCTI Blocked Domain" "mz:HEADERS:Host" "s:$BLOCK:1" id:${ruleId};`;
  } else if (ioc.type === 'hash') {
    content = `MainRule "str:${ioc.value}" "msg:OpenCTI Blocked Hash" "mz:BODY|URL" "s:$BLOCK:1" id:${ruleId};`;
  } else {
    throw new Error(`Unsupported IOC type for rule generation: ${ioc.type}`);
  }

  return {
    indicatorId: ioc.id,
    type,
    content,
    source: 'OpenCTI',
    status: 'pending',
  };
};

module.exports = {
  generateRule,
};
