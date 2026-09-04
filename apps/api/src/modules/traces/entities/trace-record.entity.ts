import { ApiProperty } from '@nestjs/swagger';
import type { CTGFeatures } from '@Ctg-Early-Warning-System/core';
import { AllGuidelinesResultDto } from '../../classification/dto/classification-result.dto';

/**
 * A persisted classification event: the input features plus the result from
 * every guideline at the time of classification, forming the audit trail
 * called for in ARCHITECTURE.md.
 *
 * ⚠️ In-memory only in this reference implementation — swap
 * `TracesService`'s internal store for a Prisma/PostgreSQL repository before
 * any real deployment (see README.md tech stack table).
 */
export class TraceRecord {
  @ApiProperty({ example: 'b6d2b6b0-6e0a-4e9a-9e3a-9a2e2b7b6f10' })
  id: string;

  @ApiProperty({ required: false, example: 'Bed 4 — 08:12' })
  label?: string;

  @ApiProperty()
  features: CTGFeatures;

  @ApiProperty({ type: AllGuidelinesResultDto })
  results: AllGuidelinesResultDto;

  @ApiProperty({ example: '2026-07-25T09:31:00.000Z' })
  createdAt: string;
}
