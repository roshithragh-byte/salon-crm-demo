import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationsService) {}

  async createPaymentOrder(salonId: string, bookingId: string, idempotencyKey?: string) {
    // 1. Resolve Salon
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    // 2. Fetch Booking
    const booking = await this.prisma.client.appointment.findFirst({
      where: { id: bookingId, salonId: salon.id }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // 3. Idempotency Check
    if (idempotencyKey) {
      const existing = await this.prisma.client.payment.findUnique({
        where: { idempotencyKey }
      });
      if (existing) {
        return { data: existing };
      }
    }

    // 4. Create Payment inside transaction
    return await this.prisma.client.$transaction(async (tx) => {
      // For this phase, we mock Razorpay Order creation by generating a dummy ID
      const mockOrderId = "order_" + Math.random().toString(36).substring(2, 10);
      
      const payment = await tx.payment.create({
        data: {
          salonId: salon.id,
          appointmentId: booking.id,
          amount: booking.finalRevenue ?? 0,
          currency: 'INR',
          provider: 'RAZORPAY',
          providerOrderId: mockOrderId,
          status: 'CREATED',
          idempotencyKey,
        }
      });
      return { data: payment };
    });
  }

  async handleWebhook(provider: string, payload: any) {
    if (provider !== 'razorpay') {
      throw new NotFoundException('Provider not supported');
    }
    
    // In a real app, verify Razorpay signature here using crypto
    // const signature = headers['x-razorpay-signature'];
    
    // We expect payload.payload.payment.entity in razorpay
    // But to make it simple for our mock webhook, we can just look for order_id
    const orderId = payload?.order_id || payload?.payload?.payment?.entity?.order_id;
    if (!orderId) {
      return { received: true }; // Ack but ignore
    }

    await this.prisma.client.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerOrderId: orderId }
      });

      if (!payment) return; // ignore unknown

      // If already captured, ignore (idempotent webhook)
      if (payment.status === 'CAPTURED') return;

      // Update payment
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'CAPTURED' }
      });

      // Confirm the booking!
      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: 'CONFIRMED' }
      });

      await this.notifications.scheduleEvent(tx, payment.salonId, 'BOOKING_CONFIRMED', {
        appointmentId: payment.appointmentId,
        paymentId: payment.id,
      });
    });

    return { received: true };
  }
}
