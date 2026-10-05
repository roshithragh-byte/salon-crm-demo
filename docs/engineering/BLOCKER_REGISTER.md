# Engineering Readiness Blocker Register

**Project:** Salon CRM / PilotWave  
**Repository:** `roshithragh-byte/salon-crm-demo`  
**Baseline branch:** `master`  
**Audit branch:** `audit/blocker-register-b001-b008`  
**Register status:** Active audit; findings are being reproduced against the current deployed checkout.  
**Workstream boundary:** WhatsApp Agent implementation, Meta configuration, provider integration, and live outbound messaging are **ON HOLD** and excluded from this audit.

## Operating rules

- Resolve one blocker at a time, in ID order.
- For each blocker: inspect current source, reproduce or establish evidence, record impact and root cause, implement the narrowest safe fix, add/update tests, run available validation, and record residual risk.
- Do not merge or deploy without explicit authorization.
- Never report a test, migration, or runtime check as passed unless it was actually executed.
- Changes to provider-specific WhatsApp functionality are out of scope. B-005 is limited to generic durable job/outbox semantics already present in the repository; do not implement messaging delivery.

## Status legend

- **Open — preliminary:** source-review lead; current behavior and severity need confirmation.
- **In progress:** active investigation/fix.
- **Fixed — pending validation:** code changed; acceptance checks not yet complete.
- **Verified:** acceptance criteria met with recorded evidence.
- **Blocked:** cannot proceed safely without a dependency or decision.

## Blockers

| ID | Initial priority | Area | Initial finding (preliminary) | Required acceptance criteria | Status |
|---|---|---|---|---|---|
| B-001 | P0 | Authentication secrets and token contract | Confirmed hard-coded client fallback, three server verification fallback secrets, and Nest JWT `default-secret`. Replaced with a single required `NEXTAUTH_SECRET`; runtime validation remains pending. | No insecure production fallback; required secrets fail closed when absent; client/server token format, issuer, audience, expiry, and verification contract are consistent; negative tests reject invalid/expired/wrong-key tokens. | In progress — runtime configuration repaired; validation pending |
| B-002 | P0 | Tenant authorization / RBAC | RolesGuard previously trusted a token's salonSlug claim to authorize a route before resolving that slug against the database, allowing a stale/forged claim to bypass actual membership-to-salon mapping if token issuance is compromised or claim inconsistent. Narrow fix removes this early return; database-resolved salon.id must equal user.salonId. Public customer booking/payment flows remain unauthenticated by product requirement. | Every endpoint is explicitly classified public or protected; protected operations enforce authenticated identity, role, and tenant scope server-side; cross-tenant access tests fail closed; public booking flows disclose only intended data. | Fixed — pending validation |
| B-003 | P0 | Payment webhook authenticity and reconciliation | Earlier review found webhook signature verification absent/deferred and payment-order creation potentially mocked. Confirm current provider integration and production exposure. | Verify provider signature over raw request bytes; validate order/payment ID, amount, currency, and expected state; enforce idempotency/replay protection; reject forged, malformed, mismatched, and duplicate events in tests. No live payment is initiated during audit. | Open — preliminary |
| B-004 | P1 | Booking DTO validation and relational integrity | Earlier review identified weakly typed request bodies and incomplete verification of salon/service/staff relationships. Confirm current DTOs, service queries, and transaction boundaries. | Runtime DTO validation rejects malformed input; every referenced salon, service, staff member, and customer is authorized and mutually consistent; availability and overlap constraints are enforced safely under concurrency; regression tests cover invalid/cross-tenant combinations. | Open — preliminary |
| B-005 | P1 | Generic outbox/job reliability | Earlier review identified process-local worker locking, no demonstrated durable claim/lease, mock dispatch, and weak retry guarantees. Audit only existing generic persistence/worker mechanics; WhatsApp delivery/provider work remains on hold. | Atomic durable claim or lease prevents concurrent duplicate processing; abandoned jobs can be recovered; retries are bounded and classified; idempotency and terminal/dead-letter behavior are explicit; tests cover competing workers and crash/retry scenarios. | Open — preliminary |
| B-006 | P1 | PII-safe logging and error handling | Earlier review found request metadata and serialized event payloads may be logged. Confirm actual sensitive fields and log paths. | Sensitive data, tokens, contact details, and payload contents are redacted or omitted; errors are serialized safely; correlation IDs support diagnosis without leaking secrets; tests or focused checks cover redaction. | Open — preliminary |
| B-007 | P1 | Automated test and CI assurance | Earlier review found test files but no execution evidence, and a server lint script that may be a no-op. Confirm current scripts and CI workflows. | Relevant unit/integration/E2E tests execute reproducibly; lint/typecheck scripts perform real checks; CI runs required gates on proposed changes; failures are reported accurately. | Open — preliminary |
| B-008 | P1 | PostgreSQL/Prisma migration and integrity verification | Earlier review found Prisma/PostgreSQL migration history but no verified live migration state, rollback path, or database constraint audit. No production DB access or migration will be attempted without explicit authorization. | Schema and migrations are reviewed against a disposable/test PostgreSQL database; clean install and upgrade paths succeed; key constraints/indexes and referential integrity are verified; backup/rollback procedure is documented and tested where feasible. | Open — preliminary |

