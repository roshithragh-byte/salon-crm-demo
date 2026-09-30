import { TypeSafeService } from './typesafe.service';

export interface NoShowAssessment {
  isHighRisk: boolean;
  score: number; // raw P(yes) 0–1
}

interface CustomerSignals {
  visitCount: number;
  pastCancellations: number;
  pastNoShows: number;
  hasEmail: boolean;
  leadTimeDays: number;      // days between booking creation and appointment
  hourOfDay: number;         // 0–23, appointment start hour
}

/**
 * Assesses the no-show risk for an upcoming booking using a Noul question.
 * Threshold: P(yes) > 0.65 → flagged as high risk.
 *
 * Signals are gathered by the caller from the DB and passed in to keep
 * this function pure and testable.
 */
export async function assessNoShowRisk(
  typeSafe: TypeSafeService,
  signals: CustomerSignals,
): Promise<NoShowAssessment> {
  const defaultResult: NoShowAssessment = { isHighRisk: false, score: 0 };

  const response = await typeSafe.ask({
    state: {
      customer_visit_count: signals.visitCount,
      past_cancellations: signals.pastCancellations,
      past_no_shows: signals.pastNoShows,
      has_email_on_file: signals.hasEmail,
      days_until_appointment: signals.leadTimeDays,
      appointment_hour_of_day: signals.hourOfDay,
    },
    questions: {
      no_show_risk: {
        type: 'noul',
        instructions:
          'Based on the customer signals, is this booking at elevated risk of a no-show (customer not attending without cancelling)?',
        criteria: {
          true: 'The customer shows multiple risk signals: new customer, short notice, very early or late hour, prior cancellations or no-shows, no email on file.',
          false: 'The customer shows low risk: returning customer with visits, reasonable lead time, normal hours, no prior no-shows, email on file.',
        },
      },
    },
  });

  if (!response) return defaultResult;

  const pYes: number = (response as any).answers?.no_show_risk?.noul ?? 0;
  return {
    isHighRisk: pYes > 0.65,
    score: pYes,
  };
}
