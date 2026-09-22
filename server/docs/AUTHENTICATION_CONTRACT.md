# PilotWave Authentication Contract

## Overview
This document describes the authentication mechanism used by the PilotWave backend API.

## Authentication Flow
Clients authenticate by:
1. Sending a POST request to `/api/v1/auth/verify` with email and password
2. Receiving a JWT token in the response
3. Including the token in the `Authorization` header as `Bearer <token>` for subsequent requests to protected endpoints

## Endpoint: POST /api/v1/auth/verify

### Request
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

### Success Response
```json
{
  "user": {
    "id": "string (uuid)",
    "email": "string (email)",
    "name": "string (firstName + lastName)",
    "role": "string (OWNER|ADMIN|STYLIST|STAFF|CUSTOMER)",
    "salonId": "string (uuid)"
  },
  "token": "string (JWT)"
}
```

### Error Responses
| Status Code | Condition | Response Body |
|-------------|-----------|---------------|
| 400 | Missing email or password | `{ "message": "Email and password are required", "error": "Bad Request" }` |
| 401 | Invalid credentials | `{ "message": "Invalid credentials", "error": "Unauthorized" }` |
| 400 | Malformed JSON | `{ "message": "<json parse error>", "error": "Bad Request" }` |

## JWT Token Specification

### Algorithm
- HS256 (HMAC with SHA-256)

### Signing Secret
- Derived from `NEXTAUTH_SECRET` environment variable
- Defaults to `'default-secret'` if not set (for development only)

### Claims
| Claim | Type | Description |
|-------|------|-------------|
| `sub` | string | User ID (matches `user.id` in response) |
| `email` | string | User's email address |
| `name` | string | User's full name (firstName + lastName) |
| `role` | string | User's role in their primary salon |
| `salonId` | string | ID of the user's primary salon |
| `iss` | string | Issuer, always `"next-auth"` |
| `iat` | integer | Issued at timestamp (seconds since epoch) |
| `exp` | integer | Expiration timestamp (seconds since epoch, 1 hour after iat) |

### Token Lifetime
- 1 hour (3600 seconds)
- Expiration is enforced by the `JwtAuthGuard`

### Format
- Bearer token: `Authorization: Bearer <jwt_token>`

## Protected Endpoints
All endpoints under `/api/v1/` except those explicitly listed as public require a valid JWT token.

### Protected Endpoints Examples
- `POST /api/v1/salons/:salonId/bookings`
- `PATCH /api/v1/salons/:salonId/bookings/:bookingId/cancel`
- `POST /api/v1/salons/:salonId/bookings/:bookingId/complete`
- `POST /api/v1/salons/:salonId/bookings/:bookingId/payment`
- `POST /api/v1/payments/webhook/:provider`
- `GET /api/v1/salons/:salonId/availability`
- `GET /api/v1/salons/:salonId/analytics/dashboard`
- `GET /api/v1/salons/:salonId/customers`
- `GET /api/v1/salons/:salonId/customers/:customerId`
- `PATCH /api/v1/salons/:salonId/customers/:customerId`

### Public Endpoints (No Authentication Required)
- `GET /api/v1/health`
- `GET /api/v1/salons/:salonId/services`
- `GET /api/v1/salons/:salonId/staff`
- `POST /api/v1/subscribe`
- `GET /api/v1/home`
- `GET /api/v1/salons/:salonId/services/:serviceId` (with salon ownership validation)
- `GET /api/v1/services/:serviceId`

## Authorization
- Authentication verifies the user's identity
- All authenticated users have access to all protected endpoints (role-based authorization is not currently implemented)
- Salon ownership is validated on relevant endpoints (e.g., accessing a service requires that the service belongs to the specified salon)

## Security Considerations
- Tokens expire after 1 hour
- Invalid/malformed tokens result in 401 Unauthorized
- Missing Authorization header results in 401 Unauthorized
- Credentials are validated before authentication
- Passwords are verified using argon2 hashing
- JWT secret should be kept secure and not exposed in client-side code