const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  console.log('Connected');
  
  try {
    const res = await prisma.$transaction(async (tx) => {
      return await tx.salon.findFirst();
    });
    console.log('Transaction result:', res);
  } catch (e) {
    console.error('Transaction error:', e);
  }

  await prisma.$disconnect();
}

test();
