# PilotWave Salon Management Platform — Architectural Decisions Record (ADR)

**Last Updated:** 2026-10-06

---

## ADR-001: Next.js + NestJS Separation of Concerns
* **Context:** The repository consists of a Next.js App Router client (`client/`) and a NestJS REST API backend (`server/`).
* **Decision:** Maintain clean separation between the frontend presentation layer and the backend business logic/data layer. Next.js handles server-side rendering, routing, and NextAuth session encapsulation. NestJS handles domain logic, Prisma ORM transactions, scheduling, AI evaluation, and business rules.
* **Status:** Accepted & Enforced.

---

## ADR-002: NextAuth JWT Session Encapsulation and Edge Middleware Proxy
* **Context:** The client runs on Vercel while the backend API runs on Railway. Direct browser-to-backend requests with cross-origin cookies introduce CORS and cookie-domain friction.
* **Decision:** The Next.js middleware proxy (`client/src/proxy.ts`) acts as a secure reverse proxy rewriting `/api/v1/*` requests to the Railway backend API, automatically reading the NextAuth session token and attaching the `Authorization: Bearer <token>` header.
* **Status:** Accepted & Verified.

---

## ADR-003: Server-Only Vercel Sandbox Integration for Diagnostics
* **Context:** Engineering diagnostics and black-box verification must run in an isolated environment without browser execution privileges or exposure of internal secrets.
* **Decision:** Implement `@vercel/sandbox` (3.5.1) strictly within server-only modules (`client/src/lib/server/sandbox/*`) under `/api/internal/sandbox` protected by NextAuth `ADMIN`/`OWNER` role authorization, sliding-window rate limiting, and regex-based secret redaction.
* **Status:** Accepted & Live Runtime Proven.

---

## ADR-004: Absolute Code Freeze on Authentication Subsystems
* **Context:** Multiple verification cycles depend on stable, untampered authentication contracts.
* **Decision:** Enforce an absolute code freeze on `client/src/lib/auth.*`, `client/src/proxy.*`, `client/src/app/api/auth/**`, `server/src/auth/**`, `server/src/auth.ts`, and `server/src/main.ts`. Zero changes are permitted to these files without explicit human authorization.
* **Status:** Accepted & Maintained.

---

## ADR-005: PostgreSQL Database Normalization & Multi-Tenancy Scope
* **Context:** Database models support multi-tenant salons with `SalonMember`, `Customer`, `Service`, `Appointment`, and `LoyaltyTransaction`.
* **Decision:** Maintain fully relational PostgreSQL schema using Prisma ORM. No NoSQL or SQLite conversions. All tenant isolation is enforced at the database query level via `salonId` foreign keys and checked by NestJS `RolesGuard`.
* **Status:** Accepted & Enforced.

---

## ADR-006: Canonical HS256 Authentication & Fallback Secret Removal
* **Context:** Previous authentication code contained fallback secret strings (`'default-secret'`, `'salondebea-auth-secret-change-in-production'`) in verification loops that compromised zero-trust security.
* **Decision:** Enforce a single canonical JWT contract:
  1. Algorithm: `HS256` strictly.
  2. Issuer (`iss`): `'pilotwave-salon-auth'`.
  3. Audience (`aud`): `'pilotwave-salon-api'`.
  4. Mandatory claims: `id`/`sub`, `email`, `role`, `salonId`.
  5. Removal of all fallback secrets from both frontend (`client/src/lib/auth.ts`, `client/src/proxy.ts`) and backend (`server/src/auth/**`). Missing or default secrets trigger fatal startup exceptions.
* **Status:** Accepted & Implemented (13/13 Security Tests PASS).

---

## ADR-007: Server-Authoritative Razorpay Webhook Verification & Zero Client Webhook Calls
* **Context:** Client-side booking previously called `/payments/webhook/razorpay` to simulate payment success without signature verification.
* **Decision:**
  1. Webhooks are strictly provider-to-server (`Razorpay` ➔ `NestJS`).
  2. Verification requires raw request body bytes via `NestFactory.create(AppModule, { rawBody: true })` and timing-safe HMAC-SHA256 comparison against `RAZORPAY_WEBHOOK_SECRET`.
  3. Payment state transitions (`CREATED` ➔ `SUCCESS` / `FAILED`) and booking confirmation (`PENDING` ➔ `CONFIRMED` / `PAYMENT_FAILED`) are executed atomically inside a Prisma transaction.
  4. Client `BookingForm.tsx` is completely disconnected from webhook endpoints and passes client-scoped `idempotencyKey` headers.
* **Status:** Accepted & Verified (13/13 Payment Security Tests PASS).


