import { Controller, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('salons/:salonId/staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async createStaff(
    @Param('salonId') salonId: string,
    @Body() body: any
  ) {
    return this.staffService.createStaff(salonId, body);
  }

  @Patch(':staffId/enable')
  async enableStaff(
    @Param('salonId') salonId: string,
    @Param('staffId') staffId: string
  ) {
    return this.staffService.setStaffStatus(salonId, staffId, true);
  }

  @Patch(':staffId/disable')
  async disableStaff(
    @Param('salonId') salonId: string,
    @Param('staffId') staffId: string
  ) {
    return this.staffService.setStaffStatus(salonId, staffId, false);
  }
}
