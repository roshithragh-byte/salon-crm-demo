import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { CustomersModule } from './customers/customers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { logger } from './logger/winston.logger';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MeModule } from './me/me.module';
import { StaffModule } from './staff/staff.module';
import { TypeSafeModule } from './typesafe/typesafe.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AvailabilityModule,
    BookingsModule,
    PaymentsModule,
    CustomersModule,
    NotificationsModule,
    AnalyticsModule,
    ScheduleModule.forRoot(),
    AuthModule,
    AppointmentsModule,
    MeModule,
    StaffModule,
    TypeSafeModule,
    ReviewsModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'LOGGER', useValue: logger }],
})
export class AppModule {}