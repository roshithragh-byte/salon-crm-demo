import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TypeSafeService } from '../typesafe/typesafe.service';
import { matchBestStaff } from '../typesafe/staff-matcher';
import { detectSemanticConflict } from '../typesafe/conflict-detector';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly typeSafe: TypeSafeService,
  ) {}

  async createBooking(salonId: string, body: any, idempotencyKey?: string) {
    // Determine the actual salon ID if salonId is a slug
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    const { serviceId, stylistId, startsAt, customerName, customerPhone, customerEmail, notes } = body;
    if (!serviceId) throw new BadRequestException('serviceId is required');
    if (!startsAt || isNaN(new Date(startsAt).getTime())) throw new BadRequestException('Valid startsAt date is required');
    if (!customerName) throw new BadRequestException('customerName is required');
    if (!customerPhone) throw new BadRequestException('customerPhone is required');
    const start = new Date(startsAt);

    // Fetch the service to get duration and price
    const service = await this.prisma.client.service.findUnique({
      where: { id: serviceId }
    });

    if (!service || service.salonId !== salon.id) {
      throw new NotFoundException('Service not found');
    }

    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    // Validate semantic conflicts in booking notes if provided
    if (notes && notes.trim().length >= 5) {
      const conflict = await detectSemanticConflict(this.typeSafe, notes, start, service.name);
      if (conflict.isConflict) {
        throw new BadRequestException({
          code: 'SEMANTIC_CONFLICT',
          message: 'The booking notes conflict with the selected appointment schedule. Please verify your requested time.',
        });
      }
    }

    // Find staff ID
    let finalStaffId = stylistId;
    if (!finalStaffId) {
       // Query available staff members for this service
       const staffServices = await this.prisma.client.staffService.findMany({
         where: { serviceId },
         include: {
           staffMember: {
             include: {
               user: true,
               appointments: { where: { serviceId } },
             },
           },
         },
       });
       if (!staffServices || staffServices.length === 0) {
         throw new ConflictException('No staff available for this service');
       }

       if (staffServices.length === 1) {
         finalStaffId = staffServices[0].staffMemberId;
       } else {
         const candidates = staffServices.map((s) => ({
           staffMemberId: s.staffMemberId,
           displayName: [s.staffMember.user.firstName, s.staffMember.user.lastName].filter(Boolean).join(' ') || 'Staff Stylist',
           appointmentsForService: s.staffMember.appointments?.length || 0,
           totalServices: 1,
           isActive: s.staffMember.isActive ?? true,
         }));
         const ranked = await matchBestStaff(
           this.typeSafe,
           candidates,
           service.name,
           service.description || undefined,
         );
         finalStaffId = ranked[0]?.staffMemberId || staffServices[0].staffMemberId;
       }
    }

    // --- IDEMPOTENCY & CONCURRENCY PROTECTION ---
    if (idempotencyKey) {
      const existing = await this.prisma.client.appointment.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        // Validate request parameters match the existing appointment
        const isSameSalon = existing.salonId === salon.id;
        const isSameService = existing.serviceId === serviceId;
        const isSameCustomer = existing.customerPhone === customerPhone;
        const isSameTime = new Date(existing.startsAt).getTime() === start.getTime();

        if (!isSameSalon || !isSameService || !isSameCustomer || !isSameTime) {
          throw new ConflictException({
            code: 'IDEMPOTENCY_CONFLICT',
            message: 'Idempotency key has already been used with different booking parameters',
          });
        }
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
