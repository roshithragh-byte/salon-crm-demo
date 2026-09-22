import { ApiClient } from './client';

interface DashboardData {
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

interface BookingData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  serviceId: string;
  stylistId: string | null;
  startsAt: string;
  notes: string | null;
}

interface Service {
  id: string;
  name: string;
  durationMinutes: number | null;
}

interface Staff {
  id: string;
  name: string;
}

interface AvailabilityResponse {
  data: {
    slots: Array<{
      starts_at: string;
    }>;
  };
}

interface PaymentResponse {
  data: {
    providerOrderId: string;
    // Add other payment response fields as needed
  };
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    salonId: string;
  };
}

export const ServicesApi = {
  getHomeData: () => ApiClient.get<unknown>('/home', false, { cache: 'no-store' }),
  getServiceDetails: (id: string) => ApiClient.get<unknown>(`/services/${id}`, false, { cache: 'no-store' }),
};

export const BookingApi = {
  getAvailableServices: (salonId = 'hq') => ApiClient.get<{ data: Service[] }>(`/salons/${salonId}/services`, false, { cache: 'no-store' }),
  getAvailableStaff: (salonId = 'hq') => ApiClient.get<{ data: Staff[] }>(`/salons/${salonId}/staff`, false, { cache: 'no-store' }),
  createBooking: (salonId: string, data: BookingData) => ApiClient.post<{ data: BookingData & { id: string } }>(`/salons/${salonId}/bookings`, data, true),
  getAvailability: (salonId: string, date: string, serviceId: string, stylistId?: string) => {
    const params = new URLSearchParams({ date, service_id: serviceId });
    if (stylistId) params.append('stylist_id', stylistId);
    return ApiClient.get<AvailabilityResponse>(`/salons/${salonId}/availability?${params.toString()}`, false);
  },
  initializePayment: (salonId: string, bookingId: string) => ApiClient.post<PaymentResponse>(`/salons/${salonId}/bookings/${bookingId}/payment`, {}),
  getBookings: (salonId: string, date: string) => ApiClient.get<{ data: any[] }>(`/salons/${salonId}/bookings?date=${date}`, true),
};

export const DashboardApi = {
  getDashboardData: () => ApiClient.get<{ data: DashboardData }>('/salons/hq/analytics/dashboard', true, { cache: 'no-store' }).then(res => res.data),
};

export const AuthApi = {
  verifyCredentials: (credentials: { email: string; password: string }) => ApiClient.post<AuthResponse>('/auth/verify', credentials),
};

export const ProfileApi = {
  getProfile: () => ApiClient.get<{ user: any; roles: string[]; salonMembers: any[]; customerProfiles: any[] }>('/me/profile', true, { cache: 'no-store' }),
  updateProfile: (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => ApiClient.patch<{ success: boolean; user: any }>('/me/profile', data, true),
};

export const CustomerApi = {
  getAppointments: () => ApiClient.get<{ upcoming: any[]; history: any[] }>('/me/appointments', true, { cache: 'no-store' }),
};

