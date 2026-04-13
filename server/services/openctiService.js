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
    throw new Error('OpenCTI configuration is missing. Set OPENCTI_URL and OPENCTI_TOKEN in your .env file.');
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
        campaigns(first: 20) {
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
        threatActors(first: 20) {
          edges {
            node {
              id
              name
              confidence
              revoked
            }
          }
        }
        reports(first: 20, orderBy: published, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              report_types
              published
              objectMarking {
                edges {
                  node {
                    definition
                  }
                }
              }
              status {
                name
              }
            }
          }
        }
        stixSightingsRelationships(first: 20) {
          edges {
            node {
              id
              description
              first_seen
              last_seen
              attribute_count
              confidence
              from {
                ... on StixCoreObject {
                  name
                }
              }
              to {
                ... on StixCoreObject {
                  name
                }
              }
            }
          }
        }
        incidents(first: 20) {
          edges {
            node {
              id
              name
              description
              incident_type
              severity
              source
              first_seen
              last_seen
            }
          }
        }
        stixCyberObservables(first: 20) {
          edges {
            node {
              id
              entity_type
              observable_value
            }
          }
        }
        malwares(first: 20) {
          edges {
            node {
               id
               name
               description
               first_seen
               last_seen
            }
          }
        }
        intrusionSets(first: 20) {
          edges {
            node {
              id
              name
              description
              first_seen
              last_seen
            }
          }
        }
        stixCoreRelationships(first: 50) {
          edges {
            node {
              id
              relationship_type
              description
              start_time
              stop_time
              confidence
              from {
                ... on StixCoreObject {
                  id
                  entity_type
                }
              }
              to {
                ... on StixCoreObject {
                  id
                  entity_type
                }
              }
            }
          }
        }
        connectors {
          id
          name
          connector_type
          active
          updated_at
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
        timeout: 20000,
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
      campaigns: (data?.campaigns?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        status: edge.node.status,
        confidence: edge.node.confidence,
      })),
      actors: (data?.threatActors?.edges || [])
        .filter(edge => !edge.node.revoked)
        .map(edge => ({
          id: edge.node.id,
          name: edge.node.name,
          confidence: edge.node.confidence,
        })),
      reports: (data?.reports?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        published: edge.node.published,
        status: edge.node.status?.name,
        marking: edge.node.objectMarking?.edges?.[0]?.node?.definition,
      })),
      sightings: (data?.stixSightingsRelationships?.edges || []).map(edge => ({
        id: edge.node.id,
        description: edge.node.description,
        firstSeen: edge.node.first_seen,
        lastSeen: edge.node.last_seen,
        count: edge.node.attribute_count,
        confidence: edge.node.confidence,
        source: edge.node.from?.name,
        target: edge.node.to?.name,
      })),
      incidents: (data?.incidents?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        type: edge.node.incident_type,
        severity: edge.node.severity,
        firstSeen: edge.node.first_seen,
        lastSeen: edge.node.last_seen,
      })),
      observables: (data?.stixCyberObservables?.edges || []).map(edge => ({
        id: edge.node.id,
        type: edge.node.entity_type,
        value: edge.node.observable_value,
      })),
      malware: (data?.malwares?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        firstSeen: edge.node.first_seen,
        lastSeen: edge.node.last_seen,
      })),
      intrusionSets: (data?.intrusionSets?.edges || []).map(edge => ({
        id: edge.node.id,
        name: edge.node.name,
        description: edge.node.description,
        firstSeen: edge.node.first_seen,
        lastSeen: edge.node.last_seen,
      })),
      relationships: (data?.stixCoreRelationships?.edges || []).map(edge => ({
        id: edge.node.id,
        type: edge.node.relationship_type,
        description: edge.node.description,
        sourceId: edge.node.from?.id,
        sourceType: edge.node.from?.entity_type,
        targetId: edge.node.to?.id,
        targetType: edge.node.to?.entity_type,
        confidence: edge.node.confidence,
      })),
      connectors: (data?.connectors || []).map(c => ({
        id: c.id,
        name: c.name,
        type: c.connector_type,
        status: c.active ? 'active' : 'inactive',
        updatedAt: c.updated_at,
      })),
    };

  } catch (error) {
    console.error('[OpenCTI] Fetch error:', error.message);
    return { 
      indicators: [], campaigns: [], actors: [], reports: [], 
      sightings: [], incidents: [], observables: [], malware: [],
      intrusionSets: [], relationships: [], connectors: [] 
    };
  }
};

/**
 * Test the connection to OpenCTI and verify credentials.
 */
const testConnection = async () => {
  if (!isConfigured) {
    return { 
      success: false, 
      message: 'OpenCTI is not configured. URL or Token missing in .env' 
    };
  }

  try {
    const query = `query { about { version } }`;
    const response = await axios.post(
      OPENCTI_URL,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCTI_TOKEN}`,
        },
        timeout: 5000,
      }
    );

    if (response.data?.errors) {
       return { 
         success: false, 
         message: response.data.errors[0]?.message || 'Authentication failed' 
       };
    }

    return { 
      success: true, 
      version: response.data?.data?.about?.version 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.status === 403 ? 'Invalid Token' : error.message 
    };
  }
};

module.exports = {
  fetchAllIntel,
  testConnection,
  isConfigured,
};
