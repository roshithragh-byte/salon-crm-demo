import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { authorizeSandboxAccess } from '@/lib/server/sandbox/authorization';
import {
  isAllowedOperation,
  getOperationConfig,
  SANDBOX_OPERATIONS,
} from '@/lib/server/sandbox/operations';
import { checkSandboxRateLimit } from '@/lib/server/sandbox/rate-limiter';
import { executeSandboxOperation } from '@/lib/server/sandbox/sandbox-service';
import { sanitizeOutput } from '@/lib/server/sandbox/sanitization';
import { SandboxApiResponse } from '@/lib/server/sandbox/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/internal/sandbox
 * Lists available allowlisted sandbox operations for authorized administrators.
 */
export async function GET(): Promise<NextResponse> {
  const auth = await authorizeSandboxAccess();
  if (!auth.authorized) {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: { code: auth.code, message: auth.message },
      },
      { status: auth.status }
    );
  }

  const operations = Object.values(SANDBOX_OPERATIONS).map((op) => ({
    id: op.id,
    name: op.name,
    description: op.description,
    allowedRoles: op.allowedRoles,
    timeoutMs: op.timeoutMs,
  }));

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: auth.context.userId,
        role: auth.context.userRole,
      },
      operations,
    },
  });
}

/**
 * POST /api/internal/sandbox
 * Executes an allowlisted sandbox operation in an isolated Vercel microVM.
 *
 * Payload:
 * { "operation": "runtime-diagnostics" | "auth-smoke-test" | "dashboard-smoke-test" }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse JSON body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: 'Malformed JSON payload in request body.',
        },
      },
      { status: 400 }
    );
  }

  const payload = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const operationId = typeof payload.operation === 'string' ? payload.operation : undefined;

  // 2. Validate operation presence
  if (!operationId) {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: 'Field "operation" is required and must be a valid string.',
        },
      },
      { status: 400 }
    );
  }

  // 3. Strict allowlist check (NO arbitrary commands accepted)
  if (!isAllowedOperation(operationId)) {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: `Unknown operation "${sanitizeOutput(operationId)}". Allowed operations: ${Object.keys(SANDBOX_OPERATIONS).join(', ')}`,
        },
      },
      { status: 400 }
    );
  }

  // 4. Authenticate & Authorize before touching any sandbox resources
  const auth = await authorizeSandboxAccess(operationId);
  if (!auth.authorized) {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: { code: auth.code, message: auth.message },
      },
      { status: auth.status }
    );
  }

  // 5. Rate limiting check per user
  const rateLimit = checkSandboxRateLimit(auth.context.userId);
  if (!rateLimit.allowed) {
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds} seconds before requesting another sandbox operation.`,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds || 60),
        },
      }
    );
  }

  // 6. Fetch operation config and execute in isolated Sandbox microVM
  const config = getOperationConfig(operationId)!;
  try {
    const result = await executeSandboxOperation(config);
    return NextResponse.json<SandboxApiResponse>({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const sanitizedError = sanitizeOutput(
      errorMessage || 'An unexpected error occurred during sandbox execution.'
    );
    return NextResponse.json<SandboxApiResponse>(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: sanitizedError,
        },
      },
      { status: 500 }
    );
  }
}
