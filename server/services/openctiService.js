const axios = require('axios');

const OPENCTI_URL = process.env.OPENCTI_URL;
const OPENCTI_TOKEN = process.env.OPENCTI_TOKEN;

// Guard: require explicit configuration in production
const isConfigured = OPENCTI_URL && OPENCTI_TOKEN && OPENCTI_TOKEN !== 'your_opencti_token_here';

/**
 * Fetch detailed threat intelligence from OpenCTI.
 * Returns empty arrays if OpenCTI is not configured — no mock data injected.
 */
const fetchAllIntel = async () => {
  if (!isConfigured) {
    console.log('[OpenCTI] Not configured — skipping sync. Set OPENCTI_URL and OPENCTI_TOKEN in .env to enable.');
    return { indicators: [], campaigns: [], actors: [] };
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
      indicators: (data?.indicators?.edges || [])
        .filter(edge => !edge.node.revoked)
        .map(edge => ({
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
      actors: (data?.stixThreatActors?.edges || [])
        .filter(edge => !edge.node.revoked)
        .map(edge => ({
          id: edge.node.id,
          name: edge.node.name,
          confidence: edge.node.confidence,
        })),
    };

  } catch (error) {
    console.error('[OpenCTI] Fetch error:', error.message);
    // Return empty — do not inject mock data into production
    return { indicators: [], campaigns: [], actors: [] };
  }
};

module.exports = {
  fetchAllIntel,
  isConfigured,
};
