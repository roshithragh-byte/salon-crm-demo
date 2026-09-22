import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutboxWorker {
  private readonly logger = new Logger(OutboxWorker.name);
  private isProcessing = false;

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutbox() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Find up to 10 pending events
      const events = await this.prisma.client.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { createdAt: 'asc' }
      });

      for (const event of events) {
        try {
          this.logger.log(`Processing event ${event.type} [${event.id}]...`);
          
          // MOCK NOTIFICATION DISPATCH
          // Here we would actually call Twilio, WhatsApp, Mailgun, etc.
          // e.g. await this.emailProvider.send(...)
          this.logger.log(`[WhatsApp Mock] Sending message for ${event.type} -> Payload: ${JSON.stringify(event.payload)}`);

          // Mark as complete
          await this.prisma.client.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: 'COMPLETED',
              processedAt: new Date()
            }
          });
          
          this.logger.log(`Successfully completed event ${event.id}`);
        } catch (err: any) {
          this.logger.error(`Failed to process event ${event.id}`, err);
          await this.prisma.client.outboxEvent.update({
            where: { id: event.id },
            data: {
              attempts: { increment: 1 },
              error: err.message,
              // If attempts > 3, we could set it to FAILED, but for simplicity:
              status: event.attempts >= 3 ? 'FAILED' : 'PENDING'
            }
          });
        }
      }
    } catch (e) {
      this.logger.error('Worker sweep failed', e);
    } finally {
      this.isProcessing = false;
    }
  }
}
