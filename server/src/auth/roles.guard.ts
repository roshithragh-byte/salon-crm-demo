import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
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
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }
    
    // Check if the user has the required role
    const hasRole = requiredRoles.includes(user.role as Role);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    // Check salonId if it's a salon-specific route
    const params = request.params;
    if (params.salonId && user.salonId !== params.salonId) {
      // Resolve IDs and slugs against the database; a token's salonSlug claim
      // must not independently grant tenant access.

      const salon = await this.prisma.client.salon.findFirst({
        where: { OR: [{ id: params.salonId }, { slug: params.salonId }] },
      });

      if (!salon || salon.id !== user.salonId) {
        throw new ForbiddenException('You are not authorized for this salon');
      }
    }
    
    return true;
  }
}
