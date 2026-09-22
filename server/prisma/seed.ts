import "dotenv/config";
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await argon2.hash('admin12345678');
  
  // 1. Create Salon
  const salon = await prisma.salon.upsert({
    where: { slug: 'hq' },
    update: {},
    create: {
      name: 'Salon De Bea',
      slug: 'hq',
      phone: '+919876543210',
      addressLine1: '123 Beauty Lane',
      city: 'Mumbai',
      state: 'MH',
      postalCode: '400001',
    },
  });

  // 2. Create User
  const user = await prisma.user.upsert({
    where: { email: 'admin@salondebea.com' },
    update: {
      passwordHash,
    },
    create: {
      email: 'admin@salondebea.com',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      isActive: true,
    },
  });

  // 3. Create Salon Member
  const member = await prisma.salonMember.upsert({
    where: {
      salonId_userId: {
        salonId: salon.id,
        userId: user.id,
      }
    },
    update: {
      role: 'OWNER',
    },
    create: {
      salonId: salon.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  // 4. Create Categories & Full Salon Service Catalogue
  const categoriesData = [
    {
      name: 'Facial & Skincare',
      slug: 'facial-skincare',
      description: 'Rejuvenating and skin brightening facials',
      services: [
        { name: 'Signature Facial', slug: 'signature-facial', durationMinutes: 60, basePrice: 2500, offerPrice: 2200 },
        { name: 'HydraFacial Glow', slug: 'hydrafacial-glow', durationMinutes: 75, basePrice: 4500, offerPrice: 3999 },
        { name: 'Deep Cleanup & Detan', slug: 'deep-cleanup-detan', durationMinutes: 45, basePrice: 1500, offerPrice: 1299 },
        { name: 'Anti-Aging Rejuvenation Facial', slug: 'anti-aging-rejuvenation', durationMinutes: 90, basePrice: 5500, offerPrice: 4999 },
      ],
    },
    {
      name: 'Hair Care & Styling',
      slug: 'hair-care',
      description: 'Expert hair cuts, styling, spa & chemical treatments',
      services: [
        { name: 'Style Cut & Blow Dry', slug: 'style-cut-blow-dry', durationMinutes: 45, basePrice: 900, offerPrice: 799 },
        { name: 'Nourishing Organic Hair Spa', slug: 'nourishing-organic-hair-spa', durationMinutes: 60, basePrice: 1800, offerPrice: 1499 },
        { name: 'Keratin Smoothing Treatment', slug: 'keratin-smoothing', durationMinutes: 120, basePrice: 6500, offerPrice: 5999 },
        { name: 'Global Hair Color & Touch Up', slug: 'global-hair-color', durationMinutes: 90, basePrice: 3500, offerPrice: 2999 },
      ],
    },
    {
      name: 'Nails & Hands/Feet',
      slug: 'nails-hand-feet',
      description: 'Luxury manicure, pedicure & nail art',
      services: [
        { name: 'Spa Pedicure & Manicure Combo', slug: 'spa-pedi-mani-combo', durationMinutes: 75, basePrice: 2200, offerPrice: 1899 },
        { name: 'Gel Polish & Nail Art', slug: 'gel-polish-nail-art', durationMinutes: 60, basePrice: 1600, offerPrice: 1399 },
      ],
    },
    {
      name: 'Bridal & Special Occasions',
      slug: 'bridal-special',
      description: 'Bespoke bridal makeups and high-ticket packages',
      services: [
        { name: 'Royal Bridal Glow Package', slug: 'royal-bridal-glow-package', durationMinutes: 180, basePrice: 15000, offerPrice: 12999 },
        { name: 'Party Glam Makeup & Styling', slug: 'party-glam-makeup', durationMinutes: 90, basePrice: 4500, offerPrice: 3999 },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.serviceCategory.upsert({
      where: { salonId_slug: { salonId: salon.id, slug: cat.slug } },
      update: { name: cat.name, description: cat.description },
      create: {
        salonId: salon.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });

    for (const svc of cat.services) {
      const service = await prisma.service.upsert({
        where: { salonId_slug: { salonId: salon.id, slug: svc.slug } },
        update: {
          name: svc.name,
          durationMinutes: svc.durationMinutes,
          basePrice: svc.basePrice,
          offerPrice: svc.offerPrice,
          categoryId: category.id,
        },
        create: {
          salonId: salon.id,
          categoryId: category.id,
          name: svc.name,
          slug: svc.slug,
          durationMinutes: svc.durationMinutes,
          basePrice: svc.basePrice,
          offerPrice: svc.offerPrice,
        },
      });

      // 5. Assign Service to Staff Member
      await prisma.staffService.upsert({
        where: { staffMemberId_serviceId: { staffMemberId: member.id, serviceId: service.id } },
        update: {},
        create: {
          staffMemberId: member.id,
          serviceId: service.id,
        },
      });
    }
  }

  // 6. Salon business hours (Asia/Kolkata wall times stored as TIME)
  // Mon–Fri 10:00–21:00; Sat–Sun 09:00–21:00
  const weekdayOpen = new Date("1970-01-01T10:00:00.000Z");
  const weekendOpen = new Date("1970-01-01T09:00:00.000Z");
  const closeTime = new Date("1970-01-01T21:00:00.000Z");

  for (let day = 0; day <= 6; day++) {
    const isWeekend = day === 0 || day === 6; // Sun / Sat
    const openTime = isWeekend ? weekendOpen : weekdayOpen;

    await prisma.salonBusinessHour.upsert({
      where: { salonId_dayOfWeek: { salonId: salon.id, dayOfWeek: day } },
      update: { openTime, closeTime, isClosed: false },
      create: {
        salonId: salon.id,
        dayOfWeek: day,
        openTime,
        closeTime,
        isClosed: false,
      },
    });

    // Staff follows salon hours (intersection in availability stays correct if they diverge later)
    await prisma.staffSchedule.upsert({
      where: { id: `default-schedule-${day}` },
      update: {
        startTime: openTime,
        endTime: closeTime,
        isActive: true,
        salonMemberId: member.id,
        dayOfWeek: day,
      },
      create: {
        id: `default-schedule-${day}`,
        salonMemberId: member.id,
        dayOfWeek: day,
        startTime: openTime,
        endTime: closeTime,
        isActive: true,
      },
    });
  }

  // Create Staff User
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@salondebea.com' },
    update: { passwordHash },
    create: {
      email: 'staff@salondebea.com',
      firstName: 'Demo',
      lastName: 'Staff',
      passwordHash,
      isActive: true,
    }
  });

  const staffMember = await prisma.salonMember.upsert({
    where: { salonId_userId: { salonId: salon.id, userId: staffUser.id } },
    update: { role: 'STYLIST' },
    create: { salonId: salon.id, userId: staffUser.id, role: 'STYLIST' },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@salondebea.com' },
    update: { passwordHash },
    create: {
      email: 'customer@salondebea.com',
      firstName: 'Demo',
      lastName: 'Customer',
      passwordHash,
      isActive: true,
      phoneNumber: '+919876543211',
    }
  });

  const customer = await prisma.customer.upsert({
    where: { salonId_phoneNumber: { salonId: salon.id, phoneNumber: '+919876543211' } },
    update: { userId: customerUser.id },
    create: {
      salonId: salon.id,
      userId: customerUser.id,
      firstName: 'Demo',
      lastName: 'Customer',
      phoneNumber: '+919876543211',
      email: 'customer@salondebea.com',
    }
  });

  const firstService = await prisma.service.findFirst({ where: { salonId: salon.id } });
  if (firstService) {
    await prisma.staffService.upsert({
      where: { staffMemberId_serviceId: { staffMemberId: staffMember.id, serviceId: firstService.id } },
      update: {},
      create: { staffMemberId: staffMember.id, serviceId: firstService.id },
    });

    const start = new Date();
    start.setHours(start.getHours() + 24);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + firstService.durationMinutes);

    await prisma.appointment.upsert({
      where: { idempotencyKey: 'demo-appointment-01' },
      update: { startsAt: start, endsAt: end, staffId: staffMember.id },
      create: {
        idempotencyKey: 'demo-appointment-01',
        salonId: salon.id,
        customerId: customer.id,
        customerName: customer.firstName + ' ' + (customer.lastName || ''),
        customerPhone: customer.phoneNumber,
        customerEmail: customer.email || null,
        serviceId: firstService.id,
        staffId: staffMember.id,
        startsAt: start,
        endsAt: end,
        status: 'PENDING',
      }
    });
  }

  console.log('Seed completed. Admin User created: admin@salondebea.com / admin12345678');
  console.log('Business hours: Mon-Fri 10:00-21:00, Sat-Sun 09:00-21:00 Asia/Kolkata');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
