const prisma = require('../utils/prisma');

/**
 * NAXSI Rule Category Ranges (Strict Syntax Alignment)
 */
const CATEGORY_RANGES = {
  SQL_INJECTION: { min: 1000, max: 2104, score: '$SQL', mz: 'BODY|URL|ARGS|$HEADERS_VAR:Cookie' },
  NOSQL_INJECTION: { min: 2105, max: 2107, score: '$SQL', mz: 'BODY|ARGS' },
  XSS: { min: 1300, max: 2205, score: '$XSS', mz: 'ARGS|URL|BODY|$HEADERS_VAR:Cookie' },
  RCE: { min: 2300, max: 2304, score: '$RCE', mz: 'BODY|URL|ARGS' },
  TRAVERSAL: { min: 1200, max: 2402, score: '$TRAVERSAL', mz: 'ARGS|URL|BODY' },
  EVADE: { min: 2400, max: 2402, score: '$EVADE', mz: 'ARGS|BODY|URL' },
  WHITELIST: { min: 10000, max: 19999, score: null, mz: 'ARGS|BODY' },
  CUSTOM: { min: 20000, max: 29999, score: '$CUSTOM', mz: 'ARGS' },
};

/**
 * Classify an indicator based on its name, description, or pattern.
 */
const classifyIndicator = (indicator) => {
  const text = `${indicator.name} ${indicator.description || ''} ${indicator.pattern || ''}`.toLowerCase();
  
  if (text.includes('[$]gt') || text.includes('[$]ne') || text.includes('[$]where') || text.includes('nosql') || text.includes('mongodb')) {
    return 'NOSQL_INJECTION';
  }
  if (text.includes('sql') || text.includes('injection') || text.includes('select') || text.includes('union')) {
    return 'SQL_INJECTION';
  }
  if (text.includes('xss') || text.includes('cross-site') || text.includes('script') || text.includes('alert') || text.includes('onerror')) {
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

  const usedIds = await prisma.rule.findMany({
    where: { naxsiId: { gte: range.min, lte: range.max } },
    select: { naxsiId: true },
    orderBy: { naxsiId: 'asc' }
  });

  const usedIdSet = new Set(usedIds.map(r => r.naxsiId));
  for (let id = range.min; id <= range.max; id++) {
    if (!usedIdSet.has(id)) return id;
  }
  throw new Error(`No available IDs left in range for category: ${category}`);
};

/**
 * Validate NAXSI rule syntax.
 */
const validateRuleSyntax = (content) => {
  // Pattern: MainRule "str:VALUE" "msg:MSG" "mz:MZ" "s:$SCORE:8" id:ID;
  const regex = /^MainRule\s+"str:.*"\s+"msg:.*"\s+"mz:.*"\s+"s:\$[A-Z]+:8"\s+id:\d+;$/;
  return regex.test(content);
};

/**
 * Generate a NAXSI rule from an IOC.
 */
const generateRule = async (ioc) => {
  const existingRule = await prisma.rule.findFirst({
    where: { indicatorId: ioc.id, status: { in: ['pending', 'active'] } }
  });
  if (existingRule) return null;

  let contextMsg = '';
  try {
    const relationships = await prisma.openCtiRelationship.findMany({ where: { sourceId: ioc.id } });
    for (const rel of relationships) {
       if (rel.targetType === 'malware' || rel.targetType === 'intrusion-set') {
         const target = await prisma.openCtiMalware.findUnique({ where: { id: rel.targetId } }) 
                     || await prisma.openCtiIntrusionSet.findUnique({ where: { id: rel.targetId } });
         if (target) contextMsg += ` [Related to ${target.name}]`;
       }
    }
  } catch (err) { /* ignore */ }

  const category = classifyIndicator(ioc);
  const config = CATEGORY_RANGES[category];
  const naxsiId = await getNextAvailableId(category);

  const baseLabel = category.replace('_', ' ');
  const msg = `OpenCTI ${baseLabel} detection${contextMsg}`;
  const scoreLabel = config.score || '$SQL';
  
  // Strict alignment with provided pattern
  const content = `MainRule "str:${ioc.value}" "msg:${msg}" "mz:${config.mz}" "s:${scoreLabel}:8" id:${naxsiId};`;

  if (!validateRuleSyntax(content)) {
    throw new Error(`Generated rule failed syntax validation: ${content}`);
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
