import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateBookingDto {
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  stylistId?: string;
  startsAt: string;
  notes?: string;
  status?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(salonId: string, data: CreateBookingDto) {
    if (!salonId) throw new BadRequestException('salonId is required');
    if (!data.customerName) throw new BadRequestException('customerName is required');
    if (!data.customerPhone) throw new BadRequestException('customerPhone is required');
    if (!data.serviceId) throw new BadRequestException('serviceId is required');
    if (!data.startsAt || isNaN(new Date(data.startsAt).getTime())) throw new BadRequestException('Valid startsAt date is required');

    // Fetch the service to calculate endsAt based on durationMinutes
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const start = new Date(data.startsAt);
    const end = new Date(start.getTime() + service.durationMinutes * 60000); // 1 minute = 60000 ms

    try {
      return await this.prisma.appointment.create({
        data: {
          salonId: salonId,
          customerId: data.customerId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          serviceId: data.serviceId,
          staffId: data.stylistId, // map stylistId to staffId
          startsAt: start,
          endsAt: end, // calculated automatically
          notes: data.notes,
          status: data.status,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create booking: ' + error.message);
    }
  }

  async findAll(salonId: string, date?: string) {
    const whereClause: any = { salonId };

    if (date) {
      const startDate = new Date(date);
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.startsAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    try {
      return await this.prisma.appointment.findMany({
        where: whereClause,
        include: {
          customer: true,
          service: true,
          staff: {
            include: {
              user: true
            }
          },
          salon: true
        },
        orderBy: {
          startsAt: 'asc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch bookings: ' + error.message);
    }
  }
}
