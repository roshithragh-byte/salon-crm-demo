import { TypeSafeService } from './typesafe.service';

export type ReviewTopic =
  | 'service_quality'
  | 'staff_attitude'
  | 'wait_time'
  | 'cleanliness'
  | 'value_for_money'
  | 'other';

export interface ReviewAnalysis {
  topic: ReviewTopic;
  topicConfidence: number;
  sentimentScore: number; // 1–5 (1=very negative, 5=very positive)
  sentimentConfidence: number;
}

/**
 * Analyses a review using a fan-out of two questions in a single TypeSafe call:
 *  - Choice → primary topic
 *  - Score  → sentiment level (1–5)
 *
 * Returns null when the review is too short or the API call fails.
 */
export async function analyseReview(
  typeSafe: TypeSafeService,
  reviewContent: string,
  authorName?: string,
): Promise<ReviewAnalysis | null> {
  if (!reviewContent || reviewContent.trim().length < 10) return null;

  const response = await typeSafe.ask({
    state: {
      review_text: reviewContent,
      author: authorName ?? 'anonymous',
    },
    questions: {
      topic: {
        type: 'choice',
        instructions: 'What is the primary topic of `review_text` for a hair/beauty salon?',
        criteria: {
          service_quality: 'The quality of the haircut, treatment, or beauty service delivered.',
          staff_attitude: 'The attitude, friendliness, or professionalism of the staff.',
          wait_time: 'Time spent waiting before or during the appointment.',
          cleanliness: 'Hygiene, cleanliness, or ambiance of the salon premises.',
          value_for_money: 'Pricing, value, or whether the service was worth the cost.',
          other: 'The review does not clearly fit any of the above topics.',
        },
      },
      sentiment: {
        type: 'score',
        instructions: 'What is the overall sentiment expressed in `review_text`?',
        criteria: [
          'Very negative — strong dissatisfaction, anger, or complaint.',
          'Negative — mild dissatisfaction or disappointment.',
          'Neutral — neither positive nor negative, or mixed.',
          'Positive — satisfied and pleased with the experience.',
          'Very positive — enthusiastic praise, highly recommends the salon.',
        ],
      },
    },
  });

  if (!response) return null;

  const answers = (response as any).answers;
  if (!answers?.topic || !answers?.sentiment) return null;

  return {
    topic: answers.topic.choice as ReviewTopic,
    topicConfidence: answers.topic.confidence ?? 0,
    sentimentScore: answers.sentiment.score ?? 3,
    sentimentConfidence: answers.sentiment.confidence ?? 0,
  };
}
