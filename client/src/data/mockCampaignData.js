
export const campaignStats = {
  totalCampaigns: 12,
  activeCampaigns: 4,
  severityDistribution: [
    { name: 'Critical', value: 2, color: '#EF4444' }, // red-500
    { name: 'High', value: 5, color: '#F97316' },     // orange-500
    { name: 'Medium', value: 3, color: '#EAB308' },   // yellow-500
    { name: 'Low', value: 2, color: '#3B82F6' },      // blue-500
  ],
  trendData: [
    { date: 'Mon', campaigns: 2 },
    { date: 'Tue', campaigns: 3 },
    { date: 'Wed', campaigns: 2 },
    { date: 'Thu', campaigns: 5 },
    { date: 'Fri', campaigns: 4 },
    { date: 'Sat', campaigns: 6 },
    { date: 'Sun', campaigns: 4 },
  ],
  mitreTechniques: [
    { name: 'Phishing', value: 85 },
    { name: 'Command & Control', value: 65 },
    { name: 'Lateral Movement', value: 45 },
    { name: 'Data Exfiltration', value: 30 },
    { name: 'Privilege Escalation', value: 20 },
  ]
};

export const campaignTimeline = [
  {
    id: 1,
    title: 'Operation Nightfall',
    date: '2025-02-18',
    status: 'Active',
    severity: 'Critical',
    description: 'Coordinated phishing campaign targeting finance department credentials.',
    actor: 'APT-29',
    indicators: 15,
  },
  {
    id: 2,
    title: 'SQL Injection Wave',
    date: '2025-02-15',
    status: 'Investigating',
    severity: 'High',
    description: 'Automated SQLi attempts against public-facing web portals.',
    actor: 'Unknown',
    indicators: 42,
  },
  {
    id: 3,
    title: 'Ransomware Precursor',
    date: '2025-02-10',
    status: 'Contained',
    severity: 'Medium',
    description: 'Cobalt Strike beacon detected on workstation hr-04.',
    actor: 'Fin7',
    indicators: 8,
  },
  {
    id: 4,
    title: 'Log4j Scans',
    date: '2025-02-01',
    status: 'Resolved',
    severity: 'Low',
    description: 'Routine scanning activity for Log4j vulnerabilities.',
    actor: 'Botnet',
    indicators: 120,
  },
   {
    id: 5,
    title: 'Data Exfiltration Attempt',
    date: '2025-01-28',
    status: 'Resolved',
    severity: 'High',
    description: 'Large outbound data transfer to suspicious IP detected.',
    actor: 'Lazarus',
    indicators: 5,
  },
];
