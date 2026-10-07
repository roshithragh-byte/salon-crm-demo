import { PaymentsService } from './payments.service';
import { BookingsService } from '../bookings/bookings.service';
import { UnauthorizedException, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('Phase 2 — P0 Payment Security & Transaction Integrity Matrix', () => {
  const WEBHOOK_SECRET = 'test_webhook_secret_key_32_chars_2026';
  let paymentsService: PaymentsService;
  let bookingsService: BookingsService;
  let mockPrisma: any;
  let mockNotifications: any;
  let mockTypeSafe: any;

  beforeEach(() => {
    process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;

    mockNotifications = {
      scheduleEvent: jest.fn().mockResolvedValue(true),
    };

    mockTypeSafe = {
      ask: jest.fn().mockResolvedValue(null),
    };

    mockPrisma = {
      client: {
        salon: {
          findFirst: jest.fn(),
          findUnique: jest.fn(),
        },
        service: {
          findUnique: jest.fn(),
        },
        appointment: {
          findFirst: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
        },
        payment: {
          findFirst: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          updateMany: jest.fn(),
        },
        customer: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
        staffService: {
          findMany: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrisma.client)),
      },
    };

    paymentsService = new PaymentsService(mockPrisma, mockNotifications);
    bookingsService = new BookingsService(mockPrisma, mockNotifications, mockTypeSafe);
  });

  function generateSignature(rawBody: string | Buffer, secret: string = WEBHOOK_SECRET): string {
    return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  }

  describe('1. Webhook Cryptographic Security & Raw Body Verification', () => {
    const rawPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_123456789',
            order_id: 'order_test_123',
            amount: 250000,
            status: 'captured',
          },
        },
      },
    });
    const rawBuffer = Buffer.from(rawPayload, 'utf8');

    it('TASK 1: Rejects webhook when signature header is missing with UnauthorizedException (401)', async () => {
      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), undefined, rawBuffer)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('TASK 2: Rejects webhook when signature header is forged/invalid with UnauthorizedException (401)', async () => {
      const invalidSignature = 'invalid_forged_hex_signature_abcdef1234567890';
      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), invalidSignature, rawBuffer)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('TASK 3: Rejects webhook when signed with wrong or default secret', async () => {
      const wrongSecretSignature = generateSignature(rawBuffer, 'wrong_secret_12345678901234567890');
      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), wrongSecretSignature, rawBuffer)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('TASK 4: Rejects webhook when raw payload body was modified after signing', async () => {
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);
      const tamperedBuffer = Buffer.from(JSON.stringify({ ...JSON.parse(rawPayload), order_id: 'tampered_order' }), 'utf8');

      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, tamperedBuffer)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('TASK 10: Rejects unsupported payment provider', async () => {
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);
      await expect(
        paymentsService.handleWebhook('unsupported_provider', JSON.parse(rawPayload), validSignature, rawBuffer)
      ).rejects.toThrow(NotFoundException);
    });

    it('TASK 6 & 8: Rejects webhook for unknown or unmatched order ID', async () => {
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);
      mockPrisma.client.payment.findFirst.mockResolvedValue(null);

      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, rawBuffer)
      ).rejects.toThrow(NotFoundException);
    });

    it('TASK 9 (Cross-Salon): Rejects webhook when payment belongs to Salon A but appointment belongs to Salon B with ForbiddenException (403)', async () => {
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);
      const mockPayment = {
        id: 'payment-uuid-1',
        salonId: 'salon-a-uuid',
        appointmentId: 'appt-uuid-b',
        status: 'CREATED',
        providerOrderId: 'order_test_123',
      };

      mockPrisma.client.payment.findFirst.mockResolvedValue(mockPayment);
      // Appointment in DB belongs to a different salon (or null when filtered by salon-a-uuid)
      mockPrisma.client.appointment.findFirst.mockResolvedValue(null);

      await expect(
        paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, rawBuffer)
      ).rejects.toThrow(ForbiddenException);
    });

    it('TASK 5 & 23: Accepts valid signed webhook and confirms booking transactionally', async () => {
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);
      const mockPayment = {
        id: 'payment-uuid-1',
        salonId: 'salon-hq-uuid',
        appointmentId: 'appt-uuid-1',
        status: 'CREATED',
        providerOrderId: 'order_test_123',
      };
      const mockAppt = {
        id: 'appt-uuid-1',
        salonId: 'salon-hq-uuid',
        status: 'PENDING',
      };

      mockPrisma.client.payment.findFirst.mockResolvedValue(mockPayment);
      mockPrisma.client.appointment.findFirst.mockResolvedValue(mockAppt);
      mockPrisma.client.payment.update.mockResolvedValue({ ...mockPayment, status: 'SUCCESS' });
      mockPrisma.client.appointment.update.mockResolvedValue({ id: 'appt-uuid-1', status: 'CONFIRMED' });

      const result = await paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, rawBuffer);
      expect(result.received).toBe(true);

      expect(mockPrisma.client.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-uuid-1' },
        data: expect.objectContaining({ status: 'SUCCESS' }),
      });
      expect(mockPrisma.client.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-uuid-1' },
        data: { status: 'CONFIRMED' },
      });
      expect(mockNotifications.scheduleEvent).toHaveBeenCalled();
    });
  });

  describe('2. Webhook Idempotency & State Machine', () => {
    it('TASK 12 & 15: Handles duplicate webhook idempotently without duplicate side effects', async () => {
      const rawPayload = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_123', order_id: 'order_123', status: 'captured' } } },
      });
      const rawBuffer = Buffer.from(rawPayload, 'utf8');
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);

      const alreadySuccessPayment = {
        id: 'payment-uuid-1',
        salonId: 'salon-hq-uuid',
        appointmentId: 'appt-uuid-1',
        status: 'SUCCESS',
        providerOrderId: 'order_123',
      };

      mockPrisma.client.payment.findFirst.mockResolvedValue(alreadySuccessPayment);
      mockPrisma.client.appointment.findFirst.mockResolvedValue({ id: 'appt-uuid-1', salonId: 'salon-hq-uuid' });

      const result = await paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, rawBuffer);
      expect(result.received).toBe(true);
      expect(result.idempotent).toBe(true);
      expect(mockPrisma.client.payment.update).not.toHaveBeenCalled();
      expect(mockPrisma.client.appointment.update).not.toHaveBeenCalled();
    });

    it('TASK 24: Failed payment webhook transitions payment to FAILED and booking to PAYMENT_FAILED', async () => {
      const rawPayload = JSON.stringify({
        event: 'payment.failed',
        payload: { payment: { entity: { id: 'pay_fail_123', order_id: 'order_fail_123', status: 'failed' } } },
      });
      const rawBuffer = Buffer.from(rawPayload, 'utf8');
      const validSignature = generateSignature(rawBuffer, WEBHOOK_SECRET);

      const mockPayment = {
        id: 'payment-uuid-fail',
        salonId: 'salon-hq-uuid',
        appointmentId: 'appt-uuid-fail',
        status: 'CREATED',
        providerOrderId: 'order_fail_123',
      };

      mockPrisma.client.payment.findFirst.mockResolvedValue(mockPayment);
      mockPrisma.client.appointment.findFirst.mockResolvedValue({ id: 'appt-uuid-fail', salonId: 'salon-hq-uuid' });

      const result = await paymentsService.handleWebhook('razorpay', JSON.parse(rawPayload), validSignature, rawBuffer);
      expect(result.received).toBe(true);

      expect(mockPrisma.client.payment.update).toHaveBeenCalledWith({
        where: { id: 'payment-uuid-fail' },
        data: expect.objectContaining({ status: 'FAILED' }),
      });
      expect(mockPrisma.client.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appt-uuid-fail' },
        data: { status: 'PAYMENT_FAILED' },
      });
    });
  });

  describe('3. Booking Idempotency & Slot Concurrency Protection', () => {
    const validBookingBody = {
      customerName: 'Aarav Sharma',
      customerPhone: '9876543210',
      customerEmail: 'aarav@example.com',
      serviceId: 'svc-haircut-uuid',
      stylistId: 'staff-1-uuid',
      startsAt: '2026-10-15T10:00:00.000Z',
      notes: 'Standard cut',
    };

    const mockSalon = { id: 'salon-hq-uuid', slug: 'hq' };
    const mockService = { id: 'svc-haircut-uuid', salonId: 'salon-hq-uuid', durationMinutes: 60, name: 'Haircut' };

    beforeEach(() => {
      mockPrisma.client.salon.findFirst.mockResolvedValue(mockSalon);
      mockPrisma.client.service.findUnique.mockResolvedValue(mockService);
      mockPrisma.client.customer.findUnique.mockResolvedValue({ id: 'cust-1' });
    });

    it('TASK 16 & 17: Returns original appointment when same idempotency key is submitted with identical payload', async () => {
      const existingAppt = {
        id: 'appt-existing-1',
        salonId: 'salon-hq-uuid',
        idempotencyKey: 'idemp-key-123',
        serviceId: 'svc-haircut-uuid',
        customerPhone: '9876543210',
        startsAt: new Date(validBookingBody.startsAt),
        status: 'PENDING',
      };

      mockPrisma.client.appointment.findUnique.mockResolvedValue(existingAppt);

      const result = await bookingsService.createBooking('hq', validBookingBody, 'idemp-key-123');
      expect(result.data.id).toBe('appt-existing-1');
      expect(mockPrisma.client.appointment.create).not.toHaveBeenCalled();
    });

    it('TASK 18: Rejects with ConflictException (409) when same idempotency key is reused with different payload', async () => {
      const existingAppt = {
        id: 'appt-existing-1',
        salonId: 'salon-hq-uuid',
        idempotencyKey: 'idemp-key-123',
        serviceId: 'different-service-uuid', // Mismatched service
        customerPhone: '9876543210',
        startsAt: new Date(validBookingBody.startsAt),
        status: 'PENDING',
      };

      mockPrisma.client.appointment.findUnique.mockResolvedValue(existingAppt);

      await expect(
        bookingsService.createBooking('hq', validBookingBody, 'idemp-key-123')
      ).rejects.toThrow(ConflictException);
    });

    it('TASK 18 (Cross-Salon): Rejects with ConflictException (409) when same idempotency key is reused across different salons', async () => {
      const existingAppt = {
        id: 'appt-existing-1',
        salonId: 'salon-other-uuid', // Different salon
        idempotencyKey: 'idemp-key-123',
        serviceId: 'svc-haircut-uuid',
        customerPhone: '9876543210',
        startsAt: new Date(validBookingBody.startsAt),
        status: 'PENDING',
      };

      mockPrisma.client.appointment.findUnique.mockResolvedValue(existingAppt);

      await expect(
        bookingsService.createBooking('hq', validBookingBody, 'idemp-key-123')
      ).rejects.toThrow(ConflictException);
    });

    it('TASK 19: Rejects conflicting booking for already occupied slot with ConflictException (409)', async () => {
      mockPrisma.client.appointment.findUnique.mockResolvedValue(null);
      // Mock existing overlapping appointment in database
      mockPrisma.client.appointment.findFirst.mockResolvedValue({
        id: 'appt-existing-conflict',
        startsAt: new Date('2026-10-15T10:00:00.000Z'),
        endsAt: new Date('2026-10-15T11:00:00.000Z'),
        status: 'CONFIRMED',
      });

      await expect(
        bookingsService.createBooking('hq', validBookingBody)
      ).rejects.toThrow(ConflictException);
    });

    it('TASK 20: Allows booking when slot is free', async () => {
      mockPrisma.client.appointment.findUnique.mockResolvedValue(null);
      mockPrisma.client.appointment.findFirst.mockResolvedValue(null); // No overlap
      mockPrisma.client.appointment.create.mockResolvedValue({
        id: 'appt-new-1',
        status: 'PENDING',
        startsAt: new Date(validBookingBody.startsAt),
        endsAt: new Date('2026-10-15T11:00:00.000Z'),
      });

      const result = await bookingsService.createBooking('hq', validBookingBody);
      expect(result.data.id).toBe('appt-new-1');
      expect(result.data.status).toBe('PENDING');
    });
  });
});
