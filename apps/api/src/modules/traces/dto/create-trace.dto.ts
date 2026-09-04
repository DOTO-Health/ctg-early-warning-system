import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CTGFeaturesDto } from '../../classification/dto/ctg-features.dto';

export class CreateTraceDto {
  @ApiProperty({
    required: false,
    example: 'Bed 4 — 08:12',
    description: 'Optional free-text label for this trace',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ type: CTGFeaturesDto })
  @ValidateNested()
  @Type(() => CTGFeaturesDto)
  features: CTGFeaturesDto;
}
