import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BusyController } from './busy.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [BookingsController, BusyController],
  providers: [BookingsService],
})
export class BookingsModule {}


