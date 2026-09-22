# PilotWave Client Architecture

## Overview

The PilotWave client is a Next.js 16.3.0 application with App Router that communicates exclusively with the PilotWave server via HTTP/JSON APIs. The client follows a modular architecture with clear separation of concerns between UI components, data fetching layers, authentication, and utilities.

## Technology Stack

- **Framework**: Next.js 16.3.0 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js with JWT
- **HTTP Client**: Custom ApiClient wrapper
- **UI Components**: shadcn/ui primitives

## Directory Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/           # Admin dashboard routes
│   ├── appointments/    # Booking flow routes
│   └── ...              # Other routes
├── components/          # Reusable UI components
├── lib/                 # Core libraries and utilities
│   ├── api/             # API client and service definitions
│   ├── auth.ts          # NextAuth configuration
│   └── ...              # Other utilities
├── styles/              # Global styles
└── ...                  # Other directories
```

## Key Components

### 1. API Client (`src/lib/api/client.js`)

The centralized API client handles all HTTP requests to the server with automatic JWT token attachment and error handling:

- Automatically retrieves JWT from sessionStorage
- Attaches `Authorization: Bearer <token>` header to requests
- Handles 401 Unauthorized responses by redirecting to login
- Provides generic GET, POST, PUT, DELETE methods with TypeScript support
- Configurable base URL via `NEXT_PUBLIC_API_URL` environment variable

### 2. API Services (`src/lib/api/services.ts`)

Service-specific wrappers around the API client with proper TypeScript interfaces:

- `AuthApi`: Handles authentication endpoints (login, verify)
- `DashboardApi`: Fetches dashboard analytics data
- `BookingApi`: Manages appointment booking flows
- Each service returns strongly typed responses matching server contracts

### 3. Authentication (`src/lib/auth.ts`)

NextAuth configuration with custom JWT handling:

- Credentials provider for email/password authentication
- JWT callback captures access token from server response
- Stores token in sessionStorage for API client access
- Session callback makes token available to client components
- Handles token cleanup on signout

### 4. Environment Configuration

Environment variables managed via `.env.local`:

- `NEXTAUTH_URL`: URL for NextAuth (client URL)
- `NEXT_PUBLIC_API_URL`: Base URL for server API
- `NEXTAUTH_SECRET`: Secret for JWT encryption

## Data Flow

1. **Authentication Flow**:
   - User submits login credentials via NextAuth
   - Server validates credentials and returns JWT
   - NextAuth JWT callback stores token in sessionStorage
   - ApiClient automatically attaches token to subsequent requests

2. **Data Fetching Flow**:
   - UI components call service methods (e.g., `DashboardApi.getDashboardData()`)
   - Service methods use ApiClient to make HTTP requests
   - ApiClient attaches JWT from sessionStorage
   - Server validates token and returns requested data
   - Components update state with received data

3. **Mutation Flow**:
   - Form submissions trigger API calls via service methods
   - Same authentication flow applies for POST/PUT/DELETE requests
   - Success/error handling managed in components

## Security Considerations

- JWT tokens stored in sessionStorage (XSS consideration mitigated by HttpOnly cookies for session token)
- All API communication happens over HTTPS in production
- CORS configuration on server restricts origins
- Route protection via authentication checks in API client
- 401 handling redirects unauthenticated users to login

## Error Handling

- ApiClient catches network errors and HTTP errors
- 401 responses trigger redirect to login page
- Other errors are logged and displayed to users via UI state
- Loading states provide feedback during requests
- Error boundaries prevent app crashes from component errors

## Performance Optimizations

- React Query could be added for caching (currently using React state)
- Code splitting via Next.js dynamic imports
- Image optimization via Next.js Image component
- Efficient revalidation in server actions
- Minimal bundle size through tree-shaking

## Development Guidelines

1. All API communication must go through ApiClient
2. Never hardcode API endpoints - use service methods
3. Keep components focused on UI - delegate data fetching to services/hooks
4. Use TypeScript interfaces for all API responses
5. Handle loading and error states in all data-fetching components
6. Follow Next.js App Router conventions (client/server components)
7. Store environment variables in .env.local (never commit)