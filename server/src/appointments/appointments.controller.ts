import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService, CreateBookingDto } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('salons/:salonId/bookings')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'STAFF', 'STYLIST')
  @Get()
  async findAll(
    @Param('salonId') salonId: string,
    @Query('date') date?: string
  ) {
    return this.appointmentsService.findAll(salonId, date);
  }
}
