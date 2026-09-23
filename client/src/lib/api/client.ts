export class ApiClient {
  private static getBaseUrl() {
    // Browser: same-origin /api/v1 so Next rewrites + CSP connect-src 'self' work.
    if (typeof window !== "undefined") {
      return "/api/v1";
    }
    const raw = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL;
    if (!raw && process.env.NODE_ENV === 'production') {
      console.warn("API_BASE_URL or NEXT_PUBLIC_API_URL must be defined in production. Proxy might fail.");
    }
    const finalRaw = (raw || `http://127.0.0.1:${process.env.API_PORT || 3001}/api/v1`).replace(/^["'\s]+|["'\s]+$/g, "");
    if (finalRaw.endsWith("/api/v1") || finalRaw.includes("/api/v1/")) return finalRaw.replace(/\/$/, "");
    return `${finalRaw.replace(/\/$/, "")}/api/v1`;
  }

  private static async getHeaders(requiresAuth = false): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      let token = '';
      if (typeof window !== 'undefined') {
        // Client-side: get token from sessionStorage
        token = sessionStorage.getItem('accessToken') || '';
      } else {
        // Server-side: we cannot reliably get the token here without complex setup
        // For server-side rendering, we will rely on the fact that the request is
        // made same-origin after rewriting and that the NextAuth session is valid.
        // However, the backend still needs the access token.
        // For now, we will leave it empty and assume that server-side data fetching
        // is only used for public endpoints or that we have switched to client-side
        // data fetching for protected endpoints.
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async request<T>(endpoint: string, options: RequestInit = {}, requiresAuth = false): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = await this.getHeaders(requiresAuth);

    const res = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    // Handle 401 Unauthorized
    if (res.status === 401) {
      // We do not store the token in sessionStorage, so nothing to remove.
      // Throw an error that can be caught by the caller to redirect to login.
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch {
        errorMsg = res.statusText;
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    return data;
  }

  static async get<T>(endpoint: string, requiresAuth = false, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, requiresAuth);
  }

  static async post<T>(endpoint: string, body: unknown, requiresAuth = false, options?: RequestInit) {
    let requestBody: BodyInit | null = null;
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
    return this.request<T>(endpoint, { ...options, method: 'POST', body: requestBody }, requiresAuth);
  }

  static async patch<T>(endpoint: string, body: unknown, requiresAuth = false, options?: RequestInit) {
    let requestBody: BodyInit | null = null;
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: requestBody }, requiresAuth);
  }

  static async delete<T>(endpoint: string, requiresAuth = false, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, requiresAuth);
  }
}