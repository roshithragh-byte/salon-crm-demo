const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
async function run() {
  try {
    const adapter = new PrismaPg({ connectionString: 'postgres://dummy' });
    const prisma = new PrismaClient({ adapter });
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected");
    const res = await prisma.salon.findFirst();
    console.log("Result:", res);
  } catch (e) {
    console.log("Error caught!");
    console.error(e);
  }
}
run();
