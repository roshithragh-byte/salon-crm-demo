import { Controller, Get, Param, Post, Body, BadRequestException, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

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
}