import { Controller, Post, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('salons/:salonId/bookings/:bookingId/payment')
  async createPayment(
    @Param('salonId') salonId: string,
    @Param('bookingId') bookingId: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.createPaymentOrder(salonId, bookingId, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleWebhook(provider, payload);
  }
}