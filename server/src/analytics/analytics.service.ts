import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(salonId: string) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');

    // 1. Total Revenue (from COMPLETED bookings)
    const revenueResult = await this.prisma.client.appointment.aggregate({
      where: { salonId: salon.id, status: 'COMPLETED' },
      _sum: { finalRevenue: true }
    });
    const totalRevenue = revenueResult._sum.finalRevenue || 0;

    // 2. Total Bookings
    const totalBookings = await this.prisma.client.appointment.count({
      where: { salonId: salon.id }
    });

    // 3. Upcoming Appointments
    const upcomingAppointments = await this.prisma.client.appointment.findMany({
      where: { 
        salonId: salon.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startsAt: { gte: new Date() }
      },
      orderBy: { startsAt: 'asc' },
      take: 5
    });

    // 4. Top Services
    const serviceCounts = await this.prisma.client.appointment.groupBy({
      by: ['serviceId'],
      where: { salonId: salon.id },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 3
    });

    // Resolve service names
    const topServices = await Promise.all(serviceCounts.map(async (sc) => {
      const s = await this.prisma.client.service.findUnique({ where: { id: sc.serviceId }});
      return {
        name: s?.name || 'Unknown Service',
        count: sc._count.id
      };
    }));

    return {
      data: {
        totalRevenue,
        totalBookings,
        upcomingAppointments,
        topServices
      }
    };
  }
}
