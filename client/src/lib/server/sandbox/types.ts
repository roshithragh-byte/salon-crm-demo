import 'server-only';

export type UserRole = 'OWNER' | 'ADMIN' | 'STYLIST' | 'STAFF' | 'CUSTOMER';

export type SandboxOperationId =
  | 'runtime-diagnostics'
  | 'auth-smoke-test'
  | 'dashboard-smoke-test'
  | 'auth-black-box';

export interface SandboxCommandStep {
  cmd: string;
  args: string[];
  description?: string;
}

export interface SandboxOperationConfig {
  id: SandboxOperationId;
  name: string;
  description: string;
  allowedRoles: readonly UserRole[];
  timeoutMs: number;
  steps: SandboxCommandStep[];
}

export interface SandboxExecutionResult {
  operation: SandboxOperationId;
  status: 'passed' | 'failed';
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timestamp: string;
  stepsExecuted: number;
}

export interface SandboxResponseSuccess {
  success: true;
  data: SandboxExecutionResult;
}

export interface SandboxResponseError {
  success: false;
  error: {
    code:
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'INVALID_OPERATION'
      | 'RATE_LIMITED'
      | 'SANDBOX_EXECUTION_ERROR'
      | 'INTERNAL_ERROR';
    message: string;
    details?: string;
  };
}

export type SandboxApiResponse = SandboxResponseSuccess | SandboxResponseError;
