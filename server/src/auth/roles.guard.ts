import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // 1. Role Authorization Check
    if (requiredRoles && requiredRoles.length > 0) {
      if (!user.role) {
        throw new ForbiddenException('User role not found');
      }

      const hasRole = requiredRoles.includes(user.role as Role);
      if (!hasRole) {
        throw new ForbiddenException(`Insufficient permissions: Requires [${requiredRoles.join(', ')}], found ${user.role}`);
      }
    }

    // 2. Cross-Tenant / Salon Isolation Check
    const params = request.params;
    if (params && params.salonId) {
      const targetSalon = params.salonId;

      // Fast match: Direct equality against token claims
      if (user.salonId === targetSalon || (user.salonSlug && user.salonSlug === targetSalon)) {
        return true;
      }

      // Database resolution: check if targetSalon slug or UUID belongs to the authenticated user's salon
      const salon = await this.prisma.client.salon.findFirst({
        where: { OR: [{ id: targetSalon }, { slug: targetSalon }] },
        select: { id: true, slug: true }
      });

      if (!salon || salon.id !== user.salonId) {
        throw new ForbiddenException(`Cross-salon access forbidden: Token salonId '${user.salonId}' is not authorized for target salon '${targetSalon}'`);
      }
    }

    return true;
  }
}
