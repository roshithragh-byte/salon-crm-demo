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

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('NEXTAUTH_SECRET') || 'default-secret',
      });
      console.log('Secret used:', this.configService.get<string>('NEXTAUTH_SECRET') || 'default-secret'); request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}