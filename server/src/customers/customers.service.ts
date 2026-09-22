import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSalon(salonId: string) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');
    return salon;
  }

  async getCustomers(salonId: string) {
    const salon = await this.getSalon(salonId);
    const customers = await this.prisma.client.customer.findMany({
      where: { salonId: salon.id },
      orderBy: { createdAt: 'desc' }
    });
    return { data: customers };
  }

  async getCustomer(salonId: string, customerId: string) {
    const salon = await this.getSalon(salonId);
    const customer = await this.prisma.client.customer.findFirst({
      where: { id: customerId, salonId: salon.id },
      include: {
        appointments: { orderBy: { startsAt: 'desc' }, take: 5 },
        loyaltyTransactions: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return { data: customer };
  }

  async updateCustomer(salonId: string, customerId: string, data: any) {
    const salon = await this.getSalon(salonId);
    const customer = await this.prisma.client.customer.findFirst({
      where: { id: customerId, salonId: salon.id }
    });
    if (!customer) throw new NotFoundException('Customer not found');

    const updated = await this.prisma.client.customer.update({
      where: { id: customer.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        notes: data.notes,
      }
    });
    
    return { data: updated };
  }
}
