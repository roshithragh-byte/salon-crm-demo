import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('salons/:salonId/busy')
export class BusyController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Guarded by X-Integration-Key (checked in the service); not JWT.
  @Get()
  async getBusy(
    @Param('salonId') salonId: string,
    @Query('date') date: string,
    @Headers('x-integration-key') integrationKey: string,
  ) {
    return this.bookingsService.getBusy(salonId, date, integrationKey);
  }
}
