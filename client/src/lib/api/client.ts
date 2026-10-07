export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SLOT_UNAVAILABLE'
  | 'BOOKING_CONFLICT'
  | 'VALIDATION_ERROR'
  | 'REQUEST_TIMEOUT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retry?: number; // Maximum number of retries for idempotent requests
}

export function getEffectiveBackendUrl(): string {
  const raw = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').trim();
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  // In production (e.g. Vercel), override any missing, localhost, loopback, or placeholder URLs
  if (
    isProduction &&
    (!raw ||
      raw.includes('localhost') ||
      raw.includes('127.0.0.1') ||
      raw.includes('your-production-backend-url'))
  ) {
    return 'https://salon-crm-demo-production.up.railway.app/api/v1';
  }

  if (!raw) {
    return `http://127.0.0.1:${process.env.API_PORT || 3001}/api/v1`;
  }

  let finalRaw = raw.replace(/^["'\s]+|["'\s]+$/g, '');
  if (!finalRaw.startsWith('http://') && !finalRaw.startsWith('https://')) {
    finalRaw = (isProduction ? 'https://' : 'http://') + finalRaw;
  }
  if (finalRaw.endsWith('/api/v1') || finalRaw.includes('/api/v1/')) {
    return finalRaw.replace(/\/$/, '');
  }
  return `${finalRaw.replace(/\/$/, '')}/api/v1`;
}

function combineSignals(callerSignal?: AbortSignal | null, timeoutMs?: number): { signal: AbortSignal; cleanup: () => void } {
  const timeoutController = new AbortController();
  const timeoutId = timeoutMs ? setTimeout(() => timeoutController.abort(new Error('REQUEST_TIMEOUT')), timeoutMs) : null;

  if (!callerSignal) {
    return {
      signal: timeoutController.signal,
      cleanup: () => {
        if (timeoutId) clearTimeout(timeoutId);
      },
    };
  }

  // Combine caller signal and timeout signal
  const combinedController = new AbortController();
  const onCallerAbort = () => combinedController.abort(callerSignal.reason);
  const onTimeoutAbort = () => combinedController.abort(timeoutController.signal.reason);

  if (callerSignal.aborted) {
    combinedController.abort(callerSignal.reason);
  } else {
    callerSignal.addEventListener('abort', onCallerAbort);
    timeoutController.signal.addEventListener('abort', onTimeoutAbort);
  }

  return {
    signal: combinedController.signal,
    cleanup: () => {
      if (timeoutId) clearTimeout(timeoutId);
      callerSignal.removeEventListener('abort', onCallerAbort);
      timeoutController.signal.removeEventListener('abort', onTimeoutAbort);
    },
  };
}

function sanitizeErrorMessage(status: number, rawMessage?: string): { code: ApiErrorCode; message: string } {
  const msg = rawMessage || '';

  // Block internal database or runtime leakage
  if (
    msg.includes('Prisma') ||
    msg.includes('database') ||
    msg.includes('syntax') ||
    msg.includes('column') ||
    msg.includes('table') ||
    msg.includes('SELECT') ||
    msg.includes('INSERT')
  ) {
    return { code: 'SERVER_ERROR', message: 'A server error occurred. Please try again later.' };
  }

  if (status === 401) {
    return { code: 'UNAUTHORIZED', message: 'Your session has expired or you are unauthorized. Please sign in.' };
  }
  if (status === 403) {
    return { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' };
  }
  if (status === 404) {
    return { code: 'VALIDATION_ERROR', message: rawMessage || 'Requested resource not found.' };
  }
  if (status === 409) {
    if (msg.toLowerCase().includes('slot') || msg.toLowerCase().includes('available') || msg.includes('SLOT_UNAVAILABLE')) {
      return { code: 'SLOT_UNAVAILABLE', message: 'The selected appointment slot is no longer available. Please select another time.' };
    }
    return { code: 'BOOKING_CONFLICT', message: rawMessage || 'A booking conflict occurred. Please review your request.' };
  }
  if (status === 429) {
    return { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down and try again shortly.' };
  }
  if (status >= 500) {
    return { code: 'SERVER_ERROR', message: 'Server is temporarily unavailable. Please try again in a few moments.' };
  }
  return { code: 'VALIDATION_ERROR', message: rawMessage || 'Invalid request payload.' };
}

export class ApiClient {
  private static getBaseUrl() {
    if (typeof window !== 'undefined') {
      return '/api/v1';
    }
    return getEffectiveBackendUrl();
  }

  private static getDefaultTimeout(endpoint: string): number {
    if (endpoint.includes('/availability')) return 6000;
    if (endpoint.includes('/payment')) return 15000;
    return 10000;
  }

  private static async getHeaders(requiresAuth = false): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      let token = '';
      if (typeof window !== 'undefined') {
        token = sessionStorage.getItem('accessToken') || '';
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    requiresAuth = false
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = await this.getHeaders(requiresAuth);
    const method = (options.method || 'GET').toUpperCase();
    const timeoutMs = options.timeoutMs ?? this.getDefaultTimeout(endpoint);
    const maxRetries = method === 'GET' ? (options.retry ?? 1) : (options.retry ?? 0);

    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const { signal, cleanup } = combineSignals(options.signal, timeoutMs);

      try {
        const res = await fetch(url, {
          ...options,
          signal,
          headers: { ...headers, ...options.headers },
          cache: 'no-store',
        });

        cleanup();

        if (res.ok) {
          const data = await res.json();
          return data as T;
        }

        let rawErrorMsg = res.statusText;
        let errorDetails: unknown = null;
        try {
          const errorData = await res.json();
          rawErrorMsg = errorData.message || errorData.error || rawErrorMsg;
          errorDetails = errorData;
        } catch {}

        const sanitized = sanitizeErrorMessage(res.status, rawErrorMsg);

        // Bounded retry on 503 or transient 502 for idempotent GET operations
        if (method === 'GET' && (res.status === 502 || res.status === 503 || res.status === 504) && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
          continue;
        }

        throw new ApiError(sanitized.code, res.status, sanitized.message, errorDetails);
      } catch (err: unknown) {
        cleanup();

        if (err instanceof ApiError) {
          throw err;
        }

        // Handle AbortError vs Timeout
        if (err instanceof Error && err.name === 'AbortError') {
          if (options.signal?.aborted) {
            throw err; // Caller explicitly cancelled
          }
          throw new ApiError('REQUEST_TIMEOUT', 408, 'The server took too long to respond. Please check your connection.');
        }

        lastError = err;
        // Retry transient network errors on GET
        if (method === 'GET' && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
          continue;
        }
      }
    }

    if (lastError instanceof Error) {
      throw new ApiError('NETWORK_ERROR', 0, 'Unable to connect to salon services. Please check your network connection.', lastError.message);
    }
    throw new ApiError('NETWORK_ERROR', 0, 'An unexpected network error occurred.');
  }

  static async get<T>(endpoint: string, requiresAuth = false, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, requiresAuth);
  }

  static async post<T>(endpoint: string, body: unknown, requiresAuth = false, options?: RequestOptions) {
    let requestBody: BodyInit | null = null;
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
    return this.request<T>(endpoint, { ...options, method: 'POST', body: requestBody }, requiresAuth);
  }

  static async patch<T>(endpoint: string, body: unknown, requiresAuth = false, options?: RequestOptions) {
    let requestBody: BodyInit | null = null;
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: requestBody }, requiresAuth);
  }

  static async delete<T>(endpoint: string, requiresAuth = false, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, requiresAuth);
  }
}
