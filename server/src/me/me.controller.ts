import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { MeService } from './me.service';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('profile')
  getProfile(@Request() req) {
    const userId = req.user?.sub || req.user?.id;
    return this.meService.getProfile(userId, req.user);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() body: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.meService.updateProfile(userId, body);
  }

  @Get('appointments')
  getAppointments(@Request() req) {
    const userId = req.user?.sub || req.user?.id;
    return this.meService.getAppointments(userId);
  }
}
