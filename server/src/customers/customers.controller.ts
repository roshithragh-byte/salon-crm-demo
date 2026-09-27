import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('salons/:salonId/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OWNER')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(@Param('salonId') salonId: string) {
    return this.customersService.getCustomers(salonId);
  }

  @Get(':customerId')
  async getCustomer(
    @Param('salonId') salonId: string,
    @Param('customerId') customerId: string
  ) {
    return this.customersService.getCustomer(salonId, customerId);
  }

  @Patch(':customerId')
  async updateCustomer(
    @Param('salonId') salonId: string,
    @Param('customerId') customerId: string,
    @Body() body: any
  ) {
    return this.customersService.updateCustomer(salonId, customerId, body);
  }
}