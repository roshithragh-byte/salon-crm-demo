import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export const CANONICAL_JWT_ISSUER = 'pilotwave-salon-auth';
export const CANONICAL_JWT_AUDIENCE = 'pilotwave-salon-api';
export const CANONICAL_JWT_ALGORITHM = 'HS256';

export interface PilotWaveJwtPayload {
  id?: string;
  sub?: string;
  email?: string;
  role: string;
  salonId: string;
  salonSlug?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable()
export class JwtStrategy {
  private readonly secret: string;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get<string>('NEXTAUTH_SECRET');
    if (!secret || secret.trim() === '' || secret === 'default-secret' || secret === 'salondebea-auth-secret-change-in-production') {
      throw new Error('FATAL: NEXTAUTH_SECRET is not securely configured. Fallback and default secrets are strictly prohibited.');
    }
    this.secret = secret.trim();
  }

  async verify(token: string): Promise<PilotWaveJwtPayload> {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Token must be a non-empty string');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Malformed JWT token structure');
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Verify Header & Algorithm
    let header: { alg?: string; typ?: string };
    try {
      header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    } catch {
      throw new UnauthorizedException('Invalid JWT header encoding');
    }

    if (header.alg !== CANONICAL_JWT_ALGORITHM) {
      throw new UnauthorizedException(`Unsupported algorithm: Expected ${CANONICAL_JWT_ALGORITHM}, got ${header.alg}`);
    }

    // 2. Verify Cryptographic Signature
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    const expectedBuf = Buffer.from(expectedSignature);
    const actualBuf = Buffer.from(signatureB64);

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      throw new UnauthorizedException('Invalid or forged JWT signature');
    }

    // 3. Decode & Verify Payload Claims
    let payload: PilotWaveJwtPayload;
    try {
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    } catch {
      throw new UnauthorizedException('Invalid JWT payload encoding');
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new UnauthorizedException('Token has expired');
    }

    if (payload.iss && payload.iss !== CANONICAL_JWT_ISSUER) {
      throw new UnauthorizedException(`Invalid issuer: Expected ${CANONICAL_JWT_ISSUER}, got ${payload.iss}`);
    }

    if (payload.aud && payload.aud !== CANONICAL_JWT_AUDIENCE) {
      throw new UnauthorizedException(`Invalid audience: Expected ${CANONICAL_JWT_AUDIENCE}, got ${payload.aud}`);
    }

    const role = payload.role;
    const salonId = payload.salonId;
    const id = payload.id || payload.sub;

    if (!role || !salonId || !id) {
      throw new UnauthorizedException('JWT is missing required claims (role, salonId, id/sub)');
    }

    return payload;
  }
}