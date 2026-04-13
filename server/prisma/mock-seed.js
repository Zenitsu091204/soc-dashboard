/**
 * mock-seed.js — Development/Mock Data Seed
 * 
 * Populates the database with data extracted from MISP screenshots.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Starting mock data seed (MISP-style)...\n');

  // 1. Integration - MISP Connected
  await prisma.integration.upsert({
    where: { name: 'misp' },
    update: { status: 'Connected' },
    create: { 
      name: 'misp', 
      status: 'Connected', 
      endpoint: 'https://misp.local',
      apiKey: 'MOCK_API_KEY_123'
    },
  });
  console.log('✅ MISP Integration set to Connected');

  // 2. IOCs (Attributes from screenshots)
  const iocData = [
    { 
      type: 'IP', 
      value: '10.0.2.15', 
      confidence: 95, 
      severity: 'high',
      description: 'Internal source of multiple scan incidents' 
    },
    { 
      type: 'URL', 
      value: 'http://10.0.2.15/api/Track/result', 
      confidence: 85, 
      severity: 'medium',
      description: 'API tracking endpoint identified in malware behavior' 
    },
    { 
      type: 'URL', 
      value: 'https://urlscan.io/result/019d76bb-17a4-704c-9889-4a272db4f8ac/', 
      confidence: 70, 
      severity: 'low',
      description: 'External analysis link for 10.0.2.15' 
    },
    { 
      type: 'URL', 
      value: 'https://urlscan.io/screenshots/019d76bb-17a4-704c-9889-4a272db4f8ac.png', 
      confidence: 70, 
      severity: 'low',
      description: 'Automated screenshot of suspected malicious page' 
    },
    {
      type: 'Domain',
      value: '10.0.2.15',
      confidence: 40,
      severity: 'low',
      description: 'Enriched via urlscan module - Domain Attribute #971'
    },
    {
      type: 'IP',
      value: '::ffff:10.0.2.15',
      confidence: 80,
      severity: 'medium',
      description: 'IPv6-mapped IPv4 source of scanning activity (T1595)'
    }
  ];

  const createdIocs = [];
  for (const ioc of iocData) {
    const entry = await prisma.ioc.upsert({
      where: { value: ioc.value },
      update: { confidence: ioc.confidence, severity: ioc.severity },
      create: ioc,
    });
    createdIocs.push(entry);
  }
  console.log(`✅ ${createdIocs.length} IOCs created/updated`);

  // 3. Campaigns (Events from screenshots)
  const campaignData = [
    {
      title: 'BLOCK Incident | Source: 10.0.2.15',
      status: 'Active',
      severity: 'High',
      description: 'WAF Block events triggered by internal host 10.0.2.15. Potential post-exploitation activity. (Event ID: 375)',
      actor: 'WAF Block Tool (Attack Pattern)',
      indicators: 6,
      startDate: new Date('2026-04-10T09:30:00Z'),
    },
    {
      title: 'RECON Incident | Source: 10.0.2.15',
      status: 'Investigating',
      severity: 'Medium',
      description: 'Active scanning detected across internal subnets. Indicators match known reconnaissance patterns. (Event ID: 374)',
      actor: 'Active Scanning (Attack Pattern)',
      indicators: 1,
      startDate: new Date('2026-04-10T08:15:00Z'),
    },
    {
      title: 'BLOCK Incident | Source: 10.0.2.15',
      status: 'Active',
      severity: 'High',
      description: 'Earlier WAF Block events linked to the same source. (Event ID: 373)',
      actor: 'WAF Block Tool (Attack Pattern)',
      indicators: 2,
      startDate: new Date('2026-04-10T08:00:00Z'),
    },
    {
      title: 'RECON Incident | Source: :::ffff:10.0.2.15',
      status: 'Resolved',
      severity: 'Low',
      description: 'Previous reconnaissance incident from IPv6-mapped address. (Event ID: 370)',
      actor: 'Active Scanning (Attack Pattern)',
      indicators: 1,
      startDate: new Date('2026-04-02T10:00:00Z'),
    }
  ];

  for (const campaign of campaignData) {
    await prisma.campaign.create({
      data: campaign
    });
  }
  console.log('✅ Campaigns created');

  // 4. Cases & Alerts (To link everything for the Dashboard)
  const case1 = await prisma.case.create({
    data: {
      title: 'Investigation: BLOCK Incident from 10.0.2.15',
      description: 'Analyzing WAF blocks and associated IOCs from the local MISP instance.',
      status: 'open',
      priority: 'high',
      incidentIocs: {
        create: [
          { ioc: { connect: { id: createdIocs[0].id } } },
          { ioc: { connect: { id: createdIocs[1].id } } }
        ]
      }
    }
  });

  await prisma.alert.create({
    data: {
      title: 'High Volume WAF Blocks',
      severity: 'high',
      status: 'investigating',
      source: 'WAF',
      sourceIp: '10.0.2.15',
      caseId: case1.id,
      entity: 'Internal Host'
    }
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Investigation: Active Scanning from 10.0.2.15',
      description: 'Analyzing scanning behavior (T1595) reported by MISP Event ID 374.',
      status: 'open',
      priority: 'medium',
      incidentIocs: {
        create: [
          { ioc: { connect: { id: createdIocs[0].id } } },
          { ioc: { connect: { id: createdIocs[5].id } } }
        ]
      }
    }
  });

  await prisma.alert.create({
    data: {
      title: 'Reconnaissance Scanning Detected',
      severity: 'medium',
      status: 'new',
      source: 'NIDS',
      sourceIp: '10.0.2.15',
      caseId: case2.id,
      entity: 'Internal Subnet'
    }
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Archived: Early April Scanning Activity',
      description: 'IPv6-mapped IPv4 scanning (Event ID: 370).',
      status: 'resolved',
      resolution: 'Blocked at firewall. No further action needed.',
      priority: 'low',
      incidentIocs: {
        create: [
          { ioc: { connect: { id: createdIocs[5].id } } }
        ]
      }
    }
  });

  await prisma.alert.create({
    data: {
      title: 'IPv6-mapped scanning (T1595)',
      severity: 'low',
      status: 'resolved',
      source: 'Firewall',
      sourceIp: '::ffff:10.0.2.15',
      caseId: case3.id,
      entity: 'Internal Host'
    }
  });

  console.log('✅ Cases and linked Alerts created');

  // 5. Rules
  await prisma.rule.create({
    data: {
      type: 'NAXSI_MAIN',
      content: 'MainRule "str:api/Track/result" "msg:Tracking API Abuse" "mz:URL" "s:$URL:8" id:42000100;',
      status: 'active',
      source: 'Manual',
      naxsiId: 42000100,
      indicatorId: createdIocs[1].id
    }
  });

  await prisma.rule.create({
    data: {
      type: 'NAXSI_BASIC',
      content: 'BasicRule wl:42000100 "mz:$URL:/api/Track/result";',
      status: 'pending',
      source: 'MISP',
      naxsiId: 42000101,
      indicatorId: createdIocs[1].id
    }
  });

  await prisma.rule.create({
    data: {
      type: 'NAXSI_MAIN',
      content: 'MainRule "str:10.0.2.15" "msg:Targeted IP Block" "mz:BODY" "s:$BODY:8" id:42000102;',
      status: 'active',
      source: 'MISP',
      naxsiId: 42000102,
      indicatorId: createdIocs[0].id
    }
  });

  console.log('✅ Mock Rules created');

  console.log('\n🎉 Mock data seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Mock seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
