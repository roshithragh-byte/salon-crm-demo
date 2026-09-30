import { TypeSafeService } from './typesafe.service';
import { detectSemanticConflict } from './conflict-detector';
import { classifyIntent } from './intent.classifier';
import { assessNoShowRisk } from './no-show.assessor';
import { analyseReview } from './review-analyser';
import { matchBestStaff } from './staff-matcher';

describe('TypeSafe (Jev) AI Modules', () => {
  let mockTypeSafeService: Partial<TypeSafeService>;

  beforeEach(() => {
    mockTypeSafeService = {
      ask: jest.fn(),
    };
  });

  describe('Conflict Detector', () => {
    it('returns default result when notes are short or missing', async () => {
      const res = await detectSemanticConflict(
        mockTypeSafeService as TypeSafeService,
        '',
        new Date(),
        'Haircut',
      );
      expect(res.isConflict).toBe(false);
      expect(res.pYes).toBe(0);
    });

    it('identifies conflict when Jev returns high probability', async () => {
      (mockTypeSafeService.ask as jest.Mock).mockResolvedValue({
        answers: {
          has_conflict: { noul: 0.85 },
        },
      });

      const res = await detectSemanticConflict(
        mockTypeSafeService as TypeSafeService,
        'Please reschedule to tomorrow morning',
        new Date(),
        'Haircut',
      );
      expect(res.isConflict).toBe(true);
      expect(res.pYes).toBe(0.85);
    });
  });

  describe('Intent Classifier', () => {
    it('returns null when notes are too short', async () => {
      const res = await classifyIntent(mockTypeSafeService as TypeSafeService, 'hi');
      expect(res).toBeNull();
    });

    it('classifies reschedule intent accurately', async () => {
      (mockTypeSafeService.ask as jest.Mock).mockResolvedValue({
        answers: {
          intent: { choice: 'reschedule', confidence: 0.92 },
        },
      });

      const res = await classifyIntent(
        mockTypeSafeService as TypeSafeService,
        'Need to change my appointment time to 4pm',
        'Hair Spa',
      );
      expect(res).toEqual({
        label: 'reschedule',
        confidence: 0.92,
      });
    });
  });

  describe('No-Show Assessor', () => {
    it('assesses high risk for risky signals', async () => {
      (mockTypeSafeService.ask as jest.Mock).mockResolvedValue({
        answers: {
          no_show_risk: { noul: 0.78 },
        },
      });

      const res = await assessNoShowRisk(mockTypeSafeService as TypeSafeService, {
        visitCount: 0,
        pastCancellations: 2,
        pastNoShows: 1,
        hasEmail: false,
        leadTimeDays: 0,
        hourOfDay: 21,
      });

      expect(res.isHighRisk).toBe(true);
      expect(res.score).toBe(0.78);
    });
  });

  describe('Review Analyser', () => {
    it('returns null for short content', async () => {
      const res = await analyseReview(mockTypeSafeService as TypeSafeService, 'Nice');
      expect(res).toBeNull();
    });

    it('extracts topic and sentiment score correctly', async () => {
      (mockTypeSafeService.ask as jest.Mock).mockResolvedValue({
        answers: {
          topic: { choice: 'service_quality', confidence: 0.95 },
          sentiment: { score: 5, confidence: 0.98 },
        },
      });

      const res = await analyseReview(
        mockTypeSafeService as TypeSafeService,
        'Amazing haircut! The stylist was meticulous and the salon was spotless.',
        'Sarah',
      );

      expect(res).toEqual({
        topic: 'service_quality',
        topicConfidence: 0.95,
        sentimentScore: 5,
        sentimentConfidence: 0.98,
      });
    });
  });

  describe('Staff Matcher', () => {
    it('ranks candidate staff based on fit score', async () => {
      (mockTypeSafeService.ask as jest.Mock).mockResolvedValue({
        answers: {
          fit_staff1: { score: 3 },
          fit_staff2: { score: 1 },
        },
      });

      const candidates = [
        { staffMemberId: 'staff2', displayName: 'Junior', appointmentsForService: 1, totalServices: 2, isActive: true },
        { staffMemberId: 'staff1', displayName: 'Senior Stylist', appointmentsForService: 50, totalServices: 10, isActive: true },
      ];

      const res = await matchBestStaff(
        mockTypeSafeService as TypeSafeService,
        candidates,
        'Keratin Treatment',
      );

      expect(res[0].staffMemberId).toBe('staff1');
      expect(res[0].scoreValue).toBe(3);
      expect(res[1].staffMemberId).toBe('staff2');
      expect(res[1].scoreValue).toBe(1);
    });
  });
});
