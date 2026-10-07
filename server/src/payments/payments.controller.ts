import { Controller, Post, Param, Body, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('salons/:salonId/bookings/:bookingId/payment')
  async createPayment(
    @Param('salonId') salonId: string,
    @Param('bookingId') bookingId: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.createPaymentOrder(salonId, bookingId, idempotencyKey);
  }

  @Post('payments/webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
    @Headers('x-razorpay-signature') razorpaySignature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req?.rawBody || Buffer.from(JSON.stringify(payload), 'utf8');
    return this.paymentsService.handleWebhook(provider, payload, razorpaySignature, rawBody);
  }
}
