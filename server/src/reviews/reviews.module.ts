import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
// TypeSafeModule is @Global() — TypeSafeService is injected automatically

@Module({
  imports: [PrismaModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
