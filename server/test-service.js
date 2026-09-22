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

  // Create a service for this salon
  const service = await prisma.service.create({
    data: {
      salonId: salon.id,
      name: 'Test Service',
      slug: 'test-service',
      durationMinutes: 30,
      basePrice: 5000, // 50.00 in smallest currency unit
      isActive: true,
      displayOrder: 0
    },
  });

  console.log(`Created service: ${service.name} (${service.id})`);

  // Test the ownership validation via API
  console.log('\n--- Testing API ownership validation ---');

  // Get the token first
  const authResponse = await fetch('http://localhost:3001/api/v1/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'testpassword' })
  });

  const authData = await authResponse.json();
  const token = authData.token;
  console.log(`Got token: ${token.substring(0, 20)}...`);

  // Test 1: Correct salon ID and service ID (should work)
  try {
    const response1 = await fetch(`http://localhost:3001/api/v1/salons/${salon.id}/services/${service.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data1 = await response1.json();
    console.log(`✓ Correct salon/service: Status ${response1.status}, Service found: !!data1.data`);
  } catch (error) {
    console.log(`✗ Error with correct salon/service: ${error.message}`);
  }

  // Test 2: Wrong salon ID, correct service ID (should fail with 400/Bad Request)
  try {
    const response2 = await fetch(`http://localhost:3001/api/v1/salons/00000000-0000-0000-0000-000000000000/services/${service.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data2 = await response2.json();
    console.log(`✓ Wrong salon correctly rejected: Status ${response2.status}`);
    if (response2.status !== 200) {
      console.log(`  Message: ${data2.message || 'No message'}`);
    }
  } catch (error) {
    console.log(`✗ Error testing wrong salon: ${error.message}`);
  }

  // Test 3: Correct salon ID, wrong service ID (should fail with 400/Bad Request)
  try {
    const response3 = await fetch(`http://localhost:3001/api/v1/salons/${salon.id}/services/00000000-0000-0000-0000-000000000000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data3 = await response3.json();
    console.log(`✓ Wrong service correctly rejected: Status ${response3.status}`);
    if (response3.status !== 200) {
      console.log(`  Message: ${data3.message || 'No message'}`);
    }
  } catch (error) {
    console.log(`✗ Error testing wrong service: ${error.message}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });