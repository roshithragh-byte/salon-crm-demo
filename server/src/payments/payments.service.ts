import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as crypto from 'crypto';

export interface WebhookResult {
  received: boolean;
  idempotent?: boolean;
  status?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async createPaymentOrder(salonId: string, bookingId: string, idempotencyKey?: string) {
    // 1. Resolve Salon
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] },
    });
    if (!salon) throw new NotFoundException('Salon not found');

    // 2. Fetch Booking
    const booking = await this.prisma.client.appointment.findFirst({
      where: { id: bookingId, salonId: salon.id },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // 3. Idempotency Check
    if (idempotencyKey) {
      const existing = await this.prisma.client.payment.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        if (existing.appointmentId !== booking.id || existing.salonId !== salon.id) {
          throw new BadRequestException('Idempotency key reused for different booking or salon');
        }
        return { data: existing };
      }
    }

    // 4. Create Payment inside transaction
    return await this.prisma.client.$transaction(async (tx) => {
      // Generate unique provider order ID for test/mock/SDK integration
      const mockOrderId = 'order_' + Math.random().toString(36).substring(2, 10);

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
        },
      });
      return { data: payment };
    });
  }

  async handleWebhook(
    provider: string,
    payload: any,
    signatureHeader?: string,
    rawBody?: Buffer | string,
  ): Promise<WebhookResult> {
    if (provider !== 'razorpay') {
      throw new NotFoundException(`Payment provider '${provider}' not supported`);
    }

    // 1. Enforce Webhook Secret Configuration
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret.trim() === '') {
      this.logger.error('RAZORPAY_WEBHOOK_SECRET is not configured.');
      throw new UnauthorizedException('Payment webhook secret is not configured on server');
    }

    // 2. Require Signature Header
    if (!signatureHeader || typeof signatureHeader !== 'string') {
      throw new UnauthorizedException('Missing or invalid Razorpay signature header');
    }

    // 3. Cryptographic Raw-Body HMAC-SHA256 Verification
    if (!rawBody) {
      throw new UnauthorizedException('Missing raw request payload for cryptographic verification');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(signatureHeader, 'utf8');

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      this.logger.warn('Razorpay webhook HMAC signature mismatch');
      throw new UnauthorizedException('Invalid Razorpay webhook signature');
    }

    // 4. Extract Event and Identifiers
    const event = payload?.event || 'payment.captured';
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const providerOrderId = paymentEntity?.order_id || orderEntity?.id || payload?.order_id;
    const providerPaymentId = paymentEntity?.id || payload?.payment_id;
    const paymentStatus = paymentEntity?.status;

    if (!providerOrderId) {
      throw new BadRequestException('Webhook payload missing order identifier');
    }

    // 5. Database Transaction & Business Authorization State Machine
    return await this.prisma.client.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerOrderId },
      });

      if (!payment) {
        throw new NotFoundException(`No payment record found matching order '${providerOrderId}'`);
      }

      // Validate appointment & salon ownership relationship
      const appointment = await tx.appointment.findFirst({
        where: { id: payment.appointmentId, salonId: payment.salonId },
      });

      if (!appointment) {
        throw new ForbiddenException('Cross-salon payment manipulation detected: appointment does not match salon ownership');
      }

      // IDEMPOTENCY CHECK: If already confirmed / captured
      if (payment.status === 'SUCCESS' || payment.status === 'CAPTURED') {
        return { received: true, idempotent: true, status: payment.status };
      }

      // Handle Failure Events
      if (event === 'payment.failed' || paymentStatus === 'failed') {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            providerPaymentId: providerPaymentId || payment.providerPaymentId,
          },
        });

        await tx.appointment.update({
          where: { id: payment.appointmentId },
          data: { status: 'PAYMENT_FAILED' },
        });

        return { received: true, status: 'FAILED' };
      }

      // Handle Success Events (payment.captured, order.paid, or captured entity status)
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          providerPaymentId: providerPaymentId || payment.providerPaymentId,
        },
      });

      // Confirm Booking Transactionally
      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: 'CONFIRMED' },
      });

      // Schedule Confirmation Notification Event
      await this.notifications.scheduleEvent(tx, payment.salonId, 'BOOKING_CONFIRMED', {
        appointmentId: payment.appointmentId,
        paymentId: payment.id,
      });

      return { received: true, status: 'SUCCESS' };
    });
  }
}
