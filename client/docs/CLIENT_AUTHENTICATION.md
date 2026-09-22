# PilotWave Client Authentication

## Overview

The PilotWave client implements secure JWT-based authentication using NextAuth.js with a custom credentials provider. Authentication follows industry best practices for token handling, storage, and transmission.

## Authentication Flow

### 1. Login Process
1. User submits email/password via login form
2. NextAuth credentials provider calls `AuthApi.verifyCredentials()`
3. Server validates credentials and returns user object + JWT token
4. NextAuth JWT callback receives token and stores it in sessionStorage
5. Session is created with user data and token access

### 2. Token Usage
1. ApiClient automatically retrieves token from sessionStorage
2. Token is attached to outgoing requests as `Authorization: Bearer <jwt>`
3. Server validates token on protected endpoints
4. Valid requests return requested data; invalid tokens return 401

### 3. Token Refresh/Expiration
- Currently uses long-lived tokens (30 days via NextAuth session config)
- Token refresh not implemented as server issues new tokens on each login
- On 401 response, client redirects to login page for re-authentication

### 4. Logout Process
1. User initiates logout
2. NextAuth session is cleared
3. `events.signOut` handler removes token from sessionStorage
4. User redirected to login page

## Implementation Details

### NextAuth Configuration (`src/lib/auth.ts`)

#### Providers
- **CredentialsProvider**: Handles email/password authentication
- Calls `AuthApi.verifyCredentials()` to validate with server
- Returns user object with attached `accessToken` from server response

#### Callbacks
- **jwt**: 
  - Extracts token from server response
  - Stores user role, salonId, id, and accessToken in JWT
  - Persists accessToken to sessionStorage for ApiClient access
- **session**:
  - Makes token and user data available to client components
  - Attaches accessToken to session.user for easy access

#### Events
- **signIn**: No-op (token storage handled in jwt callback)
- **signOut**: Removes accessToken from sessionStorage

#### Session Configuration
- Strategy: JWT (tokens stored in encrypted cookie)
- Max age: 30 days
- Update age: 24 hours (refresh session token daily)
- Cookie settings: Secure in production, SameSite lax

### API Client Integration (`src/lib/api/client.js`)

The ApiClient automatically handles token attachment:

```javascript
// Retrieve token from sessionStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('accessToken');
  }
  return null;
};

// Attach token to request headers
const headers = new Headers(options.headers || {});
const token = getToken();
if (token) {
  headers.set('Authorization', `Bearer ${token}`);
}
```

#### Error Handling
- 401 responses trigger redirect to `/admin/login` page
- Network errors are caught and re-thrown for component handling
- Other HTTP errors propagate as thrown errors

### SessionStorage Usage

Token storage in sessionStorage provides:
- Availability across tabs/windows
- Automatic cleanup when browser session ends
- XSS risk mitigation (though HttpOnly would be better for the session token itself)
- Simple implementation compatible with NextAuth flow

## Security Considerations

### Token Storage
- Currently stored in sessionStorage (accessible to JavaScript)
- Alternative: Store in HttpOnly cookie (more secure against XSS)
- Current approach chosen for compatibility with NextAuth flow
- Session token itself is stored in HttpOnly cookie by NextAuth

### Transmission
- Tokens only sent over HTTPS in production
- Authorization header prevents token leakage in URLs
- Short-lived tokens would be preferable (not currently implemented)

### Protection
- All API routes protected by token validation on server
- Client redirects unauthenticated users to login
- Protected routes in Next.js could add additional layer (not currently used)

## Best Practices Implemented

1. **Separation of Concerns**: Auth logic isolated in auth.ts and ApiClient
2. **Type Safety**: TypeScript interfaces for user and token data
3. **Error Handling**: Graceful handling of auth errors and 401 responses
4. **Storage Security**: Using sessionStorage with fallback for SSR
5. **Token Lifecycle**: Proper cleanup on logout and expiration
6. **User Experience**: Redirects and feedback during auth flows

## Potential Improvements

1. **Refresh Tokens**: Implement refresh token flow for seamless auth renewal
2. **HttpOnly Storage**: Store JWT in HttpOnly cookie for better XSS protection
3. **Token Validation**: Add client-side token expiration checking
4. **Remember Me**: Extend session duration with optional persistent login
5. **Multi-tab Sync**: Broadcast token changes across tabs (sessionStorage event)

## Testing Considerations

1. **Unit Tests**:
   - Test ApiClient token attachment logic
   - Verify redirect behavior on 401 responses
   - Test auth service methods with mocked responses

2. **Integration Tests**:
   - Full login → protected API access → logout flow
   - Token persistence across page reloads
   - Behavior with expired/invalid tokens

3. **Manual Testing**:
   - Verify token stored in sessionStorage after login
   - Confirm Authorization header in network requests
   - Test logout removes token and redirects properly
   - Check 401 handling when token is manually removed