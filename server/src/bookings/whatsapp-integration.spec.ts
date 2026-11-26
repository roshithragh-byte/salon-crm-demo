import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BusyController } from './busy.controller';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('WhatsApp integration — bookings & busy', () => {
  const KEY = 'test-integration-key-123';
  let prisma: any;
  let service: BookingsService;
  let controller: BookingsController;
  let busy: BusyController;
  const salon = { id: 'salon-1', slug: 'jaspers' };
  const svc = { id: 'svc-1', salonId: 'salon-1', durationMinutes: 60, basePrice: 500, name: 'Haircut' };
  const base = {
    serviceId: 'svc-1', stylistId: 'staff-1', startsAt: '2026-12-01T05:00:00.000Z',
    customerName: 'Asha Rao', customerPhone: '+919999999999',
  };

  beforeEach(() => {
    process.env.INTEGRATION_API_KEY = KEY;
    prisma = {
      client: {
        salon: { findFirst: jest.fn().mockResolvedValue(salon) },
        service: { findUnique: jest.fn().mockResolvedValue(svc) },
        appointment: {
          findFirst: jest.fn().mockResolvedValue(null),
          findUnique: jest.fn().mockResolvedValue(null),
          findMany: jest.fn().mockResolvedValue([]),
          create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'a1', ...data })),
        },
        customer: {
          findUnique: jest.fn().mockResolvedValue({ id: 'c1' }),
          create: jest.fn(),
        },
        staffService: { findMany: jest.fn() },
        $transaction: jest.fn((cb: any) => cb(prisma.client)),
      },
    };
    const notifications: any = { scheduleEvent: jest.fn().mockResolvedValue(true) };
    service = new BookingsService(prisma, notifications, { ask: jest.fn() } as any);
    controller = new BookingsController(service);
    busy = new BusyController(service);
  });
  afterAll(() => { delete process.env.INTEGRATION_API_KEY; });

  describe('web path unchanged', () => {
    it('no source: PENDING, service duration, no key needed', async () => {
      const res: any = await controller.createBooking('salon-1', { ...base }, undefined as any);
      expect(res.data.status).toBe('PENDING');
      expect(res.data.endsAt.toISOString()).toBe('2026-12-01T06:00:00.000Z');
    });
    it("source 'WEB' behaves the same and ignores durationMinutes", async () => {
      const res: any = await controller.createBooking('salon-1', { ...base, source: 'WEB', durationMinutes: 15 }, undefined as any);
      expect(res.data.status).toBe('PENDING');
      expect(res.data.endsAt.toISOString()).toBe('2026-12-01T06:00:00.000Z');
    });
    it('idempotent replay still returns existing', async () => {
      const existing = { id: 'x', salonId: 'salon-1', serviceId: 'svc-1', customerPhone: base.customerPhone, startsAt: new Date(base.startsAt) };
      prisma.client.appointment.findUnique.mockResolvedValue(existing);
      const res: any = await controller.createBooking('salon-1', { ...base }, 'idem-1');
      expect(res.data).toBe(existing);
      expect(prisma.client.appointment.create).not.toHaveBeenCalled();
    });
    it('rejects unknown source with 400', async () => {
      await expect(controller.createBooking('salon-1', { ...base, source: 'FOO' }, undefined as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('WHATSAPP source', () => {
    const wa = { ...base, source: 'WHATSAPP' };
    it('401 without key', async () => {
      await expect(controller.createBooking('salon-1', wa, undefined as any)).rejects.toThrow(UnauthorizedException);
      expect(prisma.client.salon.findFirst).not.toHaveBeenCalled();
    });
    it('401 with wrong key', async () => {
      await expect(controller.createBooking('salon-1', wa, undefined as any, 'nope')).rejects.toThrow(UnauthorizedException);
    });
    it('401 when env var unset even if header sent', async () => {
      delete process.env.INTEGRATION_API_KEY;
      await expect(controller.createBooking('salon-1', wa, undefined as any, '')).rejects.toThrow(UnauthorizedException);
      await expect(controller.createBooking('salon-1', wa, undefined as any, 'undefined')).rejects.toThrow(UnauthorizedException);
    });
    it('valid key: CONFIRMED, default service duration', async () => {
      const res: any = await controller.createBooking('salon-1', wa, undefined as any, KEY);
      expect(res.data.status).toBe('CONFIRMED');
      expect(res.data.endsAt.toISOString()).toBe('2026-12-01T06:00:00.000Z');
    });
    it('valid key + durationMinutes overrides endsAt', async () => {
      const res: any = await controller.createBooking('salon-1', { ...wa, durationMinutes: 90 }, undefined as any, KEY);
      expect(res.data.endsAt.toISOString()).toBe('2026-12-01T06:30:00.000Z');
    });
    it.each([4, 481, 30.5, '60'])('rejects invalid durationMinutes %p', async (d) => {
      await expect(controller.createBooking('salon-1', { ...wa, durationMinutes: d }, undefined as any, KEY)).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET busy', () => {
    it('401 without/wrong key', async () => {
      await expect(busy.getBusy('salon-1', '2026-12-01', undefined as any)).rejects.toThrow(UnauthorizedException);
      await expect(busy.getBusy('salon-1', '2026-12-01', 'bad')).rejects.toThrow(UnauthorizedException);
    });
    it('400 on bad date', async () => {
      await expect(busy.getBusy('salon-1', '01-12-2026', KEY)).rejects.toThrow(BadRequestException);
      await expect(busy.getBusy('salon-1', undefined as any, KEY)).rejects.toThrow(BadRequestException);
    });
    it('queries IST day window, excludes CANCELLED, returns ISO UTC', async () => {
      prisma.client.appointment.findMany.mockResolvedValue([
        { startsAt: new Date('2026-12-01T05:00:00Z'), endsAt: new Date('2026-12-01T06:00:00Z'), staffId: 's1' },
      ]);
      const res = await busy.getBusy('jaspers', '2026-12-01', KEY);
      expect(res).toEqual({ data: [{ startsAt: '2026-12-01T05:00:00.000Z', endsAt: '2026-12-01T06:00:00.000Z', staffId: 's1' }] });
      const where = prisma.client.appointment.findMany.mock.calls[0][0].where;
      expect(where.salonId).toBe('salon-1');
      expect(where.status).toEqual({ not: 'CANCELLED' });
      expect(where.startsAt.lt.toISOString()).toBe('2026-12-01T18:30:00.000Z');
      expect(where.endsAt.gt.toISOString()).toBe('2026-11-30T18:30:00.000Z');
    });
  });
});
