import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('salons/:salonId/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCustomers(@Param('salonId') salonId: string) {
    return this.customersService.getCustomers(salonId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':customerId')
  async getCustomer(
    @Param('salonId') salonId: string,
    @Param('customerId') customerId: string
  ) {
    return this.customersService.getCustomer(salonId, customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':customerId')
  async updateCustomer(
    @Param('salonId') salonId: string,
    @Param('customerId') customerId: string,
    @Body() body: any
  ) {
    return this.customersService.updateCustomer(salonId, customerId, body);
  }
}