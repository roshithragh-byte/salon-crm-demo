import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class JwtStrategy {
  constructor(private configService: ConfigService) {}

  async verify(token: string): Promise<JWTPayload> {
    const expectedSecret = this.configService.get<string>('NEXTAUTH_SECRET');
    if (!expectedSecret) {
      throw new Error('NEXTAUTH_SECRET must be configured before token verification');
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(expectedSecret));
    return payload as JWTPayload;
  }
}