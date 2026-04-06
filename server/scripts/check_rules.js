const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rules = await prisma.rule.findMany({
    include: { indicator: true },
    orderBy: { naxsiId: 'asc' }
  });

  console.log('--- Generated Rules ---');
  rules.forEach(r => {
    console.log(`ID: ${r.naxsiId} | Category: ${r.indicator?.description || 'Manual'} | Content: ${r.content}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
