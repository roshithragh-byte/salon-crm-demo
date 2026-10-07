import 'server-only';

/**
 * Sanitizes output strings to redact sensitive tokens, passwords, secrets, and private keys.
 */
export function sanitizeOutput(raw: string | null | undefined): string {
  if (!raw) return '';

  let sanitized = raw;

  // 1. Redact known environment variables if present
  const secretsToRedact = [
    process.env.NEXTAUTH_SECRET,
    process.env.VERCEL_OIDC_TOKEN,
    process.env.VERCEL_ACCESS_TOKEN,
    process.env.DATABASE_URL,
    process.env.POSTGRES_PASSWORD,
    process.env.REDIS_PASSWORD,
  ].filter((s): s is string => Boolean(s && s.length > 5));

  for (const secret of secretsToRedact) {
    const escaped = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sanitized = sanitized.replace(new RegExp(escaped, 'g'), '[REDACTED_SECRET]');
  }

  // 2. Database connection strings with credentials (postgres://user:pass@host...)
  sanitized = sanitized.replace(
    /(postgres|postgresql|mysql|mongodb|redis):\/\/[^:\s]+:[^@\s]+@[^\s/]+/gi,
    '$1://[REDACTED_USER]:[REDACTED_PASS]@[REDACTED_HOST]'
  );

  // 3. JWT Tokens (header.payload.signature)
  sanitized = sanitized.replace(
    /ey[A-Za-z0-9-_=]+\.ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+/g,
    '[REDACTED_JWT]'
  );

  // 4. Bearer / Authorization tokens
  sanitized = sanitized.replace(
    /(bearer\s+|authorization:\s*bearer\s+)[A-Za-z0-9-_.]+/gi,
    '$1[REDACTED_TOKEN]'
  );

  // 5. Session cookies & cookie values
  sanitized = sanitized.replace(
    /(next-auth\.session-token|__Secure-next-auth\.session-token)=([^;\s]+)/gi,
    '$1=[REDACTED_COOKIE]'
  );

  // 6. Generic API keys & secrets in key-value format
  sanitized = sanitized.replace(
    /(api[_-]?key|secret|password|passwd|auth[_-]?token|access[_-]?token)\s*[:=]\s*["']?([^\s"',;]+)["']?/gi,
    '$1="[REDACTED]"'
  );

  // 7. Private keys (PEM blocks)
  sanitized = sanitized.replace(
    /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
    '[REDACTED_PRIVATE_KEY]'
  );

  return sanitized;
}
