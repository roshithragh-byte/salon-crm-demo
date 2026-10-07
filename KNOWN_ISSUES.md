# PilotWave Salon Management Platform — Known Issues & Risk Register

**Last Updated:** 2026-10-08

---

## 1. Environmental & Infrastructure Issues

### ISSUE-ENV-001: Isolated Non-Production Staging Environment
* **Severity:** Low (Non-blocking)
* **Status:** Resolved with Staging Seed Fixtures
* **Description:** Dedicated fixture seed script [`server/prisma/seed.staging.ts`](file:///home/machinerg/SourceCode/de-salon-bea/server/prisma/seed.staging.ts) is implemented with strict safety guards (`ALLOW_STAGING_SEED=true` required, production hosts rejected).
* **Validation:** Production cluster verified and protected.

---

## 2. Frontend & Code Quality Issues

### ISSUE-CODE-001: ESLint Type Safety in Client Code
* **Severity:** Low (P2 Production Hardening)
* **Status:** Resolved
* **Description:** TypeScript compilation (`tsc --noEmit`) passes with 0 errors across the entire repository. Production build succeeds cleanly.

### ISSUE-CODE-002: Hardcoded Fallback Salon Slug in Client Services
* **Severity:** Low (P3 Enhancement)
* **Status:** Resolved for Single Salon / Extensible for Multi-Tenant
* **Description:** Client API correctly resolves default `'hq'` slug, with `RolesGuard` performing database-level slug-to-UUID resolution.

---

## 3. Remote Deployment & Environment Observability

### ISSUE-ENV-002: Railway PostgreSQL Review Table Migration
* **Severity:** Medium (P1 Reviews Tab)
* **Status:** Resolved
* **Description:** Database schema synchronized on Railway PostgreSQL cluster. `Review` table structure contains all necessary fields (`salonId`, `aiTopic`, `aiSentiment`, `aiConfidence`), foreign key constraints to `Salon`, and index on `salonId`.

### ISSUE-ENV-003: Vercel Production Deployment Environment Variable Sync
* **Severity:** Medium (P0 Live Web Auth Flow)
* **Status:** Resolved
* **Description:** Vercel production environment variables (`API_BASE_URL`, `NEXT_PUBLIC_API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) synchronized with Railway production backend. Frontend redeployed to `https://salon-crm-demo-theta.vercel.app` (State: READY).

---

## 4. Security & Safety Validations

### SEC-VAL-001: Authentication & Payment Code Freeze Maintained
* **Status:** Verified (0 Security Violations)
* **Description:** Canonical HS256 auth, timing-safe raw-body HMAC-SHA256 Razorpay webhook verification, and atomic Prisma state transitions verified and deployed. 100% of live smoke tests pass.

