import { UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual, createHash } from 'crypto';

/**
 * Timing-safe check of the X-Integration-Key header against env INTEGRATION_API_KEY.
 * Throws 401 if the env var is unset/empty, the header is missing, or the key is wrong.
 */
export function assertIntegrationKey(provided?: string | string[]): void {
  const expected = process.env.INTEGRATION_API_KEY;
  const key = Array.isArray(provided) ? provided[0] : provided;
  if (!expected || !key || typeof key !== 'string') {
    throw new UnauthorizedException('Invalid or missing integration key');
  }
  // Hash both so buffers are equal length (timingSafeEqual requires it).
  const a = createHash('sha256').update(key).digest();
  const b = createHash('sha256').update(expected).digest();
  if (!timingSafeEqual(a, b)) {
    throw new UnauthorizedException('Invalid or missing integration key');
  }
}
