import { TypeSafeService } from './typesafe.service';

export interface ConflictDetectionResult {
  isConflict: boolean;
  pYes: number; // raw probability 0–1
}

/**
 * Semantically checks whether a booking request contains an ambiguity or
 * conflict between the customer's free-text note and the selected slot.
 *
 * This runs BEFORE the DB transaction so semantic conflicts are caught
 * without any writes occurring.
 *
 * Examples caught:
 *  - "please move to next week" in notes while the selected date is today
 *  - "actually cancel this" in notes
 *  - date/time mentioned in notes that contradicts the selected startsAt
 *
 * Threshold: P(yes) > 0.70 → reject with SEMANTIC_CONFLICT code.
 */
export async function detectSemanticConflict(
  typeSafe: TypeSafeService,
  notes: string | undefined | null,
  startsAt: Date,
  serviceName: string,
): Promise<ConflictDetectionResult> {
  const defaultResult: ConflictDetectionResult = { isConflict: false, pYes: 0 };

  if (!notes || notes.trim().length < 5) return defaultResult;

  const response = await typeSafe.ask({
    state: {
      customer_note: notes,
      selected_datetime: startsAt.toISOString(),
      service: serviceName,
    },
    questions: {
      has_conflict: {
        type: 'noul',
        instructions:
          'Does `customer_note` express an intent that contradicts or conflicts with the selected booking (`selected_datetime`, `service`)? Examples: the note asks to reschedule, cancel, or mentions a different time or date than selected.',
        criteria: {
          true: 'The note clearly contradicts the booking details — e.g., asks to cancel, reschedule, or references a different time/date.',
          false: 'The note is supplementary information that does not conflict with the booking details.',
        },
      },
    },
  });

  if (!response) return defaultResult;

  const pYes: number = (response as any).answers?.has_conflict?.noul ?? 0;
  return {
    isConflict: pYes > 0.70,
    pYes,
  };
}
