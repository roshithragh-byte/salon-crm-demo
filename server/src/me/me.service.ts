import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string, jwtUser: any) {
    if (!userId) {
      throw new NotFoundException('User ID not found in token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        salonMembers: {
          include: { salon: true }
        },
        customers: {
          include: { salon: true }
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
      },
      roles: jwtUser.roles || [],
      salonMembers: user.salonMembers,
      customerProfiles: user.customers,
    };
  }

  async updateProfile(userId: string, data: any) {
    if (!userId) {
      throw new NotFoundException('User ID not found in token');
    }

    // Only allow updating safe fields
    const safeData: any = {};
    if (data.firstName !== undefined) safeData.firstName = data.firstName;
    if (data.lastName !== undefined) safeData.lastName = data.lastName;
    if (data.phoneNumber !== undefined) safeData.phoneNumber = data.phoneNumber;

    if (Object.keys(safeData).length === 0) {
      return { success: true, message: 'No fields to update' };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: safeData,
    });

    // Create Audit Log
    await this.prisma.auditLog.create({
      data: {
        userId: userId,
        action: 'UPDATE_PROFILE',
        targetResource: 'User',
        targetId: userId,
        details: safeData,
      }
    });

    return { success: true, user: updatedUser };
  }

  async getAppointments(userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID not found in token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        salonMembers: true,
        customers: true,
      }
    });

    if (!user) throw new NotFoundException('User not found');

    const customerIds = user.customers.map((c: any) => c.id);
    const staffIds = user.salonMembers.map((m: any) => m.id);

    const now = new Date();

    const appointments = await this.prisma.appointment.findMany({
      where: {
        OR: [
          { customerId: { in: customerIds.length ? customerIds : ['__none__'] } },
          { staffId: { in: staffIds.length ? staffIds : ['__none__'] } }
        ]
      },
      include: {
        service: true,
        staff: {
          include: { user: true }
        },
        customer: true,
        salon: true
      },
      orderBy: { startsAt: 'asc' }
    });

    const upcoming = appointments.filter((a: any) => a.startsAt >= now);
    const history = appointments.filter((a: any) => a.startsAt < now);

    return { upcoming, history };
  }
}
