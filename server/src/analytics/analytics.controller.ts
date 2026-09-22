import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('salons/:salonId/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardMetrics(@Param('salonId') salonId: string) {
    return this.analyticsService.getDashboardMetrics(salonId);
  }
}