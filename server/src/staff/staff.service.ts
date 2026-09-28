import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async createStaff(salonId: string, data: any) {
    const salon = await this.prisma.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');
    const actualSalonId = salon.id;

    const { email, firstName, lastName, password, role = 'STAFF' } = data;
    
    // Check if user exists
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      const passwordHash = await argon2.hash(password);
      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash,
          isActive: true,
        },
      });
    }

    // Check if already a member of this salon
    const existingMember = await this.prisma.salonMember.findUnique({
      where: { salonId_userId: { salonId: actualSalonId, userId: user.id } },
    });

    if (existingMember) {
      throw new ConflictException('User is already a staff member of this salon');
    }

    const member = await this.prisma.salonMember.create({
      data: {
        salonId: actualSalonId,
        userId: user.id,
        role: role as Role,
        isActive: true,
      },
    });

    return { data: member };
  }

  async setStaffStatus(salonId: string, staffId: string, isActive: boolean) {
    const salon = await this.prisma.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] }
    });
    if (!salon) throw new NotFoundException('Salon not found');
    const actualSalonId = salon.id;

    const member = await this.prisma.salonMember.findUnique({
      where: { id: staffId },
    });

    if (!member || member.salonId !== actualSalonId) {
      throw new NotFoundException('Staff member not found');
    }

    const updated = await this.prisma.salonMember.update({
      where: { id: staffId },
      data: { isActive },
    });

    return { data: updated };
  }
}
