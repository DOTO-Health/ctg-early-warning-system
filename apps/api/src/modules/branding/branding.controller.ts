import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BrandingService } from './branding.service';
import { BrandingConfigDto } from './dto/branding-config.dto';

@ApiTags('branding')
@Controller('branding')
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get(':orgSlug')
  @ApiOperation({
    summary: 'Get the branding config for an organization/partner',
    description:
      'Falls back to the Ctg-Early-Warning-System default theme (Navy/Signal Yellow) if the slug is unknown.',
  })
  @ApiParam({ name: 'orgSlug', example: 'doto-health' })
  @ApiOkResponse({ type: BrandingConfigDto })
  get(@Param('orgSlug') orgSlug: string): BrandingConfigDto {
    return this.brandingService.get(orgSlug);
  }

  @Put(':orgSlug')
  @ApiOperation({
    summary:
      'Create or replace the branding config for an organization/partner',
  })
  @ApiParam({ name: 'orgSlug', example: 'doto-health' })
  @ApiOkResponse({ type: BrandingConfigDto })
  upsert(
    @Param('orgSlug') orgSlug: string,
    @Body() config: BrandingConfigDto,
  ): BrandingConfigDto {
    return this.brandingService.upsert(orgSlug, config);
  }
}
