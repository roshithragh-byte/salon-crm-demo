import { Global, Module } from '@nestjs/common';
import { TypeSafeService } from './typesafe.service';

/**
 * Global module — imported once in AppModule so TypeSafeService
 * is injectable across all feature modules without re-importing.
 */
@Global()
@Module({
  providers: [TypeSafeService],
  exports: [TypeSafeService],
})
export class TypeSafeModule {}
