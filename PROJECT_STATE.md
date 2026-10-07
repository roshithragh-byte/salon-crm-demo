# PilotWave Salon Management Platform — Project State

**Last Updated:** 2026-10-06
**Status:** Audit & Orchestration Active

---

## 1. Executive Summary & Architecture Overview

PilotWave is a multi-tenant Salon Management & CRM SaaS platform tailored for independent and multi-location luxury wellness studios and salons.

### 1.1 Architecture Topology
```text
Browser Client (Desktop / Mobile)
   │
   ├── Public Journeys: Landing (/), Booking Wizard (/appointments), Catalogue (/catalogue/[id])
   ├── Customer Journey: Account Portal (/account)
   └── Admin Journey: Admin Shell (/admin/dashboard, /admin/bookings, /admin/customers, /admin/services, /admin/staff, /admin/reviews, /admin/profile)
   │
   ▼
Next.js 16.3.5 App Router (`client/`) [Hosted on Vercel]
   │
   ├── NextAuth Session Management (JWT strategy with HS256, 30-day session)
   ├── Edge/Node Middleware Proxy (`client/src/proxy.ts` -> rewrites `/api/v1/*` + injects Bearer session)
   └── Server-only Vercel Sandbox Orchestrator (`client/src/lib/server/sandbox/*`)
   │
   ▼
NestJS 10 REST API Backend (`server/`) [Hosted on Railway]
   │
   ├── Global prefix: `/api/v1`
   ├── Modules: Auth, Me, Staff, Customers, Bookings, Availability, Payments, Analytics, Reviews, Notifications, TypeSafe AI
   ├── Guards: `JwtAuthGuard` (JWT verification via `jose`), `RolesGuard` (Role & Salon tenant isolation)
   └── Winston structured logger + Async Outbox Event Worker
   │
   ▼
PostgreSQL Database Cluster (Prisma 7.10 ORM)
   └── Tables: User, Salon, SalonMember, Customer, ServiceCategory, Service, ServiceAddon, StaffService, SalonBusinessHour, StaffSchedule, StaffTimeOff, Appointment, Payment, Review, LoyaltyTransaction, Notification, Subscription, OutboxEvent, AuditLog
```

---

## 2. Audit of Existing Functionality & Module Health

| Subsystem | Intended Capability | Current Implementation Status | Verified Behavior / Findings |
| :--- | :--- | :--- | :--- |
| **Authentication** | NextAuth + NestJS JWT (`POST /api/v1/auth/verify`) | **COMPLETE & FROZEN** | Verified 5/5 negative auth tests (`AUTH-002`..`AUTH-006`). Strictly rejects invalid passwords, missing tokens, malformed JWTs, expired JWTs, and wrong-key signatures. |
| **Public Landing Page** | Brand hero, video, ethos, curated services teaser, gallery, business info | **COMPLETE** | Fully styled with dark luxury aesthetic, responsive typography, video background, and static gallery manifests. |
| **Catalogue & Service Detail** | Detail view for services (`/catalogue/[id]`), add-ons, pricing | **COMPLETE** | Fetches live service details via `GET /api/v1/services/:id`, renders category, duration, pricing, and add-on links. |
| **Booking & Availability Flow** | Step-by-step wizard (`/appointments`), live slot calculation, payment webhook simulation | **COMPLETE** | Live slot calculation via `GET /api/v1/salons/:id/availability`, transactional booking creation with conflict detection and idempotency, simulated Razorpay webhook capture. |
| **Admin Dashboard** | Real KPI stats, next appointments list, service popularity chart | **COMPLETE** | Connects to `GET /api/v1/salons/:id/analytics/dashboard`, calculates real total revenue, bookings count, today's appointments, and Recharts popularity breakdown. |
| **Admin Bookings Management** | Filterable bookings table (`/admin/bookings`), status badges, customer details | **COMPLETE** | Connects to `GET /api/v1/salons/:id/bookings`, supports real-time customer search and status tags (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`). |
| **Admin Customer Directory** | Client list, phone/email search, visit count, loyalty points | **COMPLETE** | Connects to `GET /api/v1/salons/:id/customers`, tracks real visit counts and accumulated loyalty points. |
| **Admin Service Catalogue** | Service pricing, duration, offer pricing table | **COMPLETE** | Connects to `GET /api/v1/salons/:id/services`, displays duration and tiered base/offer pricing. |
| **Admin Staff Management** | Staff listing and modal account creation | **COMPLETE** | Connects to `GET /api/v1/salons/:id/staff` and `POST /api/v1/salons/:id/staff`. |
| **Admin Reviews & Sentiment** | AI-driven review topic breakdown & sentiment scoring | **COMPLETE** | Connects to `GET /api/v1/salons/:id/reviews` and `/reviews/summary` with sentiment badges. |
| **Customer Account Portal** | Customer appointment history, upcoming bookings, loyalty points | **COMPLETE** | Connects to `GET /api/v1/me/appointments` and `GET /api/v1/me/profile`. |
| **TypeSafe AI Integration** | Intent classification, no-show assessment, semantic conflict detection, review analysis, staff matching | **COMPLETE** | 8/8 Jest unit tests passing (`server/src/typesafe/typesafe.spec.ts`). |
| **Loyalty Ledger** | 10% point accrual on appointment completion, audit ledger | **COMPLETE** | Embedded in `BookingsService.completeBooking` with `LoyaltyTransaction` records. |
| **Vercel Sandbox Diagnostics** | External black-box test runner inside microVM | **COMPLETE** | Server-only runner with operation allowlists, rate limiting, and output sanitization. |

---

## 3. Discovered Inconsistencies, Risks & Blockers

1. **Staging Infrastructure Provisioning (Environmental Blocker)**:
   - The repository is configured against the production Railway PostgreSQL cluster (`mainline.proxy.rlwy.net:14802/railway`).
   - Remote CLI / API credentials for creating dedicated `audit-staging` environments on Railway and Vercel are absent in the local agent environment.
   - Local Docker socket access is restricted, preventing transient local PostgreSQL container creation.
   - **Remediation**: Dedicated staging fixture mechanism [`server/prisma/seed.staging.ts`](file:///home/machinerg/SourceCode/de-salon-bea/server/prisma/seed.staging.ts) is prepared and protected with safety guards.

2. **Client-side ESLint Warnings/Errors in Legacy Files**:
   - `npm run lint` in `client/` reports explicit `any` usages and unescaped entities in existing components (`BookingForm.tsx`, `CustomerDashboard.tsx`, `services.ts`, etc.).
   - While TypeScript compilation (`npx tsc --noEmit`) passes cleanly with 0 errors and Next.js builds successfully (`npm run build`), linting should be cleaned up as a P2 production hardening task without touching frozen authentication files.

3. **Multi-Tenant Hardcoded Slug Default**:
   - Several admin views use default slug `'hq'` (`BookingApi.getAvailableServices('hq')`).
   - The backend `RolesGuard` supports resolving both UUIDs and slugs, but dynamic multi-salon selection from the user's active session (`session.user.salonSlug || session.user.salonId`) will make the admin interface fully multi-tenant aware.

---

## 4. Master Deployment State

- **Canonical Production Frontend**: `https://salon-crm-demo-theta.vercel.app` (State: `READY`)
- **Canonical Production Backend API**: `https://salon-crm-demo-production.up.railway.app`
- **Database Engine**: PostgreSQL with Prisma 7.10 Client & Adapter
- **Active Code Freeze**: Authentication and authorization implementations (`client/src/lib/auth.*`, `client/src/proxy.*`, `client/src/app/api/auth/**`, `server/src/auth/**`, `server/src/auth.ts`) are under strict freeze.
