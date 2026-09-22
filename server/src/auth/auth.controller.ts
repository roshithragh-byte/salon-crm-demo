import { Controller, Post, Body, UnauthorizedException, HttpCode, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Post('verify')
  @HttpCode(200)
  async verifyCredentials(@Body() credentials: any) {
    // Validate required fields
    if (!credentials.email || !credentials.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.authService.verifyCredentials(
      credentials.email,
      credentials.password
    );

    return { user };
  }
}