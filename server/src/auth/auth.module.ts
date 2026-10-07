import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.auth.guard';
import { RolesGuard } from './roles.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('NEXTAUTH_SECRET');
        if (!secret) {
          throw new Error('NEXTAUTH_SECRET is required to initialize JwtModule');
        }
        return {
          secret,
          signOptions: {
            algorithm: 'HS256',
            issuer: 'pilotwave-salon-auth',
            audience: 'pilotwave-salon-api',
            expiresIn: '24h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, RolesGuard, JwtStrategy, AuthService],
  exports: [JwtAuthGuard, RolesGuard, JwtStrategy, AuthService, JwtModule],
})
export class AuthModule {}
