import { Injectable, Logger } from '@nestjs/common';
import { TypeSafeClient } from '@typesafe-ai/sdk';

/**
 * Thin NestJS wrapper around the TypeSafe AI client.
 * Inject this service into any NestJS provider that needs semantic judgments.
 */
@Injectable()
export class TypeSafeService {
  private readonly logger = new Logger(TypeSafeService.name);
  private readonly client: TypeSafeClient | null = null;

  constructor() {
    const apiKey = process.env.TYPESAFE_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        this.client = new TypeSafeClient({ apiKey: apiKey.trim() });
      } catch (err: any) {
        this.logger.warn(`Failed to initialize TypeSafeClient: ${err?.message ?? err}`);
      }
    } else {
      this.logger.warn(
        'TYPESAFE_API_KEY is not configured. TypeSafe AI features will gracefully degrade.',
      );
    }
  }

  /**
   * Ask the System One model one or more questions about a given state.
   * Wraps client.systemOne() and logs errors without surfacing them to callers —
   * AI enrichment failures must never break booking flows.
   */
  async ask<Q extends Record<string, any>>(
    request: Parameters<TypeSafeClient['systemOne']>[0],
  ): Promise<ReturnType<TypeSafeClient['systemOne']> | null> {
    if (!this.client) {
      return null;
    }
    try {
      return await this.client.systemOne(request as any);
    } catch (err: any) {
      this.logger.warn(`TypeSafe API call failed: ${err?.message ?? err}`);
      return null;
    }
  }
}
