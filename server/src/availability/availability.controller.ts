import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('salons/:salonId/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Param('salonId') salonId: string,
    @Query('date') dateString: string,
    @Query('service_id') serviceId: string,
    @Query('stylist_id') stylistId?: string,
  ) {
    if (!dateString || !serviceId) {
      throw new BadRequestException('date and service_id are required');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new BadRequestException('date must be YYYY-MM-DD');
    }

    // Interpret as calendar date (UTC midnight placeholder); service uses Y-M-D in salon TZ
    const targetDate = new Date(`${dateString}T00:00:00.000Z`);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const slots = await this.availabilityService.calculateAvailability(
      salonId,
      targetDate,
      serviceId,
      stylistId,
    );

    return {
      data: {
        date: dateString,
        slots,
      },
    };
  }
}
