import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TypeSafeService } from '../typesafe/typesafe.service';
import { analyseReview } from '../typesafe/review-analyser';

export interface CreateReviewDto {
  authorName: string;
  content: string;
  rating: number; // 1–5 raw star rating
  source?: string; // 'google' | 'internal' — defaults to 'internal'
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly typeSafe: TypeSafeService,
  ) {}

  private async getSalon(salonId: string) {
    const salon = await this.prisma.client.salon.findFirst({
      where: { OR: [{ id: salonId }, { slug: salonId }] },
    });
    if (!salon) throw new NotFoundException('Salon not found');
    return salon;
  }

  async createReview(salonId: string, dto: CreateReviewDto) {
    const salon = await this.getSalon(salonId);

    // Persist the raw review immediately
    const review = await this.prisma.client.review.create({
      data: {
        salonId: salon.id,
        authorName: dto.authorName,
        content: dto.content,
        rating: dto.rating,
        source: dto.source ?? 'internal',
      },
    });

    // AI enrichment — async, non-blocking
    this.enrichReviewAsync(review.id, dto.content, dto.authorName).catch((err) =>
      this.logger.warn(`Review enrichment failed for ${review.id}: ${err?.message}`),
    );

    return { data: review };
  }

  private async enrichReviewAsync(reviewId: string, content: string, authorName: string) {
    const analysis = await analyseReview(this.typeSafe, content, authorName);
    if (!analysis) return;

    await this.prisma.client.review.update({
      where: { id: reviewId },
      data: {
        aiTopic: analysis.topic,
        aiSentiment: Math.round(analysis.sentimentScore), // store as integer 1–5
        aiConfidence: analysis.topicConfidence,
      },
    });
  }

  async getReviews(salonId: string) {
    const salon = await this.getSalon(salonId);
    const reviews = await this.prisma.client.review.findMany({
      where: { salonId: salon.id },
      orderBy: { createdAt: 'desc' },
    });
    return { data: reviews };
  }

  /** Returns aggregated topic + sentiment stats for the dashboard. */
  async getSentimentSummary(salonId: string) {
    const salon = await this.getSalon(salonId);
    const reviews = await this.prisma.client.review.findMany({
      where: { salonId: salon.id, aiTopic: { not: null } },
      select: { aiTopic: true, aiSentiment: true },
    });

    const topicCounts: Record<string, number> = {};
    let totalSentiment = 0;
    let sentimentCount = 0;

    for (const r of reviews) {
      if (r.aiTopic) topicCounts[r.aiTopic] = (topicCounts[r.aiTopic] ?? 0) + 1;
      if (r.aiSentiment !== null) {
        totalSentiment += r.aiSentiment;
        sentimentCount++;
      }
    }

    return {
      data: {
        topicBreakdown: topicCounts,
        avgSentiment: sentimentCount > 0 ? +(totalSentiment / sentimentCount).toFixed(2) : null,
        totalAnalysed: reviews.length,
      },
    };
  }
}
