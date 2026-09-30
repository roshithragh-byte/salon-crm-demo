import { TypeSafeService } from './typesafe.service';

export interface StaffCandidate {
  staffMemberId: string;
  displayName: string;
  appointmentsForService: number; // past count for this specific service
  totalServices: number;          // total services this staff member provides
  isActive: boolean;
}

export interface StaffMatchResult {
  staffMemberId: string;
  scoreValue: number; // 1–3 (low/medium/high fit)
}

/**
 * Scores each candidate staff member against the requested service using a
 * Score question (fan-out: all candidates in one API call).
 *
 * Returns candidates ranked best-first.
 * Falls back to original order if TypeSafe call fails.
 */
export async function matchBestStaff(
  typeSafe: TypeSafeService,
  candidates: StaffCandidate[],
  serviceName: string,
  serviceDescription?: string,
): Promise<StaffMatchResult[]> {
  if (candidates.length === 0) return [];

  // Fan-out: one Score question per candidate, all in a single call
  const questions: Record<string, any> = {};
  for (const c of candidates) {
    if (!c.isActive) continue;
    questions[`fit_${c.staffMemberId}`] = {
      type: 'score',
      instructions: `How well does this stylist fit the requested service?`,
      criteria: [
        'Poor fit: stylist has no experience with this service type.',
        'Moderate fit: stylist can perform the service but it is not their specialty.',
        'Excellent fit: stylist specialises in this service and has a proven track record.',
      ],
    };
  }

  const questionIds = Object.keys(questions);
  if (questionIds.length === 0) {
    // All inactive — fall back to original order
    return candidates.map((c) => ({ staffMemberId: c.staffMemberId, scoreValue: 1 }));
  }

  const state: Record<string, any> = {
    service_name: serviceName,
    service_description: serviceDescription ?? '',
  };
  for (const c of candidates) {
    if (!c.isActive) continue;
    state[`stylist_${c.staffMemberId}`] = {
      name: c.displayName,
      appointments_for_this_service: c.appointmentsForService,
      total_services_offered: c.totalServices,
    };
    // Point each question to its candidate's state key
    questions[`fit_${c.staffMemberId}`].instructions =
      `How well does \`stylist_${c.staffMemberId}\` fit the service \`service_name\`?`;
  }

  const response = await typeSafe.ask({ state, questions });

  if (!response) {
    // Graceful fallback: return candidates in original order with neutral score
    return candidates.map((c) => ({ staffMemberId: c.staffMemberId, scoreValue: 2 }));
  }

  const answers = (response as any).answers ?? {};
  const results: StaffMatchResult[] = candidates.map((c) => {
    const answer = answers[`fit_${c.staffMemberId}`];
    return {
      staffMemberId: c.staffMemberId,
      scoreValue: answer?.score ?? 2,
    };
  });

  // Sort best-first (highest score first)
  results.sort((a, b) => b.scoreValue - a.scoreValue);
  return results;
}
