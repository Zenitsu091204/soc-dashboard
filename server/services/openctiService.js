const axios = require('axios');

const OPENCTI_URL = process.env.OPENCTI_URL || 'http://localhost:8080/graphql';
const OPENCTI_TOKEN = process.env.OPENCTI_TOKEN;
const MOCK_OPENCTI = process.env.MOCK_OPENCTI === 'true' || !OPENCTI_TOKEN;


/**
 * Fetch correlation matches from OpenCTI.
 * In a real scenario, this would execute a GraphQL query to fetch Stix-Cyber-Observable
 * or Indicator relationships with Threat Actors.
 */
const fetchOpenCtiMatches = async () => {
  if (MOCK_OPENCTI) {
    // OpenCTI not configured — return empty until real instance is connected
    return [];
  }

  try {
    // Example GraphQL Query to fetch Threat Actors and some relationships
    // This is a simplified query; adjust based on actual OpenCTI data model needed.
    const query = `
      query {
        stixThreatActors {
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
        timeout: 10000,
      }
    );

    // Transform OpenCTI raw GraphQL response into the format our Dashboard expects
    const rawData = response.data?.data?.stixThreatActors?.edges || [];
    
    return rawData.map(edge => ({
      id: edge.node.id,
      actor: edge.node.name,
      type: 'Threat Actor', // Ideally mapped from OpenCTI relationships
      value: 'N/A', // Link to specific indicator if queried
      confidence: edge.node.confidence || 50,
      risk: edge.node.confidence > 80 ? 'Critical' : edge.node.confidence > 50 ? 'High' : 'Medium',
    }));

  } catch (error) {
    console.error('OpenCTI fetch error:', error.message);
    // Return empty — do not fall back to mock data
    return [];
  }
};

module.exports = {
  fetchOpenCtiMatches,
};
