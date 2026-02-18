const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  await prisma.user.upsert({
    where: { email: 'admin@soc.com' },
    update: {},
    create: {
      email: 'admin@soc.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'analyst@soc.com' },
    update: {},
    create: {
      email: 'analyst@soc.com',
      name: 'SOC Analyst',
      password: hashedPassword,
      role: 'analyst',
    },
  });

  console.log('✅ Users created');

  // 2. Create Threat Actors
  await prisma.threatActor.createMany({
    data: [
      { name: 'APT-28', type: 'State-sponsored', origin: 'Russia', description: 'Fancy Bear - Target: Gov/Military' },
      { name: 'Lazarus Group', type: 'State-sponsored', origin: 'North Korea', description: 'Financial & Crypto theft' },
      { name: 'OilRig', type: 'State-sponsored', origin: 'Iran', description: 'Middle East targeting' },
      { name: 'Carbanak', type: 'Cybercrime', origin: 'Unknown', description: 'Banking malware gang' },
      { name: 'Silence', type: 'Cybercrime', origin: 'Eastern Europe', description: 'Financial institution targeting' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Threat Actors created');

  // 3. Create IOCs
  await prisma.ioc.createMany({
    data: [
      { type: 'ip', value: '185.10.10.10', reputation: 90 },
      { type: 'domain', value: 'malicious-site.com', reputation: 85 },
      { type: 'hash', value: 'a1b2c3d4e5f67890abcdef1234567890', reputation: 95 },
      { type: 'ip', value: '45.33.22.11', reputation: 75 },
      { type: 'domain', value: 'phishing-login.net', reputation: 88 },
      { type: 'hash', value: 'e3b0c44298fc1c149afbf4c8996fb924', reputation: 20 },
    ],
    skipDuplicates: true,
  });

  console.log('✅ IOCs created');

  // 4. Generate 50+ Mock Alerts
  const alertTypes = [
    { title: 'Suspicious PowerShell Execution', severity: 'critical', source: 'EDR' },
    { title: 'Brute Force Attempt', severity: 'high', source: 'Firewall' },
    { title: 'Malware Callback', severity: 'medium', source: 'NDR' },
    { title: 'Impossible Travel', severity: 'high', source: 'IAM' },
    { title: 'SQL Injection Attempt', severity: 'critical', source: 'WAF' },
    { title: 'Port Scan Detected', severity: 'low', source: 'Firewall' },
    { title: 'Privilege Escalation', severity: 'critical', source: 'EDR' },
    { title: 'Data Exfiltration', severity: 'high', source: 'DLP' },
    { title: 'New Admin User Created', severity: 'medium', source: 'IAM' },
    { title: 'Phishing Email Detected', severity: 'medium', source: 'Email Gateway' },
  ];

  const entities = ['workstation-01', 'web-server-01', 'finance-pc', 'hr-laptop', 'db-server-02', 'admin-pc', 'fileserver-01'];
  const statuses = ['new', 'investigating', 'resolved', 'false-positive'];

  const alerts = [];
  
  // Create 50 alerts
  for (let i = 0; i < 50; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    
    // Random time within last 7 days
    const timeAgo = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const timestamp = new Date(Date.now() - timeAgo);

    alerts.push({
      title: type.title,
      severity: type.severity,
      status: status,
      source: type.source,
      description: `${type.title} detected on ${entity}. Investigation required.`,
      entity: entity,
      sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      destIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
      timestamp: timestamp,
    });
  }

  // Add a few "live" alerts (last 5 minutes)
  for (let i = 0; i < 5; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    alerts.push({
      title: type.title,
      severity: 'critical',
      status: 'new',
      source: type.source,
      description: `LIVE: ${type.title} detected just now!`,
      entity: entities[Math.floor(Math.random() * entities.length)],
      sourceIp: `203.0.113.${Math.floor(Math.random() * 255)}`,
      destIp: `172.16.0.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date(),
    });
  }

  await prisma.alert.createMany({
    data: alerts,
    skipDuplicates: true,
  });

  console.log(`✅ ${alerts.length} Alerts created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
