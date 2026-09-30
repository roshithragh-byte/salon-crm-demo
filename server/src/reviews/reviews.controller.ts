import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('salons/:salonId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** Public: customers can submit reviews without auth */
  @Post()
  async createReview(
    @Param('salonId') salonId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(salonId, body);
  }

  /** Admin: list all reviews with AI enrichment fields */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  @Get()
  async getReviews(@Param('salonId') salonId: string) {
    return this.reviewsService.getReviews(salonId);
  }

  /** Admin: sentiment + topic breakdown for the dashboard */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  @Get('summary')
  async getSentimentSummary(@Param('salonId') salonId: string) {
    return this.reviewsService.getSentimentSummary(salonId);
  }
}
