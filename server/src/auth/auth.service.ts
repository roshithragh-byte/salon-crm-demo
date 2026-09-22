import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { salonMembers: { include: { salon: true } } },
    });
  }

  async verifyCredentials(email: string, passwordHashAttempt: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { salonMembers: { include: { salon: true } } },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isCorrectPassword = await argon2.verify(user.passwordHash, passwordHashAttempt);

    if (!isCorrectPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("User account is inactive");
    }

    const primaryMembership = user.salonMembers.find(m => m.isActive);
    let role = "CUSTOMER";
    let salonId = null;

    if (primaryMembership) {
      role = primaryMembership.role;
      salonId = primaryMembership.salonId;
    }

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role,
      salonId
    };
  }
}