## Execution log

| Date (UTC) | Blocker | Activity | Evidence / result |
|---|---|---|---|
| 2026-10-01 | Register | Created initial B-001–B-008 register on isolated audit branch. | Documentation-only baseline. No application code, database, provider configuration, deployment, or live customer data changed. |
| 2026-10-02 | B-001 | Confirmed fallback-secret paths and applied narrow code changes on audit branch. | Removed client hard-coded secret fallback; removed server candidate-secret loops; changed Nest JWT registration to require configured `NEXTAUTH_SECRET`. Current NextAuth custom encoder and server verifier both use HS256/shared secret. No issuer/audience claims are currently configured. Tests/build/runtime checks were not executable through the GitHub connector; status remains pending validation. Production secret rotation and deployment configuration were not inspected. |
| 2026-10-02 | B-002 | User confirmed customers do not require login. Removed RolesGuard's early authorization return based solely on `user.salonSlug`; salon slug now resolves through the database and must map to `user.salonId`. | Public customer booking and payment initialization intentionally remain unauthenticated. Payment ownership/capability design not changed. Source change committed; tests/build and cross-tenant cases not executable via GitHub connector. Full endpoint inventory remains incomplete. |
| 2026-10-05 | Build blocker | Investigated failed Vercel deployment `dpl_ChfWnxxXhbfoUsmRM55uPhXcXTuA` for commit `01c8d9c9c071a48a06470e1f4e317bb77e13035e`. Compared directly with previous READY deployment commit `d3de8bb87c5953c3906b0f03fd108116b7f96d05`. | Vercel reported `BUILD_UTILS_SPAWN_1`: `npm run build` exited 1. GitHub comparison showed exactly one changed application file, `client/src/proxy.ts`; the commit changed the backend URL regex to a malformed escaped form. This isolated the build regression to that regex change. |
| 2026-10-05 | Build blocker | Applied minimal regex repair in `client/src/proxy.ts`. | Commit `05c35f6bda13eb0b8bfb04fc7299f65e7d9f6e53` changes exactly one application line, restoring the known-good regex. `secret: process.env.NEXTAUTH_SECRET` remains unchanged. |
| 2026-10-05 | Build blocker | Verified repaired Vercel deployment. | Deployment `dpl_CuEsEUAHxTSpVgMowq1rkiaPqJug` reached **READY**. No build error reported. |
| 2026-10-05 | B-001 | Performed first black-box runtime checks against the newly READY deployment. | `/admin/login`, `/admin/dashboard`, and protected API access produced NextAuth `NO_SECRET` runtime failures. Vercel logs explicitly report `MissingSecretError: Please define a secret in production`; middleware/login path returned 307/500 behavior. This is a runtime configuration defect exposed by removing the insecure fallback, not evidence that the hardened code is wrong. |
| 2026-10-05 | B-001 | Repaired shared production secret configuration. | Vercel Production and Railway Production now both have `NEXTAUTH_SECRET` configured with the same newly generated high-entropy secret. Secret value is intentionally not recorded in the repository or audit log. Railway redeployed after configuration change. A fresh Vercel rebuild is required because environment changes do not retroactively modify the existing deployment. |

## Next action

Trigger/observe a fresh Vercel deployment using the corrected application code and configured shared `NEXTAUTH_SECRET`. Once runtime configuration is confirmed healthy, execute the authentication black-box matrix: unauthenticated access, valid login, invalid password, malformed/wrong-key/expired token rejection, insufficient-role denial, authorized dashboard access, and cross-salon denial. Do not alter authentication behavior unless a reproducible black-box test demonstrates a defect.
