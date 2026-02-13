/**
 * Mock SOC data to make the dashboard feel alive
 * Replace with real SIEM/TI feeds later
 */

export const alerts = [
  {
    id: 'a1',
    time: '2026-02-12T10:30:00Z',
    title: 'Suspicious PowerShell execution detected',
    entity: 'DESKTOP-WIN-042',
    severity: 'critical',
    status: 'open',
  },
  {
    id: 'a2',
    time: '2026-02-12T10:15:00Z',
    title: 'Multiple failed login attempts',
    entity: 'WEB-SERVER-01',
    severity: 'high',
    status: 'in-progress',
  },
  {
    id: 'a3',
    time: '2026-02-12T09:45:00Z',
    title: 'Malware hash matched in file scan',
    entity: 'LAPTOP-DEV-08',
    severity: 'critical',
    status: 'open',
  },
  {
    id: 'a4',
    time: '2026-02-12T09:20:00Z',
    title: 'Unusual outbound traffic to known C2',
    entity: 'DESKTOP-WIN-042',
    severity: 'critical',
    status: 'in-progress',
  },
  {
    id: 'a5',
    time: '2026-02-12T08:50:00Z',
    title: 'Privilege escalation attempt',
    entity: 'DB-SERVER-03',
    severity: 'high',
    status: 'resolved',
  },
  {
    id: 'a6',
    time: '2026-02-12T08:30:00Z',
    title: 'Suspicious registry modification',
    entity: 'LAPTOP-HR-12',
    severity: 'medium',
    status: 'open',
  },
  {
    id: 'a7',
    time: '2026-02-12T07:45:00Z',
    title: 'Port scan detected from internal host',
    entity: 'DESKTOP-IT-05',
    severity: 'medium',
    status: 'in-progress',
  },
  {
    id: 'a8',
    time: '2026-02-12T07:10:00Z',
    title: 'Unauthorized USB device connected',
    entity: 'LAPTOP-FIN-03',
    severity: 'low',
    status: 'resolved',
  },
  {
    id: 'a9',
    time: '2026-02-12T06:30:00Z',
    title: 'Suspicious DNS query pattern',
    entity: 'WEB-SERVER-02',
    severity: 'medium',
    status: 'false-positive',
  },
  {
    id: 'a10',
    time: '2026-02-12T05:55:00Z',
    title: 'Brute force attack detected',
    entity: 'SSH-GATEWAY-01',
    severity: 'high',
    status: 'resolved',
  },
  {
    id: 'a11',
    time: '2026-02-12T05:20:00Z',
    title: 'File integrity violation',
    entity: 'APP-SERVER-04',
    severity: 'medium',
    status: 'open',
  },
  {
    id: 'a12',
    time: '2026-02-12T04:45:00Z',
    title: 'Anomalous user behavior detected',
    entity: 'DESKTOP-SALES-07',
    severity: 'low',
    status: 'in-progress',
  },
];

export const iocs = [
  { id: 'i1', type: 'IP', value: '192.0.2.45', source: 'AlienVault', confidence: 'high' },
  { id: 'i2', type: 'Domain', value: 'malicious-site.xyz', source: 'VirusTotal', confidence: 'critical' },
  { id: 'i3', type: 'Hash', value: 'a3f5d8e9c2b1...', source: 'Internal', confidence: 'medium' },
  { id: 'i4', type: 'URL', value: 'http://phishing-page.com/login', source: 'PhishTank', confidence: 'high' },
  { id: 'i5', type: 'IP', value: '198.51.100.23', source: 'Shodan', confidence: 'medium' },
  { id: 'i6', type: 'Hash', value: 'b7c4e1f3a9d2...', source: 'VirusTotal', confidence: 'critical' },
  { id: 'i7', type: 'Domain', value: 'c2-server.net', source: 'ThreatFox', confidence: 'high' },
  { id: 'i8', type: 'IP', value: '203.0.113.67', source: 'AbuseIPDB', confidence: 'low' },
];

export const threatActors = [
  {
    id: 'ta1',
    name: 'APT29',
    sophistication: 'Advanced',
    lastSeen: '2h ago',
    riskLevel: 'Critical',
    targetSectors: ['Government', 'Healthcare'],
  },
  {
    id: 'ta2',
    name: 'Lazarus Group',
    sophistication: 'Advanced',
    lastSeen: '5h ago',
    riskLevel: 'Critical',
    targetSectors: ['Finance', 'Crypto'],
  },
  {
    id: 'ta3',
    name: 'FIN7',
    sophistication: 'Intermediate',
    lastSeen: '1d ago',
    riskLevel: 'High',
    targetSectors: ['Retail', 'Hospitality'],
  },
  {
    id: 'ta4',
    name: 'Carbanak',
    sophistication: 'Advanced',
    lastSeen: '3d ago',
    riskLevel: 'High',
    targetSectors: ['Banking'],
  },
];

export function formatUtc(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function getRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function matchesText(haystack, query) {
  if (!query) return true;
  return String(haystack).toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * Calculate global risk score based on alert severity distribution
 * Returns a score from 0-100
 */
export function calculateRiskScore(alertsList = alerts) {
  if (!alertsList || alertsList.length === 0) return 0;

  const severityWeights = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
  };

  const openAlerts = alertsList.filter(a => a.status === 'open' || a.status === 'in-progress');
  
  const totalWeight = openAlerts.reduce((sum, alert) => {
    return sum + (severityWeights[alert.severity] || 0);
  }, 0);

  // Normalize to 0-100 scale (assuming max ~10 critical alerts = 100%)
  const maxPossibleScore = 250; // 10 critical alerts
  const score = Math.min(100, Math.round((totalWeight / maxPossibleScore) * 100));
  
  return score;
}
