import { ApiProperty } from '@nestjs/swagger';
import type { GuidelineId } from '@Ctg-Early-Warning-System/core';

export class SingleClassificationResultDto {
  @ApiProperty({ enum: ['FIGO', 'NICE', 'ACOG'], example: 'FIGO' })
  guideline: GuidelineId;

  @ApiProperty({ example: 'Normal' })
  category: string;

  @ApiProperty({
    example: '1.0.0-ported',
    description: 'Rule-set version used for this classification',
  })
  version: string;
}

export class AllGuidelinesResultDto {
  @ApiProperty({ example: 'Normal' })
  FIGO: string;

  @ApiProperty({ example: 'Atypical' })
  NICE: string;

  @ApiProperty({ example: 'Category II' })
  ACOG: string;

  @ApiProperty({
    type: [String],
    example: ['1.0.0-ported', '1.0.0-ported', '1.0.0-ported'],
    description: 'Rule-set versions used, in FIGO/NICE/ACOG order',
  })
  versions: string[];
}
