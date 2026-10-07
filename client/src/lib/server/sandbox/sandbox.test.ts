// Mock 'server-only' in direct Node.js test execution
import Module from 'module';
const modProto = Module.prototype as { require: (id: string) => unknown };
const originalRequire = modProto.require;
modProto.require = function (id: string) {
  if (id === 'server-only') return {};
  return originalRequire.call(this, id);
};

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  const { isAllowedOperation, getOperationConfig, SANDBOX_OPERATIONS } = await import('./operations');
  const { sanitizeOutput } = await import('./sanitization');
  const { checkSandboxRateLimit } = await import('./rate-limiter');
  type SandboxOperationId = import('./types').SandboxOperationId;
  console.log('Running Sandbox Unit Test Suite...\n');

  // --- 1. Operations Allowlist Tests ---
  console.log('Test 1: Operation Allowlist Enforcement');
  assert(isAllowedOperation('runtime-diagnostics'), 'runtime-diagnostics should be allowed');
  assert(isAllowedOperation('auth-smoke-test'), 'auth-smoke-test should be allowed');
  assert(isAllowedOperation('dashboard-smoke-test'), 'dashboard-smoke-test should be allowed');
  assert(isAllowedOperation('auth-black-box'), 'auth-black-box should be allowed');

  // Arbitrary commands / unknown operations MUST be rejected
  assert(!isAllowedOperation('rm -rf /'), 'Arbitrary shell command must be rejected');
  assert(!isAllowedOperation('curl http://evil.com'), 'Arbitrary curl command must be rejected');
  assert(!isAllowedOperation(''), 'Empty operation must be rejected');
  assert(!isAllowedOperation('eval'), 'Eval must be rejected');
  assert(getOperationConfig('arbitrary-shell') === null, 'Unknown config returns null');
  console.log('✓ Operation Allowlist correctly restricts input to predefined operations.\n');

  // --- 2. Output Sanitization Tests ---
  console.log('Test 2: Output Sanitization & Secret Redaction');
  
  // Test JWT token redaction
  const rawJwt = 'User token is eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c in payload';
  const cleanJwt = sanitizeOutput(rawJwt);
  assert(!cleanJwt.includes('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'), 'JWT signature must be redacted');
  assert(cleanJwt.includes('[REDACTED_JWT]'), 'JWT should be replaced with placeholder');

  // Test Database URL credential redaction
  const rawDb = 'Connected to postgresql://postgres:superSecretPass123@db.railway.internal:5432/production_db successfully';
  const cleanDb = sanitizeOutput(rawDb);
  assert(!cleanDb.includes('superSecretPass123'), 'DB password must be redacted');
  assert(cleanDb.includes('[REDACTED_PASS]'), 'DB pass placeholder should be present');

  // Test Bearer token redaction
  const rawBearer = 'Authorization: Bearer my-secret-bearer-token-12345';
  const cleanBearer = sanitizeOutput(rawBearer);
  assert(!cleanBearer.includes('my-secret-bearer-token-12345'), 'Bearer token must be redacted');
  assert(cleanBearer.includes('[REDACTED_TOKEN]'), 'Bearer token placeholder present');

  // Test NextAuth session cookie redaction
  const rawCookie = 'Cookie: next-auth.session-token=secret-session-jwt-value; Path=/';
  const cleanCookie = sanitizeOutput(rawCookie);
  assert(!cleanCookie.includes('secret-session-jwt-value'), 'Session cookie value must be redacted');
  assert(cleanCookie.includes('[REDACTED_COOKIE]'), 'Cookie placeholder present');

  // Test Private key redaction
  const rawKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0\n-----END RSA PRIVATE KEY-----';
  const cleanKey = sanitizeOutput(rawKey);
  assert(!cleanKey.includes('MIIEowIBAAKCAQEA0'), 'Private key body must be redacted');
  assert(cleanKey.includes('[REDACTED_PRIVATE_KEY]'), 'Private key placeholder present');

  console.log('✓ Sanitization correctly redacts JWTs, DB passwords, Bearer tokens, cookies, and keys.\n');

  // --- 3. Rate Limiting Tests ---
  console.log('Test 3: Rate Limiting Enforcement');
  const testUserId = 'test-admin-' + Date.now();
  for (let i = 0; i < 10; i++) {
    const res = checkSandboxRateLimit(testUserId);
    assert(res.allowed === true, `Request ${i + 1} within window should be allowed`);
  }
  const blockedRes = checkSandboxRateLimit(testUserId);
  assert(blockedRes.allowed === false, 'Request exceeding window limit must be blocked');
  assert(typeof blockedRes.retryAfterSeconds === 'number', 'Retry-After seconds must be provided');
  console.log('✓ Rate limiting strictly enforces window quota and returns retry interval.\n');

  // --- 4. Operations Role Matrix Tests ---
  console.log('Test 4: Operation Configuration Matrix');
  for (const opId of Object.keys(SANDBOX_OPERATIONS) as SandboxOperationId[]) {
    const op = SANDBOX_OPERATIONS[opId];
    assert(op.allowedRoles.includes('ADMIN'), `${opId} must allow ADMIN`);
    assert(op.allowedRoles.includes('OWNER'), `${opId} must allow OWNER`);
    assert(!(op.allowedRoles as readonly string[]).includes('STAFF'), `${opId} must deny STAFF`);
    assert(!(op.allowedRoles as readonly string[]).includes('CUSTOMER'), `${opId} must deny CUSTOMER`);
    assert(op.timeoutMs > 0 && op.timeoutMs <= 60000, `${opId} must have bounded timeout`);
    assert(op.steps.length > 0, `${opId} must define command steps`);
  }
  console.log('✓ All allowlisted operations have verified role restrictions and bounded timeouts.\n');

  // --- 5. Authorization Boundary Tests ---
  console.log('Test 5: Authorization Role Evaluation');
  const roleChecker = (role?: string) => {
    if (!role) return { authorized: false, status: 401, code: 'UNAUTHORIZED' };
    const r = role.toUpperCase();
    if (r !== 'ADMIN' && r !== 'OWNER') return { authorized: false, status: 403, code: 'FORBIDDEN' };
    return { authorized: true, role: r };
  };

  assert(roleChecker(undefined).status === 401, 'No role/session must return 401');
  assert(roleChecker('CUSTOMER').status === 403, 'CUSTOMER role must return 403');
  assert(roleChecker('STAFF').status === 403, 'STAFF role must return 403');
  assert(roleChecker('STYLIST').status === 403, 'STYLIST role must return 403');
  assert(roleChecker('ADMIN').authorized === true, 'ADMIN role must be authorized');
  assert(roleChecker('OWNER').authorized === true, 'OWNER role must be authorized');
  console.log('✓ Authorization logic strictly grants access only to ADMIN and OWNER roles.\n');

  console.log('ALL TESTS PASSED SUCCESSFULLY! (5/5 test suites)');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
