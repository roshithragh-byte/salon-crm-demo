# PilotWave Backend Architecture

## Overview
The PilotWave backend is a NestJS application providing a RESTful API for salon management.
It uses Prisma ORM for PostgreSQL database access and includes background job processing.

## Layers

### API Layer
- REST controllers under `src/*/*.controller.ts`
- Global API prefix: `/api/v1` (set in main.ts)
- Public endpoints: services, staff, home, subscribe
- Protected endpoints: bookings, payments, availability, analytics, customers (require JWT)

### Service Layer
- Business logic in `src/*/*.service.ts`
- Direct database access via PrismaService (injected)
- Transaction management for data consistency

### Data Access Layer
- Prisma ORM with PostgreSQL adapter (`PrismaPg`)
- Schema defined in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`

### Background Processing
- Outbox pattern for reliable event delivery
- `OutboxWorker` processes pending events every 10 seconds
- Events: booking created, cancelled, confirmed, completed

### Authentication & Authorization
- JWT-based authentication
- `AuthController.verifyCredentials` validates email/password and returns JWT
- `JwtAuthGuard` validates JWT on protected routes
- Secret: `NEXTAUTH_SECRET`
- Issuer: `next-auth`

### External Integrations
- Notifications via outbox (mocked for WhatsApp, email, etc.)
- Payments webhook handler (Razormock)
- Redis connection configured (not currently used in code)

## Cross-Cutting Concerns
- Logging: Winston logger (configured in `src/logger/winston.logger.ts`)
- Configuration: NestJS ConfigModule with `.env` file
- CORS: Enabled with origin: true (allows all origins in development)
- Error Handling: NestJS built-in exception handling