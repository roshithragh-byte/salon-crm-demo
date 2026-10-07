# PilotWave Salon Management Platform — Known Issues & Risk Register

**Last Updated:** 2026-10-06

---

## 1. Environmental & Infrastructure Issues

### ISSUE-ENV-001: Isolated Non-Production Staging Environment Missing
* **Severity:** Medium (QA Blocker for Positive Authentication Tests)
* **Status:** Blocked on external credentials / tool access
* **Description:** The local development and CI/agent environment currently connects directly to the production Railway database cluster. No isolated `audit-staging` PostgreSQL database or separate Vercel preview deployment is accessible via CLI tools without external API tokens.
* **Impact:** Positive authentication tests (`AUTH-001`, `AUTH-007`, `AUTH-008`, `AUTH-009`) cannot be executed against production without inserting synthetic accounts into the live database.
* **Mitigation:**
  1. Negative authentication test suite (`AUTH-002` through `AUTH-006`) is 100% verified and passing against live endpoints.
  2. Deterministic fixture seed script `server/prisma/seed.staging.ts` is implemented with safety guards (`ALLOW_STAGING_SEED=true` required, production hosts rejected).

---

## 2. Frontend & Code Quality Issues

### ISSUE-CODE-001: ESLint Type Safety in Client Code
* **Severity:** Low (P2 Production Hardening)
* **Status:** Resolved (Non-Auth Scope)
* **Description:** All non-auth UI components and services (`client/src/lib/api/services.ts`, `client/src/components/*`, `client/src/app/*`) have been strongly typed with 0 lint errors. The remaining 6 lint errors are strictly isolated to frozen authentication files (`client/src/lib/auth.ts`, `client/src/proxy.ts`) which cannot be modified under the absolute auth code freeze.

### ISSUE-CODE-002: Hardcoded Fallback Salon Slug in Client Services
* **Severity:** Low (P3 Architectural Enhancement)
* **Status:** Open
* **Description:** Client API calls in `client/src/lib/api/services.ts` default to `salonId = 'hq'`.
* **Impact:** For single-salon deployments (`hq`), all operations function flawlessly. In multi-tenant environments with multiple active salons, the client should dynamically read the active salon from the user session.
* **Resolution Plan:** Ensure `useSession()` / active salon context dynamically supplies the active `salonId`/`salonSlug` when making tenant-scoped requests.

---

## 3. Remote Deployment & Environment Observability

### ISSUE-ENV-002: Railway PostgreSQL Review Table Migration
* **Severity:** Medium (P1 Reviews Tab)
* **Status:** Pending Railway Database Migration
* **Description:** The deployed Railway PostgreSQL database has not executed `prisma migrate deploy` for the new `Review` model, causing `GET /api/v1/salons/hq/reviews` to return HTTP 500.
* **Resolution:** Execute `prisma migrate deploy` against the remote Railway database during the next deployment.

### ISSUE-ENV-003: Vercel Production Deployment Environment Variable Sync
* **Severity:** Medium (P0 Live Web Auth Flow)
* **Status:** Pending Vercel Redeployment
* **Description:** The live Vercel deployment (`https://salon-crm-demo-theta.vercel.app`) returns `fetch failed` on `/api/auth/callback/credentials` because the remote Vercel build was deployed prior to the local client fallback URL synchronization. Direct Railway API `/api/v1/auth/verify` returns HTTP 200 OK.
* **Resolution:** Redeploy Vercel with the current repository HEAD.

---

## 4. Security & Safety Validations

### SEC-VAL-001: Authentication Code Freeze Maintained
* **Status:** Verified (0 Modifications)
* **Description:** Strict code freeze is enforced on all authentication paths (`client/src/lib/auth.*`, `client/src/proxy.*`, `client/src/app/api/auth/**`, `server/src/auth/**`, `server/src/auth.ts`, `server/src/main.ts`).
* **Verification:** `git diff` confirms 0 modifications across all frozen auth paths.
