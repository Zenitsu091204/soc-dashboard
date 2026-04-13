/**
 * test-opencti.js — Manual verification of OpenCTI API connectivity.
 * This bypasses the API routing to test the service logic directly.
 */
require('dotenv').config();
const openctiService = require('../services/openctiService');

async function test() {
  console.log('🔍 Testing OpenCTI Connection...');
  console.log(`📡 URL: ${process.env.OPENCTI_URL || 'Not set'}`);
  console.log(`🔑 Token: ${process.env.OPENCTI_TOKEN ? '****' + process.env.OPENCTI_TOKEN.slice(-4) : 'Not set'}`);

  const result = await openctiService.testConnection();
  
  if (result.success) {
    console.log('\n✅ CONNECTION SUCCESSFUL!');
    console.log(`📦 OpenCTI Version: ${result.version}`);
  } else {
    console.log('\n❌ CONNECTION FAILED');
    console.log(`📝 Error: ${result.message}`);
    
    if (result.message.includes('not configured')) {
      console.log('\n💡 Tip: Provide your OPENCTI_URL and OPENCTI_TOKEN in server/.env');
    }
  }
}

test().catch(err => console.error('Unexpected error:', err));
