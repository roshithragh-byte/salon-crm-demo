import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { OutboxWorker } from './outbox.worker';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, OutboxWorker],
  exports: [NotificationsService],
})
export class NotificationsModule {}
