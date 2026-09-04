import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, Max, Min } from 'class-validator';
import { CTGFeatures } from '@Ctg-Early-Warning-System/core';

export class CTGFeaturesDto implements CTGFeatures {
  @ApiProperty({
    example: 145,
    minimum: 50,
    maximum: 240,
    description: 'Baseline fetal heart rate (bpm)',
  })
  @IsNumber()
  @Min(50)
  @Max(240)
  baseline: number;

  @ApiProperty({
    example: 8,
    minimum: 0,
    maximum: 60,
    description: 'Baseline variability (bpm)',
  })
  @IsNumber()
  @Min(0)
  @Max(60)
  variability: number;

  @ApiProperty({
    example: 2,
    minimum: 0,
    description: 'Number of accelerations observed',
  })
  @IsNumber()
  @Min(0)
  accelerationCount: number;

  @ApiProperty({
    example: 0,
    minimum: 0,
    description: 'Number of late decelerations',
  })
  @IsNumber()
  @Min(0)
  lateDecelCount: number;

  @ApiProperty({
    example: 1,
    minimum: 0,
    description: 'Number of early decelerations',
  })
  @IsNumber()
  @Min(0)
  earlyDecelCount: number;

  @ApiProperty({
    example: 0,
    minimum: 0,
    description: 'Number of variable decelerations',
  })
  @IsNumber()
  @Min(0)
  variableDecelCount: number;

  @ApiProperty({
    example: 0,
    minimum: 0,
    description: 'Number of prolonged decelerations (>=2 min)',
  })
  @IsNumber()
  @Min(0)
  prolongedDecelCount: number;

  @ApiProperty({
    example: 1,
    minimum: 0,
    description: 'Total deceleration count across all types',
  })
  @IsNumber()
  @Min(0)
  totalDecelCount: number;

  @ApiProperty({
    example: false,
    description: 'Whether repetitive variable decelerations are present',
  })
  @IsBoolean()
  repetitiveVariable: boolean;

  @ApiProperty({
    example: 3,
    minimum: 0,
    maximum: 20,
    description: 'Uterine contractions per 10-minute window',
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  contractionsPer10Min: number;
}
