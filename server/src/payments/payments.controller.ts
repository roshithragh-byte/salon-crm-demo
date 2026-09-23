import { Controller, Post, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Removed JwtAuthGuard to allow customers to initialize payments
  @Post('salons/:salonId/bookings/:bookingId/payment')
  async createPayment(
    @Param('salonId') salonId: string,
    @Param('bookingId') bookingId: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.createPaymentOrder(salonId, bookingId, idempotencyKey);
  }

  // Removed JwtAuthGuard to allow webhooks to hit it anonymously
  @Post('payments/webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
  ) {
    return this.paymentsService.handleWebhook(provider, payload);
  }
}
