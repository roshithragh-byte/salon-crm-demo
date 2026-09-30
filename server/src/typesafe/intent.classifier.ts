import { TypeSafeService } from './typesafe.service';

export type IntentLabel =
  | 'reschedule'
  | 'cancel'
  | 'complaint'
  | 'general_enquiry'
  | 'product_question'
  | 'other';

export interface IntentResult {
  label: IntentLabel;
  confidence: number;
}

/**
 * Classifies the intent behind a booking note / customer message using a
 * Choice question so code can route or badge the appointment accordingly.
 *
 * Returns null when no notes are present or when the TypeSafe call fails,
 * so callers can skip enrichment without breaking the booking flow.
 */
export async function classifyIntent(
  typeSafe: TypeSafeService,
  notes: string | undefined | null,
  serviceName?: string,
): Promise<IntentResult | null> {
  if (!notes || notes.trim().length < 3) return null;

  const response = await typeSafe.ask({
    state: {
      customer_note: notes,
      service_booked: serviceName ?? 'unspecified',
    },
    questions: {
      intent: {
        type: 'choice',
        instructions:
          'What is the primary intent of `customer_note` in the context of a salon booking?',
        criteria: {
          reschedule: 'The customer wants to move the appointment to a different time or date.',
          cancel: 'The customer wants to cancel or not attend the appointment.',
          complaint: 'The customer is expressing dissatisfaction or raising a complaint.',
          general_enquiry: 'The customer is asking a general question about the service or salon.',
          product_question: 'The customer is asking about a specific product used in the service.',
          other: 'The note does not clearly fit any of the above categories.',
        },
      },
    },
  });

  if (!response) return null;

  const answer = (response as any).answers?.intent;
  if (!answer) return null;

  return {
    label: answer.choice as IntentLabel,
    confidence: answer.confidence ?? 0,
  };
}
