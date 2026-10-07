import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    let token: string | null = null;
    if (authorization && typeof authorization === 'string') {
      if (authorization.startsWith('Bearer ')) {
        token = authorization.slice(7).trim();
      }
    }

    // Fallback: check session cookie if authorization header is absent
    if (!token) {
      const cookieName = process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';
      const cookieHeader = request.headers['cookie'];
      if (cookieHeader && typeof cookieHeader === 'string') {
        const cookies = cookieHeader.split(';').map(c => c.trim()).reduce((acc, c) => {
          const [key, ...vals] = c.split('=');
          acc[key] = vals.join('=');
          return acc;
        }, {} as Record<string, string>);
        token = cookies[cookieName] || null;
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authorization header missing or cookie not found');
    }

    const payload = await this.jwtStrategy.verify(token);
    request.user = payload;
    return true;
  }
}