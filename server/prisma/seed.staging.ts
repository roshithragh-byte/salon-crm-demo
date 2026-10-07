import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL || '';

// Production safety guard: Never seed production database with staging fixtures
if (
  process.env.ALLOW_STAGING_SEED !== 'true' &&
  (databaseUrl.includes('mainline.proxy.rlwy.net') || process.env.NODE_ENV === 'production')
) {
  console.error('CRITICAL SAFETY BLOCK: Staging seed script aborted. Target database is marked as production.');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

export async function seedStaging() {
  const adminPassword = process.env.NONPROD_ADMIN_PASSWORD || 'StagingAdminPass2026!';
  const staffPassword = process.env.NONPROD_STAFF_PASSWORD || 'StagingStaffPass2026!';
  
  const adminPasswordHash = await argon2.hash(adminPassword);
  const staffPasswordHash = await argon2.hash(staffPassword);

  // 1. Create Staging Tenants (Salon A and Salon B)
  const salonA = await prisma.salon.upsert({
    where: { slug: 'audit-salon-a' },
    update: {},
    create: {
      name: 'Audit Staging Salon A',
      slug: 'audit-salon-a',
      phone: '+919876543290',
      email: 'salon-a@staging.salondebea.test',
      addressLine1: '100 Audit Lane Staging',
      city: 'Mumbai',
      state: 'MH',
      postalCode: '400001',
    },
  });

  const salonB = await prisma.salon.upsert({
    where: { slug: 'audit-salon-b' },
    update: {},
    create: {
      name: 'Audit Staging Salon B',
      slug: 'audit-salon-b',
      phone: '+919876543291',
      email: 'salon-b@staging.salondebea.test',
      addressLine1: '200 Isolation Boulevard',
      city: 'Delhi',
      state: 'DL',
      postalCode: '110001',
    },
  });

  // 2. Create Audit Users
  const auditAdmin = await prisma.user.upsert({
    where: { email: 'audit-admin@salondebea.test' },
    update: {
      passwordHash: adminPasswordHash,
      isActive: true,
    },
    create: {
      email: 'audit-admin@salondebea.test',
      firstName: 'Audit',
      lastName: 'Admin',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  const auditStaff = await prisma.user.upsert({
    where: { email: 'audit-staff@salondebea.test' },
    update: {
      passwordHash: staffPasswordHash,
      isActive: true,
    },
    create: {
      email: 'audit-staff@salondebea.test',
      firstName: 'Audit',
      lastName: 'Staff',
      passwordHash: staffPasswordHash,
      isActive: true,
    },
  });

  // 3. Associate Users with Salon A
  await prisma.salonMember.upsert({
    where: {
      salonId_userId: {
        salonId: salonA.id,
        userId: auditAdmin.id,
      },
    },
    update: { role: 'OWNER' },
    create: {
      salonId: salonA.id,
      userId: auditAdmin.id,
      role: 'OWNER',
    },
  });

  await prisma.salonMember.upsert({
    where: {
      salonId_userId: {
        salonId: salonA.id,
        userId: auditStaff.id,
      },
    },
    update: { role: 'STYLIST' },
    create: {
      salonId: salonA.id,
      userId: auditStaff.id,
      role: 'STYLIST',
    },
  });

  console.log('[STAGING SEED] Staging test fixtures created/updated successfully.');
  console.log(`[STAGING SEED] Salon A ID: ${salonA.id} (slug: audit-salon-a)`);
  console.log(`[STAGING SEED] Salon B ID: ${salonB.id} (slug: audit-salon-b)`);
  console.log(`[STAGING SEED] Admin: audit-admin@salondebea.test (Role: OWNER on Salon A)`);
  console.log(`[STAGING SEED] Staff: audit-staff@salondebea.test (Role: STYLIST on Salon A)`);
}

if (require.main === module) {
  seedStaging()
    .catch((err) => {
      console.error('[STAGING SEED ERROR]', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
