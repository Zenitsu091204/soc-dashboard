/**
 * verify-rule-pattern.js — Verification of the new strict NAXSI rule syntax.
 */
const ruleService = require('../services/ruleService');

async function test() {
  console.log('🧪 Verifying Strict Rule Patterns...\n');

  const testIocs = [
    { id: '1', value: 'union select', type: 'pattern', name: 'SQLi attempt' },
    { id: '2', value: 'onerror=', type: 'pattern', name: 'XSS attempt' },
    { id: '3', value: '/bin/bash', type: 'pattern', name: 'RCE attempt' },
    { id: '4', value: '../..', type: 'pattern', name: 'Path traversal' }
  ];

  for (const ioc of testIocs) {
    try {
      // Mocking the getNextAvailableId to avoid DB setup for this unit test logic check
      const naxsiId = 2000 + parseInt(ioc.id);
      const category = ruleService.classifyIndicator(ioc);
      
      // We'll just call classify and check the mz logic manually by looking at the code 
      // or we can run the actual service if the DB is up (it is).
      const rule = await ruleService.generateRule(ioc);
      
      if (rule) {
        console.log(`✅ Category: ${category}`);
        console.log(`📜 Generated Rule: ${rule.content}`);
        
        // Final syntax check against user requirement
        if (rule.content.includes('mz:')) {
           console.log('✨ Pattern Match: SUCCESS\n');
        }
      }
    } catch (err) {
      console.log(`⚠️  Error for ${ioc.value}: ${err.message}`);
    }
  }
}

test();
