import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Booking Concurrency (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let salonId: string;
  let serviceId: string;
  const PORT = 3005;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(PORT);

    prisma = app.get(PrismaService);
    
    await prisma.client.outboxEvent.deleteMany();
    await prisma.client.loyaltyTransaction.deleteMany();
    await prisma.client.payment.deleteMany();
    await prisma.client.appointment.deleteMany();

    const salon = await prisma.client.salon.findFirst();
    salonId = salon!.id;

    const service = await prisma.client.service.findFirst({ where: { salonId } });
    serviceId = service!.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('MUST allow exactly 1 successful booking out of 50 concurrent requests for the same slot', async () => {
    const concurrentRequests = 50;
    const targetTime = '2026-09-25T14:00:00.000Z'; 

    const promises = [];
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        fetch(`http://localhost:${PORT}/salons/${salonId}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: `Concurrent User ${i}`,
            customerPhone: `555000${i.toString().padStart(4, '0')}`,
            serviceId,
            startsAt: targetTime,
          })
        }).then(res => res.status)
      );
    }

    const statuses = await Promise.all(promises);

    const successful = statuses.filter((s) => s === 201);
    const conflicts = statuses.filter((s) => s === 409);

    console.log(`[Concurrency Test] 50 requests fired. Statuses: `, statuses);
    console.log(`[Concurrency Test] Successes (201): ${successful.length}`);
    console.log(`[Concurrency Test] Conflicts (409): ${conflicts.length}`);

    expect(successful.length).toBe(1);
    expect(conflicts.length).toBe(49);
  }, 30000);
});
