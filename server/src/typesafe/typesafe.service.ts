import { Injectable, Logger } from '@nestjs/common';
import { TypeSafeClient } from '@typesafe-ai/sdk';

/**
 * Thin NestJS wrapper around the TypeSafe AI client.
 * Inject this service into any NestJS provider that needs semantic judgments.
 */
@Injectable()
export class TypeSafeService {
  private readonly logger = new Logger(TypeSafeService.name);
  private readonly client: TypeSafeClient;

  constructor() {
    this.client = new TypeSafeClient(); // reads TYPESAFE_API_KEY from env
  }

  /**
   * Ask the System One model one or more questions about a given state.
   * Wraps client.systemOne() and logs errors without surfacing them to callers —
   * AI enrichment failures must never break booking flows.
   */
  async ask<Q extends Record<string, any>>(
    request: Parameters<TypeSafeClient['systemOne']>[0],
  ): Promise<ReturnType<TypeSafeClient['systemOne']> | null> {
    try {
      return await this.client.systemOne(request as any);
    } catch (err: any) {
      this.logger.warn(`TypeSafe API call failed: ${err?.message ?? err}`);
      return null;
    }
  }
}
