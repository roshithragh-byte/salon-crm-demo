# PilotWave API Inventory

## Conventions
- All endpoints are prefixed with `/api/v1` (set in main.ts via `app.setGlobalPrefix('api/v1')`)
- Authentication: Protected endpoints require `Authorization: Bearer <JWT>` header
- JWT is issued by `POST /api/v1/auth/verify`

## Endpoints

### Public Endpoints (No Authentication Required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check endpoint |
| GET | `/api/v1/salons/:salonId/services` | List active services for a salon |
| GET | `/api/v1/salons/:salonId/staff` | List active staff members for a salon |
| POST | `/api/v1/subscribe` | Subscribe to newsletter (email) |
| GET | `/api/v1/home` | Get home page data (packages, standard services, reviews) |
| GET | `/api/v1/salons/:salonId/services/:serviceId` | Get service details by ID (note: does not filter by salonId in current implementation) |
| GET | `/api/v1/services/:serviceId` | Get service details with category and addons |

### Protected Endpoints (Require Valid JWT)

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/v1/auth/verify` | Verify email/password and return JWT token and user data | No (credentials) |
| GET | `/api/v1/salons/:salonId/availability` | Calculate availability for a salon, date, service, and optional stylist | Yes |
| POST | `/api/v1/salons/:salonId/bookings` | Create a new booking | Yes |
| PATCH | `/api/v1/salons/:salonId/bookings/:bookingId/cancel` | Cancel a booking | Yes |
| POST | `/api/v1/salons/:salonId/bookings/:bookingId/complete` | Complete a booking (mark as completed, award loyalty points) | Yes |
| POST | `/api/v1/salons/:salonId/bookings/:bookingId/payment` | Create a payment order for a booking | Yes |
| POST | `/api/v1/payments/webhook` | Handle payment provider webhook (currently Razorpay mock) | Yes (but note: param issue) |
| GET | `/api/v1/salons/:salonId/analytics/dashboard` | Get dashboard analytics for a salon | Yes |
| GET | `/api/v1/salons/:salonId/customers` | List customers for a salon | Yes |
| GET | `/api/v1/salons/:salonId/customers/:customerId` | Get customer details | Yes |
| PATCH | `/api/v1/salons/:salonId/customers/:customerId` | Update customer details | Yes |

## Notes on Current Implementation

1. **Payment Webhook Endpoint**: The `handleWebhook` method in `PaymentsController` incorrectly uses `@Param('provider')` when the route path does not contain a `:provider` parameter. This will result in `provider` being `undefined`. The method expects to receive the provider in the URL path, but the route is fixed as `payments/webhook`.

2. **Service Endpoint**: The `GET /salons/:salonId/services/:serviceId` endpoint in `AppController` does not verify that the service belongs to the given salon (it only checks by service ID). This could allow accessing services from other salons if IDs are guessed.

3. **CORS**: Currently configured with `origin: true` which allows all origins. In production, this should be restricted to trusted domains.

4. **Global Prefix**: All endpoints are under `/api/v1` as set in `main.ts`.

## Security Considerations

- Protected endpoints use `JwtAuthGuard` to validate JWT tokens.
- JWT is signed with `NEXTAUTH_SECRET` using NestJS JwtService (default HS256 algorithm).
- Tokens include standard claims: sub, email, name, role, salonId, iss, iat.
- No expiration (`exp`) claim is currently included in the token (this may be a security issue).

## Database Effects

Each endpoint's effect on the database is documented in the respective service methods. Generally:
- CREATE operations: bookings, customers, payments, loyalty transactions, outbox events
- UPDATE operations: booking status, payment status, customer details, loyalty points
- READ operations: most endpoints
- DELETE operations: none currently exposed via API (but internal cleanup may occur)

## External Side Effects

- Notifications: Outbox events are created for booking-related actions (created, cancelled, confirmed, completed) and processed by `OutboxWorker` (currently logs mock notifications)
- Payments: Webhook endpoint updates payment status and booking status upon successful capture