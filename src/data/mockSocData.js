/**
 * Mock SOC dataset.
 * Beginner-friendly: plain arrays + simple helper functions.
 */

export const iocs = [
  {
    id: 'ioc-001',
    type: 'IP',
    value: '185.199.110.153',
    confidence: 85,
    severity: 'high',
    source: 'OSINT',
    tags: ['c2', 'bruteforce'],
    firstSeen: '2026-02-08T12:20:00Z',
    lastSeen: '2026-02-11T19:05:00Z',
  },
  {
    id: 'ioc-002',
    type: 'Domain',
    value: 'update-secure-login.com',
    confidence: 90,
    severity: 'critical',
    source: 'Email Gateway',
    tags: ['phishing'],
    firstSeen: '2026-02-10T08:10:00Z',
    lastSeen: '2026-02-12T06:20:00Z',
  },
  {
    id: 'ioc-003',
    type: 'SHA256',
    value:
      '0b2d4b3f3f7d1a9f9a1a7c6b0f1d7f0f0b2d4b3f3f7d1a9f9a1a7c6b0f1d7f0f',
    confidence: 70,
    severity: 'medium',
    source: 'EDR',
    tags: ['malware', 'dropper'],
    firstSeen: '2026-02-09T21:40:00Z',
    lastSeen: '2026-02-11T09:14:00Z',
  },
  {
    id: 'ioc-004',
    type: 'URL',
    value: 'https://cdn-login-check[.]com/auth/verify',
    confidence: 60,
    severity: 'low',
    source: 'Proxy Logs',
    tags: ['suspicious'],
    firstSeen: '2026-02-06T11:00:00Z',
    lastSeen: '2026-02-07T16:45:00Z',
  },
];

export const threatActors = [
  {
    id: 'ta-001',
    name: 'NORTHSTAR SPIDER',
    region: 'Unknown',
    motive: 'Financial',
    sophistication: 'High',
    lastActivity: '2026-02-11T23:10:00Z',
    knownFor: ['ransomware', 'credential theft'],
  },
  {
    id: 'ta-002',
    name: 'EMBER JACKAL',
    region: 'APAC',
    motive: 'Espionage',
    sophistication: 'Medium',
    lastActivity: '2026-02-09T14:22:00Z',
    knownFor: ['spear phishing', 'lateral movement'],
  },
  {
    id: 'ta-003',
    name: 'SILENT HARBOR',
    region: 'EMEA',
    motive: 'Financial',
    sophistication: 'Low',
    lastActivity: '2026-02-05T10:01:00Z',
    knownFor: ['scams', 'phishing'],
  },
];

export const alerts = [
  {
    id: 'al-001',
    title: 'Multiple failed logins (possible brute force)',
    severity: 'high',
    status: 'open',
    category: 'Brute Force',
    entity: 'vpn-gateway',
    time: '2026-02-12T05:55:00Z',
    mitre: 'T1110',
  },
  {
    id: 'al-002',
    title: 'Suspicious PowerShell execution',
    severity: 'critical',
    status: 'in-progress',
    category: 'Malware',
    entity: 'WIN-ACCT-07',
    time: '2026-02-12T03:12:00Z',
    mitre: 'T1059',
  },
  {
    id: 'al-003',
    title: 'Blocked outbound connection to known phishing domain',
    severity: 'medium',
    status: 'resolved',
    category: 'Phishing',
    entity: 'mail-gateway',
    time: '2026-02-11T19:42:00Z',
    mitre: 'T1566',
  },
  {
    id: 'al-004',
    title: 'User reported marketing email as phishing (false positive)',
    severity: 'low',
    status: 'false-positive',
    category: 'Phishing',
    entity: 'user-laptop-01',
    time: '2026-02-11T10:15:00Z',
    mitre: 'T1566',
  },
];

export function formatUtc(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function matchesText(haystack, query) {
  if (!query) return true;
  return String(haystack).toLowerCase().includes(query.trim().toLowerCase());
}

