require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find the salon we created earlier
  const salon = await prisma.salon.findFirst({
    where: { name: 'Test Salon' }
  });

  if (!salon) {
    console.error('Test salon not found');
    return;
  }

  console.log(`Found salon: ${salon.name} (${salon.id})`);

  // Create a category for this salon
  const category = await prisma.serviceCategory.create({
    data: {
      salon: { connect: { id: salon.id } },
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
      displayOrder: 0
    },
  });

  console.log(`Created category: ${category.name} (${category.id})`);

  // Create a service for this salon
  const service = await prisma.service.create({
    data: {
      salon: { connect: { id: salon.id } },
      category: { connect: { id: category.id } },
      name: 'Test Service',
      slug: 'test-service',
      durationMinutes: 30,
      basePrice: 5000, // 50.00 in smallest currency unit
      isActive: true,
      displayOrder: 0
    },
  });

  console.log(`Created service: ${service.name} (${service.id})`);
  console.log(`You can now test with:`);
  console.log(`curl -H "Authorization: Bearer <YOUR_TOKEN>" http://localhost:3001/api/v1/salons/${salon.id}/services/${service.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });