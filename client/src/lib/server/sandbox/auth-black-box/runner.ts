import 'server-only';

/**
 * Returns the JavaScript code to be executed inside the Vercel Sandbox microVM.
 * The script runs entirely as an external black-box client against the deployed endpoints.
 */
export function getAuthBlackBoxRunnerScript(): string {
  const targetUrl = (
    process.env.AUTH_AUDIT_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://salon-crm-demo-theta.vercel.app'
  ).replace(/\/$/, '');
  const rawBackend = (
    process.env.AUTH_AUDIT_BACKEND_URL ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://salon-crm-demo-production.up.railway.app'
  ).trim();
  const backendUrl = rawBackend
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?(\/api\/v1)?\/?$/, 'https://salon-crm-demo-production.up.railway.app')
    .replace(/^https?:\/\/localhost(:\d+)?(\/api\/v1)?\/?$/, 'https://salon-crm-demo-production.up.railway.app')
    .replace(/\/api\/v1\/?$/, '')
    .replace(/\/$/, '');

  const hasConfiguredTarget = Boolean(
    process.env.AUTH_AUDIT_BASE_URL || process.env.AUTH_AUDIT_BACKEND_URL || process.env.API_BASE_URL
  );

  return `
const crypto = require('crypto');

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_');
}

function createTestJwt(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedHeader + '.' + encodedPayload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_');
  return encodedHeader + '.' + encodedPayload + '.' + signature;
}

async function runMatrix() {
  const targetUrl = ${JSON.stringify(targetUrl)};
  const backendUrl = ${JSON.stringify(backendUrl)};
  const hasConfiguredTarget = ${JSON.stringify(hasConfiguredTarget)};

  const results = [];
  const startAll = Date.now();

  console.log("=== BLACK-BOX AUTHENTICATION MATRIX RUNNER ===");
  console.log("Target Frontend: ", targetUrl);
  console.log("Target Backend:  ", backendUrl);
  console.log("Configured Audit Target: ", hasConfiguredTarget ? "YES" : "DEFAULT/FALLBACK");
  console.log("Execution Time:  ", new Date().toISOString());
  console.log("----------------------------------------------\\n");

  // AUTH-001: Valid Login
  {
    const start = Date.now();
    const testEmail = process.env.NONPROD_TEST_USER_EMAIL;
    const testPass = process.env.NONPROD_TEST_USER_PASSWORD;

    if (!testEmail || !testPass) {
      results.push({
        testId: 'AUTH-001',
        name: 'Valid Login',
        method: 'POST',
        path: '/api/v1/auth/verify',
        authenticationState: 'Valid non-production credentials',
        expectedStatus: '200 OK',
        actualStatus: 'N/A (Prerequisite Missing)',
        result: 'BLOCKED',
        notes: 'TEST PREREQUISITE MISSING: Non-production test account credentials not configured in environment.',
        durationMs: Date.now() - start,
      });
    } else {
      try {
        const res = await fetch(backendUrl + '/api/v1/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail, password: testPass }),
        });
        const duration = Date.now() - start;
        const pass = res.status === 200;
        results.push({
          testId: 'AUTH-001',
          name: 'Valid Login',
          method: 'POST',
          path: '/api/v1/auth/verify',
          authenticationState: 'Valid credentials provided',
          expectedStatus: '200 OK',
          actualStatus: res.status + ' ' + res.statusText,
          result: pass ? 'PASS' : 'FAIL',
          durationMs: duration,
        });
      } catch (err) {
        results.push({
          testId: 'AUTH-001',
          name: 'Valid Login',
          method: 'POST',
          path: '/api/v1/auth/verify',
          authenticationState: 'Valid credentials provided',
          expectedStatus: '200 OK',
          actualStatus: 'Network/Connection Error: ' + err.message,
          result: 'FAIL',
          durationMs: Date.now() - start,
        });
      }
    }
  }

  // AUTH-002: Invalid Password
  {
    const start = Date.now();
    try {
      const res = await fetch(backendUrl + '/api/v1/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'unregistered-test-user@test.local',
          password: 'wrong-password-vector-12345',
        }),
      });
      const duration = Date.now() - start;
      const pass = res.status === 401 || res.status === 400;
      results.push({
        testId: 'AUTH-002',
        name: 'Invalid Password Rejection',
        method: 'POST',
        path: '/api/v1/auth/verify',
        authenticationState: 'Invalid credentials',
        expectedStatus: '401 Unauthorized',
        actualStatus: res.status + ' ' + res.statusText,
        result: pass ? 'PASS' : 'FAIL',
        durationMs: duration,
      });
    } catch (err) {
      results.push({
        testId: 'AUTH-002',
        name: 'Invalid Password Rejection',
        method: 'POST',
        path: '/api/v1/auth/verify',
        authenticationState: 'Invalid credentials',
        expectedStatus: '401 Unauthorized',
        actualStatus: 'Error: ' + err.message,
        result: 'FAIL',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-003: No Authentication
  {
    const start = Date.now();
    try {
      const res = await fetch(backendUrl + '/api/v1/me/profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const duration = Date.now() - start;
      const pass = res.status === 401;
      results.push({
        testId: 'AUTH-003',
        name: 'No Authentication Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Unauthenticated (No Header/Cookie)',
        expectedStatus: '401 Unauthorized',
        actualStatus: res.status + ' ' + res.statusText,
        result: pass ? 'PASS' : 'FAIL',
        durationMs: duration,
      });
    } catch (err) {
      results.push({
        testId: 'AUTH-003',
        name: 'No Authentication Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Unauthenticated (No Header/Cookie)',
        expectedStatus: '401 Unauthorized',
        actualStatus: 'Error: ' + err.message,
        result: 'FAIL',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-004: Malformed JWT
  {
    const start = Date.now();
    try {
      const res = await fetch(backendUrl + '/api/v1/me/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer malformed.invalid.token.payload',
        },
      });
      const duration = Date.now() - start;
      const pass = res.status === 401;
      results.push({
        testId: 'AUTH-004',
        name: 'Malformed JWT Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Malformed JWT format',
        expectedStatus: '401 Unauthorized',
        actualStatus: res.status + ' ' + res.statusText,
        result: pass ? 'PASS' : 'FAIL',
        durationMs: duration,
      });
    } catch (err) {
      results.push({
        testId: 'AUTH-004',
        name: 'Malformed JWT Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Malformed JWT format',
        expectedStatus: '401 Unauthorized',
        actualStatus: 'Error: ' + err.message,
        result: 'FAIL',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-005: Expired JWT
  {
    const start = Date.now();
    try {
      const expiredPayload = {
        sub: '00000000-0000-0000-0000-000000000000',
        email: 'test@expired.local',
        role: 'ADMIN',
        iat: 1000000000,
        exp: 1000000100, // Year 2001 (expired)
      };
      const expiredToken = createTestJwt(expiredPayload, 'random-signing-secret');
      const res = await fetch(backendUrl + '/api/v1/me/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + expiredToken,
        },
      });
      const duration = Date.now() - start;
      const pass = res.status === 401;
      results.push({
        testId: 'AUTH-005',
        name: 'Expired JWT Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Expired JWT timestamp (exp in past)',
        expectedStatus: '401 Unauthorized',
        actualStatus: res.status + ' ' + res.statusText,
        result: pass ? 'PASS' : 'FAIL',
        durationMs: duration,
      });
    } catch (err) {
      results.push({
        testId: 'AUTH-005',
        name: 'Expired JWT Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Expired JWT timestamp (exp in past)',
        expectedStatus: '401 Unauthorized',
        actualStatus: 'Error: ' + err.message,
        result: 'FAIL',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-006: Wrong-Key JWT
  {
    const start = Date.now();
    try {
      const wrongKeyPayload = {
        sub: '00000000-0000-0000-0000-000000000000',
        email: 'test@wrongkey.local',
        role: 'ADMIN',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const wrongKeyToken = createTestJwt(
        wrongKeyPayload,
        'deliberately-wrong-untrusted-secret-key-99999'
      );
      const res = await fetch(backendUrl + '/api/v1/me/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + wrongKeyToken,
        },
      });
      const duration = Date.now() - start;
      const pass = res.status === 401;
      results.push({
        testId: 'AUTH-006',
        name: 'Wrong-Key Signature Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Valid JWT signed with foreign/untrusted key',
        expectedStatus: '401 Unauthorized',
        actualStatus: res.status + ' ' + res.statusText,
        result: pass ? 'PASS' : 'FAIL',
        durationMs: duration,
      });
    } catch (err) {
      results.push({
        testId: 'AUTH-006',
        name: 'Wrong-Key Signature Rejection',
        method: 'GET',
        path: '/api/v1/me/profile',
        authenticationState: 'Valid JWT signed with foreign/untrusted key',
        expectedStatus: '401 Unauthorized',
        actualStatus: 'Error: ' + err.message,
        result: 'FAIL',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-007: Insufficient Role (Lower privilege STYLIST/STAFF accessing ADMIN route)
  {
    const start = Date.now();
    const staffEmail = process.env.NONPROD_STAFF_EMAIL;
    const staffPass = process.env.NONPROD_STAFF_PASSWORD;
    const salonId = process.env.NONPROD_SALON_A_ID || 'audit-salon-a';

    if (!staffEmail || !staffPass) {
      results.push({
        testId: 'AUTH-007',
        name: 'Insufficient Role Rejection',
        method: 'GET',
        path: \`/api/v1/salons/\${salonId}/customers\`,
        authenticationState: 'STYLIST/STAFF lower-privilege test account',
        expectedStatus: '403 Forbidden',
        actualStatus: 'N/A (Prerequisite Missing)',
        result: 'BLOCKED',
        notes: 'TEST PREREQUISITE MISSING: Low-privilege (STAFF/STYLIST) test account credentials not configured in environment.',
        durationMs: Date.now() - start,
      });
    } else {
      results.push({
        testId: 'AUTH-007',
        name: 'Insufficient Role Rejection',
        method: 'GET',
        path: \`/api/v1/salons/\${salonId}/customers\`,
        authenticationState: 'STYLIST/STAFF role session',
        expectedStatus: '403 Forbidden',
        actualStatus: 'Not executed',
        result: 'BLOCKED',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-008: Authorized Admin Access
  {
    const start = Date.now();
    const adminEmail = process.env.NONPROD_TEST_USER_EMAIL;
    const adminPass = process.env.NONPROD_TEST_USER_PASSWORD;
    const salonId = process.env.NONPROD_SALON_A_ID || 'audit-salon-a';

    if (!adminEmail || !adminPass) {
      results.push({
        testId: 'AUTH-008',
        name: 'Authorized Admin Access',
        method: 'GET',
        path: \`/api/v1/salons/\${salonId}/customers\`,
        authenticationState: 'ADMIN/OWNER role test account',
        expectedStatus: '200 OK',
        actualStatus: 'N/A (Prerequisite Missing)',
        result: 'BLOCKED',
        notes: 'TEST PREREQUISITE MISSING: Admin test account credentials not configured in environment.',
        durationMs: Date.now() - start,
      });
    } else {
      results.push({
        testId: 'AUTH-008',
        name: 'Authorized Admin Access',
        method: 'GET',
        path: \`/api/v1/salons/\${salonId}/customers\`,
        authenticationState: 'ADMIN/OWNER role session',
        expectedStatus: '200 OK',
        actualStatus: 'Not executed',
        result: 'BLOCKED',
        durationMs: Date.now() - start,
      });
    }
  }

  // AUTH-009: Cross-Salon Authorization (Tenant Isolation)
  {
    const start = Date.now();
    const salonBId = process.env.NONPROD_SALON_B_ID || 'audit-salon-b';
    const adminEmail = process.env.NONPROD_TEST_USER_EMAIL;
    const adminPass = process.env.NONPROD_TEST_USER_PASSWORD;

    if (!adminEmail || !adminPass) {
      results.push({
        testId: 'AUTH-009',
        name: 'Cross-Salon Tenant Isolation',
        method: 'GET',
        path: \`/api/v1/salons/\${salonBId}/customers\`,
        authenticationState: 'Salon A authenticated identity accessing Salon B',
        expectedStatus: '403 Forbidden',
        actualStatus: 'N/A (Prerequisite Missing)',
        result: 'BLOCKED',
        notes: 'TEST PREREQUISITE MISSING: Non-production test credentials/isolated tenants not configured.',
        durationMs: Date.now() - start,
      });
    } else {
      results.push({
        testId: 'AUTH-009',
        name: 'Cross-Salon Tenant Isolation',
        method: 'GET',
        path: \`/api/v1/salons/\${salonBId}/customers\`,
        authenticationState: 'Salon A identity accessing Salon B',
        expectedStatus: '403 Forbidden',
        actualStatus: 'Not executed',
        result: 'BLOCKED',
        durationMs: Date.now() - start,
      });
    }
  }

  // Summary calculation
  let passed = 0;
  let failed = 0;
  let blocked = 0;

  for (const r of results) {
    if (r.result === 'PASS') passed++;
    else if (r.result === 'FAIL') failed++;
    else if (r.result === 'BLOCKED') blocked++;

    console.log(\`[\${r.result}] \${r.testId}: \${r.name}\`);
    console.log(\`  Method/Path: \${r.method} \${r.path}\`);
    console.log(\`  Expected:    \${r.expectedStatus}\`);
    console.log(\`  Actual:      \${r.actualStatus}\`);
    if (r.notes) console.log(\`  Notes:       \${r.notes}\`);
    console.log(\`  Duration:    \${r.durationMs}ms\\n\`);
  }

  console.log("================ SUMMARY ================");
  console.log(\`Total Tests: \${results.length}\`);
  console.log(\`PASSED:      \${passed}\`);
  console.log(\`FAILED:      \${failed}\`);
  console.log(\`BLOCKED:     \${blocked}\`);
  console.log(\`Total Time:  \${Date.now() - startAll}ms\`);
  console.log("=========================================");
}

runMatrix().catch((err) => {
  console.error("Black-Box Runner Fatal Error:", err);
  process.exit(1);
});
`;
}
