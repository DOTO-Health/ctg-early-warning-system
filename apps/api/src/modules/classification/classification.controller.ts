import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { GuidelineId } from '@Ctg-Early-Warning-System/core';
import { ClassificationService } from './classification.service';
import { CTGFeaturesDto } from './dto/ctg-features.dto';
import {
  AllGuidelinesResultDto,
  SingleClassificationResultDto,
} from './dto/classification-result.dto';

@ApiTags('classification')
@ApiExtraModels(CTGFeaturesDto)
@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get('guidelines')
  @ApiOperation({
    summary: 'List available guidelines',
    description:
      'Returns metadata (id, label, rule-set version, possible categories) for every registered guideline strategy.',
  })
  listGuidelines() {
    return this.classificationService.listGuidelines();
  }

  @Post('all')
  @ApiOperation({
    summary: 'Classify a trace against every guideline at once',
    description:
      'Runs the FIGO, NICE, and ACOG strategies against the same CTG feature set and returns all three results side by side.',
  })
  @ApiOkResponse({ type: AllGuidelinesResultDto })
  classifyAll(@Body() features: CTGFeaturesDto) {
    return this.classificationService.classifyAll(features);
  }

  @Post(':guideline')
  @ApiOperation({
    summary: 'Classify a trace against a single guideline',
    description:
      'Runs one specific guideline strategy (FIGO, NICE, or ACOG) against the supplied CTG feature set.',
  })
  @ApiParam({
    name: 'guideline',
    enum: ['FIGO', 'NICE', 'ACOG'],
    example: 'FIGO',
  })
  @ApiOkResponse({ type: SingleClassificationResultDto })
  classifyOne(
    @Param('guideline') guideline: GuidelineId,
    @Body() features: CTGFeaturesDto,
  ) {
    return this.classificationService.classifyOne(guideline, features);
  }
}
