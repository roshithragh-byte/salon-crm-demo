# PilotWave Client Integration Contract

## Overview
This document specifies the exact interface that a client application must use to integrate with the PilotWave backend server.

## Server Information
- **Development Server URL**: `http://localhost:3001`
- **Production Server URL**: Configured via `API_BASE_URL` environment variable
- **API Base Path**: `/api/v1` (all endpoints are prefixed with this)
- **Protocol**: HTTPS in production, HTTP in development
- **Data Format**: JSON for all requests and responses

## CORS Configuration
- **Allowed Origin (Development)**: `http://localhost:3000`
- **Allowed Origin (Production)**: Configured via `ALLOWED_ORIGIN` environment variable
- **Allowed Methods**: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization, X-Requested-Id, and standard headers
- **Credentials**: Cookies and HTTP authentication are supported

## Authentication Integration

### Step 1: Obtain Authentication Token
**Request**:
```
POST /api/v1/auth/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response**:
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "81c352ec-3888-4403-a34b-2235d9f20998",
    "email": "test@example.com",
    "name": "Test User",
    "role": "OWNER",
    "salonId": "d88b9b53-999c-4bcf-bf6e-224939b42376"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWMzNTJlYy0zODg4LTQ0MDMtYTM0Yi0yMjM1ZDlmMjA5OTgiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Ik9XTkVSIiwic2Fsb25JZCI6ImQ4OGI5YjUzLTk5OWMtNGJjZi1iZjZlLTIyNDkzOWI0MjM3NiIsImlzcyI6Im5leHQtYXV0aCIsImlhdCI6MTc4OTUzMzA4OCwiZXhwIjoxNzg5NTM2Njg4fQ.E-wS4H1DRl60Kv_kjxh7t8MxpbkTg8rSO9nesGEeY6Y"
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Malformed JSON

### Step 2: Store the Token Securely
- Store the token in secure storage (e.g., HttpOnly cookie, secure session storage)
- **Never** store token in localStorage or sessionStorage for production applications due to XSS risks
- Token is valid for 1 hour from issuance

### Step 3: Make Authenticated Requests
Include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <token>
```

**Example**:
```
GET /api/v1/salons/:salonId/services
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Handle Token Expiration
- When receiving a `401 Unauthorized` response from a protected endpoint:
  1. Check if the response indicates token expiration
  2. If expired, redirect user to login screen to obtain new token
  3. Optionally implement refresh token flow (not currently supported)

## Request/Response Format Standards

### Request Format
- Content-Type: `application/json` (for requests with body)
- Body: JSON object matching endpoint schema
- Headers: Include `Authorization: Bearer <token>` for protected endpoints

### Response Format
- Content-Type: `application/json`
- Success responses typically follow `{ "data": <payload> }` or `{ "data": [<array>] }` for collections
- Error responses follow `{ "message": "<error message>", "error": "<error type>", "statusCode": <http code> }`

### Standard Response Envelopes
| Endpoint Type | Success Response Format |
|---------------|-------------------------|
| Single item | `{ "data": <object> }` |
| Collection | `{ "data": [<array>] }` |
| Operation result | `{ "data": <object> }` |
| Webhooks | `{ "received": true }` |

## Error Handling
Clients should handle these standard HTTP status codes:

| Status Code | Meaning | Client Action |
|-------------|---------|---------------|
| 200 | Success | Process response data |
| 201 | Created | Process response data (often for POST) |
| 400 | Bad Request | Fix request data and retry (validation error) |
| 401 | Unauthorized | Authenticate user to get new token |
| 403 | Forbidden | User lacks permissions (not currently used) |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource conflict (e.g., duplicate booking) |
| 422 | Unprocessable Entity | Semantic validation errors |
| 429 | Too Many Requests | Rate limited - retry after delay |
| 500 | Internal Server Error | Retry or show error message |
| 503 | Service Unavailable | Temporary outage - retry after delay |

## Environment Variables Required
The following environment variables must be configured for the server to operate correctly:

### Required for All Environments
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for JWT signing (minimum 32 characters recommended)

### Development Specific
- `NODE_ENV=development`
- `NEXTAUTH_URL=http://localhost:3000` (for NextAuth compatibility)
- `ALLOWED_ORIGIN=http://localhost:3000` (CORS origin)

