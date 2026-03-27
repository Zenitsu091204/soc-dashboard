/**
 * create-admin.js — Create or update an admin user.
 * 
 * Usage:
 *   node prisma/create-admin.js <email> <password> [name] [role]
 * 
 * Examples:
 *   node prisma/create-admin.js admin@mycompany.com MySecurePass123
 *   node prisma/create-admin.js admin@mycompany.com MySecurePass123 "John Doe" admin
 *   node prisma/create-admin.js analyst@mycompany.com Pass456 "Jane Smith" analyst
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const [,, email, password, name = 'Admin User', role = 'admin'] = process.argv;

  if (!email || !password) {
    console.error('❌ Usage: node prisma/create-admin.js <email> <password> [name] [role]');
    console.error('   Roles: admin | analyst');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    process.exit(1);
  }

  const validRoles = ['admin', 'analyst'];
  if (!validRoles.includes(role)) {
    console.error(`❌ Role must be one of: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name, role },
    create: { email, password: hashed, name, role },
  });

  console.log(`\n✅ User saved successfully!`);
  console.log(`   Email : ${user.email}`);
  console.log(`   Name  : ${user.name}`);
  console.log(`   Role  : ${user.role}`);
  console.log(`   ID    : ${user.id}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
