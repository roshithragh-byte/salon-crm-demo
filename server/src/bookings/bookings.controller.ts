import { Controller, Post, Body, Param, Patch, Headers, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('salons/:salonId/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Removed JwtAuthGuard to allow customers to book
  @Post()
  async createBooking(
    @Param('salonId') salonId: string,
    @Body() body: any,
    @Headers('idempotency-key') idempotencyKey: string
  ) {
    return this.bookingsService.createBooking(salonId, body, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':bookingId/cancel')
  async cancelBooking(
    @Param('salonId') salonId: string,
    @Param('bookingId') bookingId: string
  ) {
    return this.bookingsService.cancelBooking(salonId, bookingId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':bookingId/complete')
  async completeBooking(
    @Param('salonId') salonId: string,
    @Param('bookingId') bookingId: string
  ) {
    return this.bookingsService.completeBooking(salonId, bookingId);
  }
}
