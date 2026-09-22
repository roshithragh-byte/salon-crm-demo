import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Booking to Payment Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let salonId: string;
  let serviceId: string;
  let bookingId: string;
  let providerOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    const salon = await prisma.client.salon.findFirst();
    salonId = salon!.id;
    const service = await prisma.client.service.findFirst({ where: { salonId } });
    serviceId = service!.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Create a booking (status PENDING)', async () => {
    const res = await request(app.getHttpServer())
      .post(`/salons/${salonId}/bookings`)
      .send({
        customerName: 'Integration Tester',
        customerPhone: '9991112222',
        serviceId,
        startsAt: '2026-09-20T10:00:00.000Z',
      })
      .expect(201);
      
    expect(res.body.data.status).toBe('PENDING');
    expect(res.body.data.id).toBeDefined();
    bookingId = res.body.data.id;
  });

  it('2. Create a Payment Order for the booking', async () => {
    const res = await request(app.getHttpServer())
      .post(`/salons/${salonId}/bookings/${bookingId}/payment`)
      .expect(201);
      
    expect(res.body.data.status).toBe('CREATED');
    expect(res.body.data.providerOrderId).toBeDefined();
    providerOrderId = res.body.data.providerOrderId;
  });

  it('3. Trigger Webhook to CAPTURE payment and CONFIRM booking', async () => {
    const res = await request(app.getHttpServer())
      .post('/payments/webhooks/razorpay')
      .send({ order_id: providerOrderId })
      .expect(201);
      
    expect(res.body.received).toBe(true);

    // Verify DB states
    const booking = await prisma.client.appointment.findUnique({ where: { id: bookingId }});
    expect(booking!.status).toBe('CONFIRMED');
    
    const payment = await prisma.client.payment.findFirst({ where: { appointmentId: bookingId }});
    expect(payment!.status).toBe('CAPTURED');
  });

  it('4. Mark booking as COMPLETED and verify CRM Analytics logic', async () => {
    const completeRes = await request(app.getHttpServer())
      .post(`/salons/${salonId}/bookings/${bookingId}/complete`)
      .expect(201);
      
    expect(completeRes.body.data.status).toBe('COMPLETED');
    
    // Check CRM points
    const customer = await prisma.client.customer.findUnique({ where: { id: completeRes.body.data.customerId } });
    expect(customer!.visitCount).toBeGreaterThan(0);
    expect(customer!.loyaltyPoints).toBeGreaterThan(0);
  });
});