### Optional Configuration
- `REDIS_URL`: Redis connection string (for production features)
- `API_BASE_URL`: Base URL for absolute links in emails/etc.
- `API_PORT`: Port for server to listen on (default: 3001)
- `PORT`: Alternative port configuration (default: 3000)

## Exact Endpoint Specifications

### Authentication
- **POST** `/api/v1/auth/verify`
  - Auth: None (uses email/password)
  - Returns: `{ user, token }`
  - Uses: Login flow

### Public Endpoints (No Auth Required)
- **GET** `/api/v1/health`
  - Returns: `{ status: "ok" }`
  - Uses: Health checks, monitoring
  
- **GET** `/api/v1/salons/:salonId/services`
  - Returns: `{ data: [{ id, name, durationMinutes }] }`
  - Uses: Service listings
  
- **GET** `/api/v1/salons/:salonId/staff`
  - Returns: `{ data: [{ id, name }] }`
  - Uses: Staff listings
  
- **POST** `/api/v1/subscribe`
  - Accepts: `{ email: "string" }`
  - Returns: `{ success: true, alreadySubscribed: boolean }`
  - Uses: Newsletter signup
  
- **GET** `/api/v1/home`
  - Returns: `{ data: { packages, standardServices, reviews } }`
  - Uses: Home page data
  
- **GET** `/api/v1/salons/:salonId/services/:serviceId`
  - Returns: `{ data: <service object> }`
  - Uses: Service detail page
  - Note: Validates that service belongs to salon
  
- **GET** `/api/v1/services/:serviceId`
  - Returns: `{ data: <service object with category and addons> }`
  - Uses: Service detail page (alternative route)

### Protected Endpoints (Require Valid JWT)
- **POST** `/api/v1/salons/:salonId/bookings`
  - Creates a new booking
  - Requires proper booking data in body
  
- **PATCH** `/api/v1/salons/:salonId/bookings/:bookingId/cancel`
  - Cancels an existing booking
  
- **POST** `/api/v1/salons/:salonId/bookings/:bookingId/complete`
  - Marks booking as completed, awards loyalty points
  
- **POST** `/api/v1/salons/:salonId/bookings/:bookingId/payment`
  - Creates payment order for booking
  
- **POST** `/api/v1/payments/webhook/:provider`
  - Handles payment provider webhooks (e.g., razorpay)
  
- **GET** `/api/v1/salons/:salonId/availability`
  - Calculates time slot availability
  
- **GET** `/api/v1/salons/:salonId/analytics/dashboard`
  - Returns business analytics
  
- **GET** `/api/v1/salons/:salonId/customers`
  - Lists customers for salon
  
- **GET** `/api/v1/salons/:salonId/customers/:customerId`
  - Gets customer details
  
- **PATCH** `/api/v1/salons/:salonId/customers/:customerId`
  - Updates customer information

## Implementation Checklist
[ ] Implement login form calling POST /api/v1/auth/verify
[ ] Securely store returned token
[ ] Add Authorization header to all protected requests
[ ] Handle 401 responses by triggering re-login
[ ] Use correct content-type (application/json) for JSON requests
[ ] Handle standard error responses appropriately
[ ] Respect rate limits if encountered
[ ] Verify CORS configuration allows your origin
[ ] Test with both valid and invalid tokens
[ ] Verify token expiration handling works correctly
[ ] Confirm public endpoints work without authentication
[ ] Validate that salon-owned resources enforce ownership

## Versioning
- All contracts are for API version v1 (`/api/v1/` prefix)
- Backward compatibility will be maintained within v1 where possible
- Breaking changes will result in version increment to v2

## Support
For integration questions, refer to:
- This document
- API_INVENTORY.md for endpoint details
- AUTHENTICATION_CONTRACT.md for JWT specifics
- BACKEND_ARCHITECTURE.md for system overview