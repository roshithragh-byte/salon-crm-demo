import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: 'default-secret',
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, JwtStrategy, AuthService],
  exports: [JwtAuthGuard, JwtStrategy, AuthService, JwtModule],
})
export class AuthModule {}
