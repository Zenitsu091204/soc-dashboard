const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hoursAgo(h) {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randIp(prefix) {
  return `${prefix}.${Math.floor(Math.random() * 254) + 1}`;
}

// ─── Data Pools ───────────────────────────────────────────────────────────────
const ALERT_TYPES = [
  // critical
  { title: 'Suspicious PowerShell Execution', severity: 'critical', source: 'EDR' },
  { title: 'Privilege Escalation Detected',    severity: 'critical', source: 'EDR' },
  { title: 'SQL Injection Attempt',            severity: 'critical', source: 'WAF' },
  { title: 'Ransomware Activity Detected',     severity: 'critical', source: 'EDR' },
  { title: 'Credential Dumping (LSASS)',        severity: 'critical', source: 'EDR' },
  // high
  { title: 'Brute Force Attempt',              severity: 'high', source: 'Firewall' },
  { title: 'Impossible Travel Login',          severity: 'high', source: 'IAM' },
  { title: 'Data Exfiltration Detected',       severity: 'high', source: 'DLP' },
  { title: 'Lateral Movement via SMB',         severity: 'high', source: 'NDR' },
  { title: 'Malware C2 Callback',              severity: 'high', source: 'NDR' },
  // medium
  { title: 'Phishing Email Detected',          severity: 'medium', source: 'Email Gateway' },
  { title: 'New Admin Account Created',        severity: 'medium', source: 'IAM' },
  { title: 'Anomalous DNS Query',              severity: 'medium', source: 'NDR' },
  { title: 'Failed MFA Attempts',              severity: 'medium', source: 'IAM' },
  { title: 'Suspicious Outbound Traffic',      severity: 'medium', source: 'Firewall' },
  // low
  { title: 'Port Scan Detected',               severity: 'low', source: 'Firewall' },
  { title: 'SSL Certificate Mismatch',         severity: 'low', source: 'WAF' },
  { title: 'Old TLS Version Detected',         severity: 'low', source: 'Firewall' },
  { title: 'Service Account Login After Hours',severity: 'low', source: 'IAM' },
];

const ENTITIES = [
  'web-server-01', 'db-server-02', 'admin-pc', 'finance-pc',
  'hr-laptop', 'workstation-01', 'fileserver-01', 'mail-server-01',
  'vpn-gateway', 'dev-workstation-03',
];

const STATUSES = ['open', 'investigating', 'resolved'];

async function main() {
  console.log('🌱 Starting database seeding...');

  // ── 1. Users ──────────────────────────────────────────────────────────────
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('password123', salt);

  await prisma.user.upsert({
    where: { email: 'admin@soc.com' },
    update: {},
    create: { email: 'admin@soc.com', name: 'Admin User', password: hashed, role: 'admin' },
  });
  await prisma.user.upsert({
    where: { email: 'analyst@soc.com' },
    update: {},
    create: { email: 'analyst@soc.com', name: 'SOC Analyst', password: hashed, role: 'analyst' },
  });
  console.log('✅ Users ready');

  // ── 2. Threat Actors ─────────────────────────────────────────────────────
  await prisma.threatActor.createMany({
    skipDuplicates: true,
    data: [
      { name: 'APT-28',        type: 'State-sponsored', origin: 'Russia',         description: 'Fancy Bear — Gov & Military targeting' },
      { name: 'APT-41',        type: 'State-sponsored', origin: 'China',          description: 'Dual espionage & financial crime' },
      { name: 'Lazarus Group', type: 'State-sponsored', origin: 'North Korea',    description: 'Financial theft & crypto attacks' },
      { name: 'OilRig',        type: 'State-sponsored', origin: 'Iran',           description: 'Middle East infrastructure targeting' },
      { name: 'Carbanak',      type: 'Cybercrime',      origin: 'Unknown',        description: 'Banking malware & PoS attacks' },
      { name: 'Silence',       type: 'Cybercrime',      origin: 'Eastern Europe', description: 'Financial institution targeting' },
      { name: 'FIN7',          type: 'Cybercrime',      origin: 'Unknown',        description: 'Retail & hospitality sector attacks' },
    ],
  });
  console.log('✅ Threat Actors ready');

  // ── 3. IOCs ───────────────────────────────────────────────────────────────
  await prisma.ioc.createMany({
    skipDuplicates: true,
    data: [
      { type: 'ip',     value: '185.10.10.10',                    confidence: 95 },
      { type: 'ip',     value: '45.33.22.11',                     confidence: 82 },
      { type: 'ip',     value: '203.0.113.77',                    confidence: 90 },
      { type: 'ip',     value: '91.108.4.251',                    confidence: 88 },
      { type: 'domain', value: 'malicious-payload.ru',            confidence: 97 },
      { type: 'domain', value: 'phishing-login.net',              confidence: 91 },
      { type: 'domain', value: 'exfil-dropzone.xyz',              confidence: 89 },
      { type: 'domain', value: 'c2-beacon-host.io',               confidence: 94 },
      { type: 'hash',   value: 'a1b2c3d4e5f67890abcdef1234567890', confidence: 98 },
      { type: 'hash',   value: 'e3b0c44298fc1c149afbf4c8996fb924', confidence: 25 },
      { type: 'hash',   value: 'd41d8cd98f00b204e9800998ecf8427e', confidence: 30 },
      { type: 'url',    value: 'http://malicious-payload.ru/drop', confidence: 93 },
    ],
  });
  console.log('✅ IOCs ready');

  // ── 4. Alerts — spread realistically across last 5 days ──────────────────
  //  Severity distribution target: ~30% critical, 25% high, 30% medium, 15% low
  const severityWeights = [
    ...Array(30).fill('critical'),
    ...Array(25).fill('high'),
    ...Array(30).fill('medium'),
    ...Array(15).fill('low'),
  ];

  const alertsToInsert = [];

  // 120 historical alerts, spread over hours 1–120 (5 days)
  for (let h = 1; h <= 120; h++) {
    // 1-3 alerts per hour to create a realistic wave pattern
    const count = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < count; j++) {
      const targetSeverity = pick(severityWeights);
      const pool = ALERT_TYPES.filter((a) => a.severity === targetSeverity);
      const type = pick(pool.length > 0 ? pool : ALERT_TYPES);
      const entity = pick(ENTITIES);
      // Vary the minute offset within the hour
      const minuteOffset = Math.floor(Math.random() * 55);
      const timestamp = new Date(Date.now() - h * 60 * 60 * 1000 - minuteOffset * 60 * 1000);

      alertsToInsert.push({
        title: type.title,
        severity: type.severity,
        status: pick(STATUSES),
        source: type.source,
        description: `${type.title} detected on ${entity}. Automated investigation triggered.`,
        entity,
        sourceIp: randIp('192.168.10'),
        destIp: randIp('10.0.0'),
        timestamp,
      });
    }
  }

  // 8 "live" alerts in the last 15 minutes — these show as NEW in the feed
  const liveTypes = ALERT_TYPES.filter((a) => a.severity === 'critical' || a.severity === 'high');
  for (let i = 0; i < 8; i++) {
    const type = pick(liveTypes);
    const entity = pick(ENTITIES);
    alertsToInsert.push({
      title: type.title,
      severity: type.severity,
      status: 'open',
      source: type.source,
      description: `LIVE: ${type.title} detected on ${entity}. Immediate response required!`,
      entity,
      sourceIp: randIp('203.0.113'),
      destIp: randIp('172.16.0'),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 15) * 60 * 1000),
    });
  }

  await prisma.alert.createMany({ data: alertsToInsert, skipDuplicates: true });
  console.log(`✅ ${alertsToInsert.length} Alerts created`);

  // ── 5. Cases ──────────────────────────────────────────────────────────────
  const casePriorities = ['critical', 'high', 'medium', 'low'];
  const caseStatuses   = ['open', 'open', 'investigating', 'resolved']; // weight toward open

  await prisma.case.createMany({
    skipDuplicates: true,
    data: [
      { title: 'APT-28 Intrusion Campaign',       priority: 'critical', status: 'investigating', description: 'Suspected APT-28 lateral movement across finance segment.' },
      { title: 'Ransomware Containment',           priority: 'critical', status: 'open',          description: 'Ransomware detected on fileserver-01. Isolation in progress.' },
      { title: 'Phishing Campaign Response',       priority: 'high',     status: 'investigating', description: 'Multiple users targeted by credential harvesting campaign.' },
      { title: 'Insider Threat Investigation',     priority: 'high',     status: 'open',          description: 'Anomalous data access by hr-laptop user outside business hours.' },
      { title: 'C2 Beacon Remediation',            priority: 'high',     status: 'open',          description: 'C2 callback to malicious-payload.ru from web-server-01.' },
      { title: 'Brute Force Response',             priority: 'medium',   status: 'resolved',      description: 'Brute force on VPN-gateway successfully blocked.' },
      { title: 'WAF Rule Tuning',                  priority: 'medium',   status: 'resolved',      description: 'SQL injection attempts triggering false positives on WAF.' },
      { title: 'SSL Certificate Audit',            priority: 'low',      status: 'open',          description: 'Expired certificates detected on 3 internal endpoints.' },
      { title: 'Service Account Review',           priority: 'low',      status: 'investigating', description: 'Service accounts with stale passwords identified.' },
      { title: 'DNS Exfiltration Analysis',        priority: 'high',     status: 'open',          description: 'Anomalous DNS query volume from dev-workstation-03.' },
    ],
  });
  console.log('✅ Cases ready');

  console.log('\n🎉 Seeding complete!');
  console.log('   Login: admin@soc.com / password123');
  console.log('   Login: analyst@soc.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
