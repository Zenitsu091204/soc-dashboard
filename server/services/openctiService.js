const axios = require('axios');

const OPENCTI_URL = process.env.OPENCTI_URL || 'http://localhost:8080/graphql';
const OPENCTI_TOKEN = process.env.OPENCTI_TOKEN;
const MOCK_OPENCTI = process.env.MOCK_OPENCTI === 'true' || !OPENCTI_TOKEN;


/**
 * Fetch detailed threat intelligence from OpenCTI.
 */
const fetchAllIntel = async () => {
  if (MOCK_OPENCTI) {
    return { 
      indicators: [
        {
          id: 'mock-ioc-1',
          name: 'SELECT * FROM users',
          type: 'stix-pattern',
          description: 'Probable SQL Injection attempt detected in query parameter.',
          pattern: "[url:value MATCHES '.*select.*from.*']",
          confidence: 85
        },
        {
          id: 'mock-ioc-2',
          name: '<script>alert(1)</script>',
          type: 'stix-pattern',
          description: 'Cross-Site Scripting (XSS) payload identified in request body.',
          pattern: "[body:value MATCHES '.*<script>.*']",
          confidence: 95
        },
        {
          id: 'mock-ioc-3',
          name: '/etc/passwd',
          type: 'stix-pattern',
          description: 'Directory Traversal attempt to access system files.',
          pattern: "[url:value MATCHES '.*/etc/passwd.*']",
          confidence: 75
        },
        {
          id: 'mock-ioc-4',
          name: 'rm -rf /',
          type: 'stix-pattern',
          description: 'Remote Code Execution (RCE) command detected.',
          pattern: "[body:value MATCHES '.*rm -rf.*']",
          confidence: 92
        }
      ], 
      campaigns: [
        {
          id: 'mock-campaign-1',
          name: 'Operation Mock Shield',
          description: 'A mock campaign for testing rule generation.',
          status: 'Active',
          confidence: 80
        }
      ], 
      actors: [
        {
          id: 'mock-actor-1',
          name: 'LulzSec Mock',
          confidence: 70
        }
      ] 
    };
  }

  try {
    const query = `
      query {
        indicators(first: 50, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              indicator_types
              pattern
              confidence
              revoked
            }
          }
        }
        stixCampaigns(first: 20) {
          edges {
            node {
              id
              name
              description
              confidence
              status
            }
          }
        }
        stixThreatActors(first: 20) {
          edges {
            node {
              id
              name
              confidence
              revoked
            }
          }
        }
      }
    `;

    const response = await axios.post(
      OPENCTI_URL,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCTI_TOKEN}`,
        },
        timeout: 15000,
      }
    );

    const data = response.data?.data;
    
    return {
      indicators: (data?.indicators?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        type: edge.node.indicator_types?.[0] || 'Unknown',
        pattern: edge.node.pattern,
        confidence: edge.node.confidence || 0,
        description: edge.node.description,
      })),
      campaigns: (data?.stixCampaigns?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        status: edge.node.status,
        confidence: edge.node.confidence,
      })),
      actors: (data?.stixThreatActors?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        confidence: edge.node.confidence,
      })),
    };

  } catch (error) {
    console.error('OpenCTI fetch error:', error.message);
    return { indicators: [], campaigns: [], actors: [] };
  }
};

module.exports = {
  fetchAllIntel,
};
