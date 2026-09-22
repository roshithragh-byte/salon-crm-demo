import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService, CreateBookingDto } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('salons/:salonId/bookings')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @Param('salonId') salonId: string,
    @Body() createBookingDto: CreateBookingDto
  ) {
    return this.appointmentsService.create(salonId, createBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Param('salonId') salonId: string,
    @Query('date') date?: string
  ) {
    return this.appointmentsService.findAll(salonId, date);
  }
}
