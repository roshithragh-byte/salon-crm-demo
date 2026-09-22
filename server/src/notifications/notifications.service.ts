import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  // Utility to create an outbox event. This MUST be passed the active Prisma transaction.
  async scheduleEvent(tx: any, salonId: string | null, type: string, payload: any) {
    await tx.outboxEvent.create({
      data: {
        salonId,
        type,
        payload,
        status: 'PENDING'
      }
    });
  }
}
