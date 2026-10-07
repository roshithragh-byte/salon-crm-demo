import { JwtStrategy, CANONICAL_JWT_ISSUER, CANONICAL_JWT_AUDIENCE, CANONICAL_JWT_ALGORITHM } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';

describe('Phase 1 — P0 Authentication & Security Hardening Matrix', () => {
  const VALID_SECRET = 'valid-test-secret-at-least-32-chars-long-2026';
  let configService: ConfigService;
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    configService = new ConfigService({
      NEXTAUTH_SECRET: VALID_SECRET,
    });
    jwtStrategy = new JwtStrategy(configService);
  });

  function createTestToken(
    payload: Record<string, any>,
    secret: string = VALID_SECRET,
    options: {
      issuer?: string;
      audience?: string;
      expiresInSeconds?: number;
      algorithm?: string;
    } = {}
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (options.expiresInSeconds !== undefined ? options.expiresInSeconds : 3600);

    const fullPayload: Record<string, any> = {
      iss: options.issuer !== undefined ? options.issuer : CANONICAL_JWT_ISSUER,
      aud: options.audience !== undefined ? options.audience : CANONICAL_JWT_AUDIENCE,
      iat: now,
      exp: exp,
      ...payload,
    };

    const header = {
      alg: options.algorithm || CANONICAL_JWT_ALGORITHM,
      typ: 'JWT',
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  // 1. Missing or Default Production Secret
  it('TASK 5: Rejects instantiation when NEXTAUTH_SECRET is empty or using insecure default', () => {
    const insecureConfig = new ConfigService({ NEXTAUTH_SECRET: 'default-secret' });
    expect(() => new JwtStrategy(insecureConfig)).toThrow('FATAL: NEXTAUTH_SECRET is not securely configured');
  });

  // 2. Valid Token Accepted
  it('GATE: Accepts valid token matching canonical issuer, audience, and required claims', async () => {
    const validToken = createTestToken({
      id: 'user-123',
      email: 'admin@salondebea.com',
      role: 'OWNER',
      salonId: 'salon-hq-uuid',
      salonSlug: 'hq',
    });

    const verified = await jwtStrategy.verify(validToken);
    expect(verified.id).toBe('user-123');
    expect(verified.role).toBe('OWNER');
    expect(verified.salonId).toBe('salon-hq-uuid');
    expect(verified.iss).toBe(CANONICAL_JWT_ISSUER);
    expect(verified.aud).toBe(CANONICAL_JWT_AUDIENCE);
  });

  // 3. Forged Token (Wrong Secret)
  it('TASK 9 & GATE: Rejects forged OWNER token signed with attacker secret with UnauthorizedException (401)', async () => {
    const forgedToken = createTestToken(
      {
        id: 'attacker-id',
        email: 'attacker@evil.com',
        role: 'OWNER',
        salonId: 'salon-hq-uuid',
      },
      'attacker-private-secret-key-32-chars-long'
    );

    await expect(jwtStrategy.verify(forgedToken)).rejects.toThrow(UnauthorizedException);
  });

  // 4. Old Fallback Secrets Rejected
  it('TASK 15 & GATE: Rejects token signed with legacy fallback secrets ("default-secret", "salondebea-auth-secret-change-in-production")', async () => {
    const legacyToken1 = createTestToken(
      { id: 'user-1', email: 'u@s.com', role: 'ADMIN', salonId: 'hq' },
      'default-secret'
    );
    const legacyToken2 = createTestToken(
      { id: 'user-2', email: 'u@s.com', role: 'OWNER', salonId: 'hq' },
      'salondebea-auth-secret-change-in-production'
    );

    await expect(jwtStrategy.verify(legacyToken1)).rejects.toThrow(UnauthorizedException);
    await expect(jwtStrategy.verify(legacyToken2)).rejects.toThrow(UnauthorizedException);
  });

  // 5. Expired Token
  it('TASK 11: Rejects expired token with UnauthorizedException (401)', async () => {
    const expiredToken = createTestToken(
      { id: 'user-1', email: 'u@s.com', role: 'ADMIN', salonId: 'hq' },
      VALID_SECRET,
      { expiresInSeconds: -60 }
    );

    await expect(jwtStrategy.verify(expiredToken)).rejects.toThrow(UnauthorizedException);
  });

  // 6. Wrong Issuer
  it('TASK 12: Rejects token with invalid issuer (iss)', async () => {
    const badIssuerToken = createTestToken(
      { id: 'user-1', email: 'u@s.com', role: 'ADMIN', salonId: 'hq' },
      VALID_SECRET,
      { issuer: 'untrusted-auth-server' }
    );

    await expect(jwtStrategy.verify(badIssuerToken)).rejects.toThrow(UnauthorizedException);
  });

  // 7. Wrong Audience
  it('TASK 13: Rejects token with invalid audience (aud)', async () => {
    const badAudToken = createTestToken(
      { id: 'user-1', email: 'u@s.com', role: 'ADMIN', salonId: 'hq' },
      VALID_SECRET,
      { audience: 'untrusted-api-service' }
    );

    await expect(jwtStrategy.verify(badAudToken)).rejects.toThrow(UnauthorizedException);
  });

  // 8. Wrong Signing Algorithm
  it('TASK 14: Rejects token with unsupported algorithm (e.g. none or RS256)', async () => {
    const badAlgToken = createTestToken(
      { id: 'user-1', email: 'u@s.com', role: 'ADMIN', salonId: 'hq' },
      VALID_SECRET,
      { algorithm: 'RS256' }
    );

    await expect(jwtStrategy.verify(badAlgToken)).rejects.toThrow('Unsupported algorithm');
  });

  // 9. Missing Required Claims
  it('TASK 4: Rejects token missing required claims (missing salonId or role)', async () => {
    const missingClaimsToken = createTestToken(
      { id: 'user-1', email: 'u@s.com' }, // missing role and salonId
      VALID_SECRET
    );

    await expect(jwtStrategy.verify(missingClaimsToken)).rejects.toThrow(
      'JWT is missing required claims (role, salonId, id/sub)'
    );
  });

  // 10. RolesGuard Role Authorization
  describe('RolesGuard & Tenant Ownership Isolation', () => {
    let rolesGuard: RolesGuard;
    let mockReflector: jest.Mocked<Reflector>;
    let mockPrisma: any;

    beforeEach(() => {
      mockReflector = {
        getAllAndOverride: jest.fn(),
      } as any;

      mockPrisma = {
        client: {
          salon: {
            findFirst: jest.fn(),
          },
        },
      };

      rolesGuard = new RolesGuard(mockReflector, mockPrisma);
    });

    it('TASK 7: Validates required role and grants access when role matches', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.OWNER]);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 'u1', role: 'OWNER', salonId: 'salon-1' },
            params: {},
          }),
        }),
      };

      const canActivate = await rolesGuard.canActivate(mockContext);
      expect(canActivate).toBe(true);
    });

    it('TASK 7 & GATE: Rejects request with insufficient role (e.g. STYLIST accessing OWNER route) with ForbiddenException (403)', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.OWNER]);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 'u1', role: 'STYLIST', salonId: 'salon-1' },
            params: {},
          }),
        }),
      };

      await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
    });

    it('TASK 8, 10 & GATE: Rejects cross-salon tenant access when user.salonId !== params.salonId with ForbiddenException (403)', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.OWNER]);
      mockPrisma.client.salon.findFirst.mockResolvedValue({ id: 'salon-other-uuid', slug: 'other-salon' });

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 'u1', role: 'OWNER', salonId: 'salon-1-uuid', salonSlug: 'salon-1' },
            params: { salonId: 'other-salon' },
          }),
        }),
      };

      await expect(rolesGuard.canActivate(mockContext)).rejects.toThrow('Cross-salon access forbidden');
    });

    it('TASK 8: Accepts salon access when params.salonId matches user.salonSlug or user.salonId', async () => {
      mockReflector.getAllAndOverride.mockReturnValue([Role.OWNER]);

      const mockContext: any = {
        getHandler: () => {},
        getClass: () => {},
        switchToHttp: () => ({
          getRequest: () => ({
            user: { id: 'u1', role: 'OWNER', salonId: 'salon-hq-uuid', salonSlug: 'hq' },
            params: { salonId: 'hq' },
          }),
        }),
      };

      const canActivate = await rolesGuard.canActivate(mockContext);
      expect(canActivate).toBe(true);
    });
  });
});
