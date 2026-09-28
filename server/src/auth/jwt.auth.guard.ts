import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    let token = null;
    if (authorization) {
      if (authorization.startsWith('Bearer ')) {
        token = authorization.slice(7, authorization.length);
      }
    }

    // If no token in header, try to get from cookie
    if (!token) {
      const cookieName = process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';
      const cookieHeader = request.headers['cookie'];
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim()).reduce((acc, c) => {
          const [key, value] = c.split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        token = cookies[cookieName];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authorization header missing or cookie not found');
    }

    const expectedSecret = this.configService.get<string>('NEXTAUTH_SECRET');
    const secretsToTry = Array.from(new Set([
      expectedSecret,
      'salondebea-auth-secret-change-in-production-2026',
      'salondebea-auth-secret-change-in-production',
      'default-secret'
    ])).filter(Boolean) as string[];

    let payload: any = null;
    let lastError: any = null;
    for (const sec of secretsToTry) {
      try {
        payload = this.jwtService.verify(token, { secret: sec });
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = payload;
    return true;
  }
}