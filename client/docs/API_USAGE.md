# PilotWave API Usage Guide

This document provides examples and guidelines for using the PilotWave client API layer to communicate with the server.

## Overview

The PilotWave client uses a layered approach for API communication:
1. **ApiClient** - Low-level HTTP client with automatic token handling
2. **Service Modules** - High-level wrappers for specific API endpoints
3. **Components/Hooks** - UI layer that consumes service methods

All communication follows REST conventions with JSON payloads and JWT authentication.

## Base Configuration

API base URL is configured via environment variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

All examples assume this base URL unless otherwise noted.

## 1. Using ApiClient Directly

For custom endpoints or when service methods don't exist:

```typescript
import { ApiClient } from '@/lib/api/client';

// GET request
const response = await ApiClient.get<{ data: User[] }>('/users', false);

// POST request with data
const response = await ApiClient.post<{ data: User }>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
}, false);

// PUT request
const response = await ApiClient.put<{ data: User }>('/users/123', {
  name: 'Jane Doe'
}, false);

// DELETE request
const response = await ApiClient.delete<{ data: null }>('/users/123', false);
```

### ApiClient Parameters
- `endpoint`: API path (will be prefixed with NEXT_PUBLIC_API_URL)
- `data`: Request body (for POST/PUT/PATCH)
- `isFormData`: Boolean indicating if data should be sent as FormData (default: false)
- Returns: Promise resolving to `{ data: T, error?: any }` where T is the generic type parameter

## 2. Using Service Modules

Recommended approach for standard endpoints:

### Authentication Services (`src/lib/api/services.ts`)

```typescript
import { AuthApi } from '@/lib/api/services';

// Verify credentials (login)
const { user, token } = await AuthApi.verifyCredentials({
  email: 'admin@salondebea.com',
  password: 'password'
});

// Returns: { user: UserObject, token: JWT }
```

### Dashboard Services

```typescript
import { DashboardApi } from '@/lib/api/services';

const dashboardData = await DashboardApi.getDashboardData();

// Returns:
// {
//   totalRevenue: number,
//   totalBookings: number,
//   upcomingAppointments: Array<{ id, customerName, startsAt, status }>,
//   topServices: Array<{ name, count }>
// }
```

### Booking Services

```typescript
import { BookingApi } from '@/lib/api/services';

// Get available services
const services = await BookingApi.getAvailableServices('salon-id');

// Get available staff
const staff = await BookingApi.getAvailableStaff('salon-id');

// Create booking
const booking = await BookingApi.createBooking('salon-id', {
  customerName: 'John Doe',
  customerPhone: '1234567890',
  customerEmail: 'john@example.com',
  serviceId: 'service-id',
  stylistId: 'staff-id', // or null
  startsAt: '2023-05-01T10:00:00Z',
  notes: 'Please arrive 10 minutes early'
});

// Initialize payment
const payment = await BookingApi.initializePayment('salon-id', bookingId);

// Returns: { data: { providerOrderId, amount, currency, ...} }
```

## 3. Using Server Actions

For form submissions and mutations that benefit from server execution:

```typescript
'use server';

import { createAppointment } from '@/src/app/appointments/actions';

export async function handleFormSubmit(formData: FormData) {
  const data = {
    customerName: formData.get('customerName'),
    customerPhone: formData.get('customerPhone'),
    customerEmail: formData.get('customerEmail'),
    serviceId: formData.get('serviceId'),
    staffId: formData.get('staffId'),
    preferredDate: formData.get('preferredDate'),
    preferredTime: formData.get('preferredTime'),
    notes: formData.get('notes')
  };

  const result = await createAppointment('default-salon-id', data as AppointmentData);
  
  if (result.success) {
    // Redirect or show success message
  } else {
    // Show error message
  }
}
```

### Available Server Actions (`src/app/appointments/actions.ts`)
- `getAvailableServices(salonId)`: Fetch services for salon
- `getAvailableStaff(salonId)`: Fetch staff for salon  
- `createAppointment(salonId, data)`: Create new booking

## 4. TypeScript Interfaces

Common interfaces exported from service modules:

```typescript
import type { DashboardData, BookingData, Service, Staff } from '@/lib/api/services';

// Or import individually
import type { User } from '@/lib/api/services';
```

Key interfaces include:
- `DashboardData`: Analytics dashboard response
- `BookingData`: Booking creation response  
- `Service`: Service object (id, name, durationMinutes)
- `Staff`: Staff object (id, name)
- `User`: User object with role, salonId, etc.
- `AppointmentData`: Form data for booking creation

## 5. Error Handling Patterns

### Service Method Errors
```typescript
try {
  const data = await DashboardApi.getDashboardData();
  // Handle success
} catch (error) {
  if (error instanceof Error && error.message === 'Unauthorized') {
    // Redirect to login
    router.push('/admin/login');
  } else {
    // Handle other errors
    setError('Failed to load data');
  }
}
```

### ApiClient Errors
ApiClient throws errors that can be caught:
- Network errors (failed to fetch)
- HTTP errors (non-2xx responses)
- 401 Unauthorized (special handling in components)

### Form Validation Errors
Using React Hook Form with Zod:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});

// In JSX:
// {errors.customerName && <span>{errors.customerName.message}</span>}
```

## 6. Loading and Empty States

### Loading States
```typescript
const [loading, setLoading] = useState(true);

// Before request
setLoading(true);

// After request (in finally block)
setLoading(false);

// In JSX:
{loading ? <Spinner /> : <Content />}
```

### Empty States
```typescript
{data?.length === 0 ? (
  <p>No data available</p>
) : (
  <DataList items={data} />
)}
```

### Error States
```typescript
{error ? (
  <ErrorMessage message={error} />
) : (
  <Content />
)}
```

## 7. CORS and Security Notes

### CORS
- Client must be served from allowed origin configured on server
- Development: Typically localhost:3000
- Production: Must match domain in server CORS configuration

### Headers
ApiClient automatically sets:
- `Content-Type: application/json` (for JSON requests)
- `Authorization: Bearer <jwt>` (when token available)
- Accept: application/json

Custom headers can be passed via options:
```typescript
ApiClient.get<...>('/endpoint', false, {
  headers: { 'X-Custom-Header': 'value' }
});
```

## 8. Environment Variations

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXTAUTH_URL=http://localhost:3000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
```

### Testing
Override in test environment:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 9. Best Practices

### Do:
- Always use service methods when available
- Handle loading, error, and empty states
- Type API responses with TypeScript generics
- Use server actions for form mutations
- Redirect on 401 Unauthorized responses
- Keep components focused on presentation
- Use proper error boundaries

### Don't:
- Hardcode API endpoints in components
- Fetch data directly in useEffect without cleanup
- Ignore error states
- Store sensitive data in client-side state
- Modify server code or dependencies
- Forget to add "use client" to interactive components

## 10. Example Component Pattern

```typescript
'use client';

import { useEffect, useState } from 'react';
import { DashboardApi } from '@/lib/api/services';
import type { DashboardData } from '@/lib/api/services';

export default function DashboardComponent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await DashboardApi.getDashboardData();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
          // Handle auth error
        } else {
          setError('Failed to load dashboard');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <EmptyState message="No data available" />;

  return <DashboardContent data={data} />;
}
```

This pattern ensures:
- Proper separation of concerns
- Consistent loading/error/empty states
- Correct authentication handling
- Type safety throughout
- Clean component lifecycle