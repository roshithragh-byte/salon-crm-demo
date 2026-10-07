import { ApiClient } from './client';

export interface DashboardData {
  totalRevenue: number;
  totalBookings: number;
  upcomingAppointments: Array<{
    id: string;
    customerName: string;
    startsAt: string;
    status: string;
  }>;
  topServices: Array<{
    name: string;
    count: number;
  }>;
}

export interface BookingData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceId: string;
  stylistId: string | null;
  startsAt: string;
  notes: string | null;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string | null;
  serviceId: string;
  serviceName?: string;
  service?: { id?: string; name: string };
  staffId?: string | null;
  staff?: { user?: { firstName?: string; lastName?: string } };
  startsAt: string;
  endsAt?: string;
  status: string;
  payments?: Array<{ id: string; status: string; amount: number }>;
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number | null;
  basePrice?: number;
  offerPrice?: number | null;
}

export interface Staff {
  id: string;
  name: string;
}

export interface AvailabilityResponse {
  data: {
    slots: Array<{
      starts_at: string;
    }>;
  };
}

export interface PaymentResponse {
  data: {
    providerOrderId: string;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    salonId: string;
  };
}

export interface CustomerRecord {
  id: string;
  firstName: string;
  lastName?: string | null;
  phoneNumber?: string;
  email?: string | null;
  visitCount?: number;
  loyaltyPoints?: number;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  source?: string;
  aiTopic?: string | null;
  aiSentiment?: number | null;
  aiConfidence?: number | null;
  createdAt?: string;
}

export interface ReviewSummary {
  avgSentiment?: number;
  totalAnalysed?: number;
  topicBreakdown?: Record<string, number>;
}

export interface UserProfileRecord {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const ServicesApi = {
  getHomeData: () => ApiClient.get<unknown>('/home', false, { cache: 'no-store' }),
  getServiceDetails: (id: string) => ApiClient.get<unknown>(`/services/${id}`, false, { cache: 'no-store' }),
};

export const BookingApi = {
  getAvailableServices: (salonId = 'hq') => ApiClient.get<{ data: Service[] }>(`/salons/${salonId}/services`, false, { cache: 'no-store' }),
  getAvailableStaff: (salonId = 'hq') => ApiClient.get<{ data: Staff[] }>(`/salons/${salonId}/staff`, false, { cache: 'no-store' }),
  createBooking: (salonId: string, data: BookingData, idempotencyKey?: string) =>
    ApiClient.post<{ data: BookingData & { id: string } }>(
      `/salons/${salonId}/bookings`,
      data,
      false,
      idempotencyKey ? { headers: { 'idempotency-key': idempotencyKey } } : undefined
    ),
  getAvailability: (salonId: string, date: string, serviceId: string, stylistId?: string, options?: { signal?: AbortSignal }) => {
    const params = new URLSearchParams({ date, service_id: serviceId });
    if (stylistId) params.append('stylist_id', stylistId);
    return ApiClient.get<AvailabilityResponse>(`/salons/${salonId}/availability?${params.toString()}`, false, options);
  },
  initializePayment: (salonId: string, bookingId: string, idempotencyKey?: string) =>
    ApiClient.post<PaymentResponse>(
      `/salons/${salonId}/bookings/${bookingId}/payment`,
      {},
      false,
      idempotencyKey ? { headers: { 'idempotency-key': idempotencyKey } } : undefined
    ),
  getBookings: (salonId: string, date?: string) => ApiClient.get<{ data: BookingRecord[] }>(`/salons/${salonId}/bookings${date ? '?date=' + date : ''}`, true),
  createStaff: (salonId: string, data: { name: string; email: string; password?: string }) => ApiClient.post<{ data: Staff }>(`/salons/${salonId}/staff`, data, true),
};

export const DashboardApi = {
  getDashboardData: () => ApiClient.get<{ data: DashboardData }>('/salons/hq/analytics/dashboard', true, { cache: 'no-store' }).then(res => res.data),
};

export const AuthApi = {
  verifyCredentials: (credentials: { email: string; password: string }) => ApiClient.post<AuthResponse>('/auth/verify', credentials),
};

export const ProfileApi = {
  getProfile: () => ApiClient.get<{ user: UserProfileRecord; roles: string[]; salonMembers: unknown[]; customerProfiles: Array<{ visitCount?: number; loyaltyPoints?: number }> }>('/me/profile', true, { cache: 'no-store' }),
  updateProfile: (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => ApiClient.patch<{ success: boolean; user: UserProfileRecord }>('/me/profile', data, true),
};

export const CustomerApi = {
  getAppointments: () => ApiClient.get<{ upcoming: BookingRecord[]; history: BookingRecord[] }>('/me/appointments', true, { cache: 'no-store' }),
};

export const AdminCustomerApi = {
  getCustomers: (salonId = 'hq') => ApiClient.get<{ data: CustomerRecord[] }>(`/salons/${salonId}/customers`, true, { cache: 'no-store' }),
};

export const ReviewApi = {
  getReviews: (salonId = 'hq') =>
    ApiClient.get<{ data: ReviewRecord[] }>(`/salons/${salonId}/reviews`, true, { cache: 'no-store' }),
  getSentimentSummary: (salonId = 'hq') =>
    ApiClient.get<{ data: ReviewSummary }>(`/salons/${salonId}/reviews/summary`, true, { cache: 'no-store' }),
  createReview: (salonId: string, data: { authorName: string; rating: number; content: string; source?: string }) =>
    ApiClient.post<{ data: ReviewRecord }>(`/salons/${salonId}/reviews`, data),
};
