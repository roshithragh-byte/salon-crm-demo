import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class JwtStrategy {
  constructor(private configService: ConfigService) {}

  async verify(token: string): Promise<JWTPayload> {
    const secret = this.configService.get<string>('NEXTAUTH_SECRET') || 'default-secret';

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: 'next-auth',
    });

    return payload as JWTPayload;
  }
}