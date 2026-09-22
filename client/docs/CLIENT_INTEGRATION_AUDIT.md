# Client Integration Audit

## Package.json
- Has Prisma dependencies (@prisma/client, @prisma/adapter-pg, @prisma/adapter-better-sqlite3, prisma, @prisma/engines)
- Has Redis dependency (@upstash/redis)
- These are backend coupling and must be removed if not used for type generation only
- No actual imports of Prisma or Redis in source code (checked)

## Next.js Configuration
- next.config.ts defines rewrites for /api/v1/* to proxy to backend
- Uses API_BASE_URL environment variable (defaults to http://localhost:3001)
- This is acceptable for same-origin cookie handling but requires cookie forwarding

## TypeScript Configuration
- Standard Next.js TS config with path alias "@/*" -> "./src/*"
- No issues

## App Routes
- Public routes: /, /appointments, /catalogue/[id]
- Protected admin routes: /admin/* (uses NextAuth for authentication)
- Authentication pages: /admin/login
- Dashboard: /admin/dashboard (calls protected API endpoint)

## Components
- UI components: @/components/ui/* (standard)
- Business components: Gallery.tsx, ReelsPlayer.tsx, ReviewCarousel.tsx, BookingForm.tsx
- BookingForm uses react-hook-form and calls BookingApi.createBooking and initializePayment

## Hooks
- No custom hooks found in src/lib/hooks (directory may not exist)
- Uses NextAuth's signIn hook in admin login page

## API Utilities
- src/lib/api/client.ts: ApiClient class with request methods
- Attempts to get token from NextAuth cookies on server side, does nothing on client side
- This fails for cross-port requests (localhost:3000 -> localhost:3001) because cookie not sent
- src/lib/api/services.ts: Defines service functions for home, services, staff, bookings, payments, dashboard, auth
- Uses ApiClient with requiresAuth flag where appropriate

## Authentication
- src/lib/auth.ts: NextAuth configuration with CredentialsProvider
- Calls AuthApi.verifyCredentials (which is POST /api/v1/auth/verify) to verify credentials
- However, authorize callback only returns user, discarding the token from server response
- No mechanism to store or use the server's JWT token for API requests
- NextAuth session cookie is HttpOnly and set on localhost:3000, but API requests go to localhost:3001 (different port) so cookie not sent
- Rewrites in next.config.ts proxy /api/v1/* to backend, but do not forward cookies automatically

## Environment Variables
- .env contains DATABASE_URL and REDIS_URL (server-only secrets) - must be removed
- Also contains NEXTAUTH_URL set to production URL, should be http://localhost:3000 for dev
- NEXT_PUBLIC_API_URL set correctly to http://localhost:3001/api/v1
- API_PORT and PORT set

## State Management
- No global state management library (Redux, etc.)
- Relies on NextAuth for session state and React component state

## Forms
- BookingForm uses react-hook-form with zod validation
- Admin login uses NextAuth signIn

## Mock Data
- No mock data found in source (all data comes from API calls)
- However, some API calls may return empty data (e.g., home endpoint returns empty arrays)

## Server References
- No direct references to Prisma, PostgreSQL, Redis in source code
- However, .env and package.json contain backend coupling

## Tests
- No test files found in src (may be in test directory at root)
- Need to check for integration or unit tests

## Summary of Issues
1. Backend dependencies in package.json (Prisma, Redis)
2. Backend secrets in .env (DATABASE_URL, REDIS_URL)
3. No mechanism to attach server JWT token to API requests on client side
4. Cross-port cookie issue due to different ports (3000 vs 3001)
5. NextAuth token not being used to store server access token
6. Auth flow discards server token after verification

## Recommendations
1. Remove Prisma and Redis dependencies from package.json if not needed for type generation
2. Remove DATABASE_URL and REDIS_URL from client .env
3. Store server access token from auth verification in sessionStorage or localStorage (or better, in NextAuth token)
4. Modify ApiClient to retrieve token from storage and attach as Authorization header
5. Consider making API requests same-origin by having backend on same port or using middleware to forward cookies
6. Ensure NEXTAUTH_URL is set to http://localhost:3000 for development