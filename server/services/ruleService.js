const prisma = require('../utils/prisma');

/**
 * NAXSI Rule Category Ranges
 */
const CATEGORY_RANGES = {
  SQL_INJECTION: { min: 1000, max: 2107, score: '$SQL' },
  TRAVERSAL: { min: 1200, max: 2402, score: '$TRAVERSAL' },
  XSS: { min: 1300, max: 2205, score: '$XSS' },
  RCE: { min: 2300, max: 2304, score: '$RCE' },
  WHITELIST: { min: 10000, max: 19999, score: null },
  CUSTOM: { min: 20000, max: 29999, score: '$CUSTOM' },
  EVADE: { min: 20000, max: 29999, score: '$EVADE' }, // Mapping Evasion to Custom range as per plan
};

/**
 * Classify an indicator based on its name, description, or pattern.
 */
const classifyIndicator = (indicator) => {
  const text = `${indicator.name} ${indicator.description || ''} ${indicator.pattern || ''}`.toLowerCase();
  
  if (text.includes('sql') || text.includes('injection') || text.includes('select') || text.includes('union')) {
    return 'SQL_INJECTION';
  }
  if (text.includes('xss') || text.includes('cross-site') || text.includes('script') || text.includes('alert')) {
    return 'XSS';
  }
  if (text.includes('rce') || text.includes('execute') || text.includes('shell') || text.includes('system') || text.includes('ssti')) {
    return 'RCE';
  }
  if (text.includes('traversal') || text.includes('path') || text.includes('..') || text.includes('/etc/')) {
    return 'TRAVERSAL';
  }
  if (text.includes('evade') || text.includes('encode') || text.includes('obfuscate') || text.includes('bypass')) {
    return 'EVADE';
  }
  
  return 'CUSTOM';
};

/**
 * Find the next available unique rule ID within a category range.
 */
const getNextAvailableId = async (category) => {
  const range = CATEGORY_RANGES[category];
  if (!range) throw new Error(`Invalid category: ${category}`);

  // Find all used IDs in this range
  const usedIds = await prisma.rule.findMany({
    where: {
      naxsiId: {
        gte: range.min,
        lte: range.max
      }
    },
    select: { naxsiId: true },
    orderBy: { naxsiId: 'asc' }
  });

  const usedIdSet = new Set(usedIds.map(r => r.naxsiId));
  
  // Find the first available ID
  for (let id = range.min; id <= range.max; id++) {
    if (!usedIdSet.has(id)) {
      return id;
    }
  }

  throw new Error(`No available IDs left in range for category: ${category}`);
};

/**
 * Validate NAXSI rule syntax.
 */
const validateRuleSyntax = (content) => {
  // Exact syntax: MainRule "str" "msg" "mz" "s:$CATEGORY:8" id;
  const regex = /^MainRule\s+"str:.*"\s+"msg:.*"\s+"mz:.*"\s+"s:\$[A-Z]+:\d+"\s+id:\d+;$/;
  return regex.test(content);
};

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
    return null;
  }

  // 2. Classification
  const category = classifyIndicator(ioc);
  const rangeConfig = CATEGORY_RANGES[category];

  // 3. ID Assignment
  const naxsiId = await getNextAvailableId(category);

  // 4. Template Selection & Content Generation
  // Reuse match zones: ARGS, URL, BODY, $HEADERS_VAR:Cookie based on attack type
  let mz = 'ARGS';
  if (category === 'XSS' || category === 'EVADE') {
    mz = 'ARGS|BODY|$HEADERS_VAR:Cookie';
  } else if (category === 'TRAVERSAL') {
    mz = 'URL';
  } else if (category === 'RCE') {
    mz = 'BODY|ARGS';
  }

  const scoreLabel = rangeConfig.score || '$SQL'; // Fallback
  const msg = `OpenCTI generated ${category.replace('_', ' ')} rule`;
  
  // Exact Syntax: MainRule "str" "msg" "mz" "s:$CATEGORY:8" id;
  const content = `MainRule "str:${ioc.value}" "msg:${msg}" "mz:${mz}" "s:${scoreLabel}:8" id:${naxsiId};`;

  // 5. Validation
  if (!validateRuleSyntax(content)) {
    console.error(`[RULE-SERVICE] Malformed rule generated: ${content}`);
    throw new Error('Generated rule failed syntax validation');
  }

  return {
    indicatorId: ioc.id,
    type: 'NAXSI_MAIN',
    content,
    naxsiId,
    source: 'OpenCTI',
    status: 'pending',
  };
};

module.exports = {
  generateRule,
  classifyIndicator,
  getNextAvailableId,
  validateRuleSyntax,
};
