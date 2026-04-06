const bcrypt = require('bcryptjs');
const prisma = require('./utils/prisma');

async function testLogin() {
  const email = 'admin@soc.com';
  const password = 'password123';
  
  console.log(`--- Testing Login for ${email} ---`);
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('❌ User not found in DB');
      return;
    }
    
    console.log('User found:', { email: user.email, role: user.role, status: user.status });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('✅ Password MATCH');
    } else {
      console.log('❌ Password MISMATCH');
      console.log('Hash in DB:', user.password);
    }
  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
