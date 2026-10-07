import 'server-only';

export type TestResultStatus = 'PASS' | 'FAIL' | 'BLOCKED';

export interface AuthTestCaseResult {
  testId: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  authenticationState: string;
  expectedStatus: string;
  actualStatus: string;
  result: TestResultStatus;
  notes?: string;
  durationMs: number;
}

export interface AuthMatrixSummary {
  targetUrl: string;
  backendUrl: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  results: AuthTestCaseResult[];
}
