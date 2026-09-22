import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationsService) {}

  async createBooking(salonId: string, body: any, idempotencyKey?: string) {
    // Determine the actual salon ID if salonId is a slug
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    const { serviceId, stylistId, startsAt, customerName, customerPhone, customerEmail, notes } = body;
    const start = new Date(startsAt);

    // Fetch the service to get duration and price
    const service = await this.prisma.client.service.findUnique({
      where: { id: serviceId }
    });

    if (!service || service.salonId !== salon.id) {
      throw new NotFoundException('Service not found');
    }

    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    // Find staff ID
    let finalStaffId = stylistId;
    if (!finalStaffId) {
       // If no stylist chosen, find one that provides this service and is free
       // For simplicity in this demo, just pick the first available staff member
       const staffService = await this.prisma.client.staffService.findFirst({
         where: { serviceId }
       });
       if (!staffService) throw new ConflictException('No staff available for this service');
       finalStaffId = staffService.staffMemberId;
    }

    // --- CONCURRENCY PROTECTION ---
    // We execute this in an interactive transaction to ensure no overlapping bookings
    // Handle Idempotency
    if (idempotencyKey) {
      const existing = await this.prisma.client.appointment.findUnique({
        where: { idempotencyKey }
      });
      if (existing) {
        return { data: existing };
      }
    }

    return await this.prisma.client.$transaction(async (tx) => {
      // 0. Find or create Customer CRM profile
      let customer = await tx.customer.findUnique({
        where: { salonId_phoneNumber: { salonId: salon.id, phoneNumber: customerPhone } }
      });
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            salonId: salon.id,
            firstName: customerName.split(' ')[0] || customerName,
            lastName: customerName.split(' ').slice(1).join(' ') || undefined,
            phoneNumber: customerPhone,
            email: customerEmail,
          }
        });
      }

      // 1. Check existing overlapping appointments for this staff
      const overlapping = await tx.appointment.findFirst({
        where: {
          salonId: salon.id,
          staffId: finalStaffId,
          status: { not: 'CANCELLED' },
          startsAt: { lt: end },
          endsAt: { gt: start },
        }
      });

      if (overlapping) {
        throw new ConflictException({
          code: "SLOT_UNAVAILABLE",
          message: "The selected appointment time is no longer available.",
          details: null
        });
      }

      // 2. Create the appointment
      const appointment = await tx.appointment.create({
        data: {
          salonId: salon.id,
          customerId: customer.id,
          customerName,
          customerPhone,
          customerEmail,
          serviceId,
          staffId: finalStaffId,
          startsAt: start,
          endsAt: end,
          notes,
          status: 'PENDING',
          idempotencyKey,
          consent: true,
          totalValue: service.basePrice,
          finalRevenue: service.basePrice,
        }
      });

            await this.notifications.scheduleEvent(tx, salon.id, 'BOOKING_CREATED', {
        appointmentId: appointment.id,
        customerName: appointment.customerName,
        startsAt: appointment.startsAt
      });
      return { data: appointment };
    });
  }

  async cancelBooking(salonId: string, bookingId: string) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    const appointment = await this.prisma.client.appointment.findFirst({
      where: { id: bookingId, salonId: salon.id }
    });

    if (!appointment) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.client.appointment.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });

    await this.prisma.client.$transaction(async (tx) => {
      await this.notifications.scheduleEvent(tx, salon.id, 'BOOKING_CANCELLED', {
        appointmentId: bookingId
      });
    });

    return { data: updated };
  }

  async completeBooking(salonId: string, bookingId: string) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    const appointment = await this.prisma.client.appointment.findFirst({
      where: { id: bookingId, salonId: salon.id },
      include: { customer: true }
    });

    if (!appointment) throw new NotFoundException('Booking not found');
    if (appointment.status === 'COMPLETED') return { data: appointment };

    return await this.prisma.client.$transaction(async (tx) => {
      // Complete booking
      const updated = await tx.appointment.update({
        where: { id: bookingId },
        data: { status: 'COMPLETED' }
      });

      if (appointment.customerId) {
        // Calculate loyalty points (10% of revenue)
        const earnedPoints = Math.floor((appointment.finalRevenue || 0) * 0.10);

        // Update customer CRM
        await tx.customer.update({
          where: { id: appointment.customerId },
          data: {
            visitCount: { increment: 1 },
            loyaltyPoints: { increment: earnedPoints }
          }
        });

        // Record loyalty ledger transaction
        if (earnedPoints > 0) {
          await tx.loyaltyTransaction.create({
            data: {
              salonId: salon.id,
              customerId: appointment.customerId,
              bookingId: appointment.id,
              type: 'EARN',
              points: earnedPoints,
              description: `Earned points from booking ${appointment.id}`
            }
          });
        }
      }

      return { data: updated };
    });
  }
}
