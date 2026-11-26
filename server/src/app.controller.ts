import { Controller, Get, Param, Post, Body, BadRequestException, HttpCode, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}


  private async resolveSalonId(salonId: string): Promise<string | null> {
    if (salonId === 'default-salon-id') {
      const salon = await this.prisma.salon.findFirst({ where: { slug: 'hq' } })
        ?? await this.prisma.salon.findFirst();
      return salon?.id ?? null;
    }
    const salon = await this.prisma.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] },
    });
    return salon?.id ?? null;
  }

  @Get('health')
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }

  @Get('salons/:salonId/services')
  async getServices(@Param('salonId') salonId: string) {
    const actualSalonId = await this.resolveSalonId(salonId);
    if (!actualSalonId) return { data: [] };
    const services = await this.prisma.service.findMany({
      where: { isActive: true, salonId: actualSalonId },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, durationMinutes: true, basePrice: true, offerPrice: true },
    });
    return { data: services };
  }

  @Get('salons/:salonId/staff')
  async getStaff(@Param('salonId') salonId: string) {
    const actualSalonId = await this.resolveSalonId(salonId);
    if (!actualSalonId) return { data: [] };
    const members = await this.prisma.salonMember.findMany({
      where: { isActive: true, salonId: actualSalonId },
      select: { id: true, user: { select: { firstName: true, lastName: true } } },
    });
    return { data: members.map(m => ({ id: m.id, name: `${m.user.firstName} ${m.user.lastName}`.trim() })) };
  }

  @Post('subscribe')
  @HttpCode(200)
  async subscribe(@Body() body: { email: string }) {
    const email = (body.email || '').trim();
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!email || !emailRe.test(email)) {
      throw new BadRequestException('Invalid email');
    }
    const existing = await this.prisma.subscription.findUnique({ where: { email } });
    if (existing) {
      return { success: true, alreadySubscribed: true };
    }
    await this.prisma.subscription.create({ data: { email } });
    return { success: true };
  }

  @Get('home')
  async getHomeData() {
    const [packages, standardServices, reviews] = await Promise.all([
      this.prisma.service.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "desc" },
        take: 3,
        select: { id: true, name: true, description: true, basePrice: true, durationMinutes: true },
      }),
      this.prisma.service.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        take: 6,
        select: { id: true, name: true, description: true, basePrice: true, durationMinutes: true },
      }),
      this.prisma.review.findMany({
        where: { verified: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, authorName: true, rating: true, content: true, source: true, verified: true, createdAt: true, updatedAt: true },
      }),
    ]);
    return { data: { packages, standardServices, reviews } };
  }

  @Get('salons/:salonId/services/:serviceId')
  async getServiceOld(@Param('salonId') salonId: string, @Param('serviceId') serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId, salonId: salonId }
    });
    if (!service) {
      throw new BadRequestException('Service not found for this salon');
    }
    return { data: service };
  }

  @Get('services/:serviceId')
  async getService(@Param('serviceId') serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: true,
        addonsAsBase: {
          include: {
            addonService: true
          }
        }
      }
    });
    if (!service) {
      throw new BadRequestException('Service not found');
    }
    return { data: service };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  @Post('admin/reset-database')
  @HttpCode(200)
  async resetDatabaseData() {
    return await this.prisma.$transaction(async (tx) => {
      // Delete transactional tables in foreign-key dependency order
      const deletedPayments = await tx.payment.deleteMany({});
      const deletedLoyalty = await tx.loyaltyTransaction.deleteMany({});
      const deletedAppointments = await tx.appointment.deleteMany({});
      const deletedCustomers = await tx.customer.deleteMany({});
      const deletedReviews = await tx.review.deleteMany({});
      const deletedOutbox = await tx.outboxEvent.deleteMany({});
      const deletedSubscriptions = await tx.subscription.deleteMany({});
      const deletedAudits = await tx.auditLog.deleteMany({});

      return {
        success: true,
        message: 'Transactional and customer database records cleared successfully.',
        cleared: {
          payments: deletedPayments.count,
          loyaltyTransactions: deletedLoyalty.count,
          appointments: deletedAppointments.count,
          customers: deletedCustomers.count,
          reviews: deletedReviews.count,
          outboxEvents: deletedOutbox.count,
          subscriptions: deletedSubscriptions.count,
          auditLogs: deletedAudits.count,
        }
      };
    });
  }
}