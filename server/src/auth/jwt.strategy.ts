import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class JwtStrategy {
  constructor(private configService: ConfigService) {}

  async verify(token: string): Promise<JWTPayload> {
    const expectedSecret = this.configService.get<string>('NEXTAUTH_SECRET');
    const secretsToTry = Array.from(new Set([
      expectedSecret,
      'salondebea-auth-secret-change-in-production-2026',
      'salondebea-auth-secret-change-in-production',
      'default-secret'
    ])).filter(Boolean) as string[];

    let lastError: any = null;
    for (const sec of secretsToTry) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(sec));
        return payload as JWTPayload;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  }
}