require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const argon2 = require('argon2');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'test@example.com';
  const password = 'testpassword';
  const passwordHash = await argon2.hash(password);

  // Create a salon
  const salon = await prisma.salon.create({
    data: {
      name: 'Test Salon',
      slug: 'test-salon',
      phone: '1234567890',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'TS',
      postalCode: '12345',
      countryCode: 'US',
    },
  });

  // Create a user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
    },
  });

  // Create a salonMember linking user to salon
  await prisma.salonMember.create({
    data: {
      salonId: salon.id,
      userId: user.id,
      role: 'OWNER',
      isActive: true,
    },
  });

  console.log('Created user:', user.email);
  console.log('Created salon:', salon.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });