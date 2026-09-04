import { Injectable } from '@nestjs/common';
import { BrandingConfigDto } from './dto/branding-config.dto';

const DEFAULT_BRANDING: BrandingConfigDto = {
  organizationName: 'CTG Early Warning System',
  primaryColor: '#00296B',
  accentColor: '#FFD500',
  logoUrl:
    'https://res.cloudinary.com/rngar1ck/image/upload/v1785149099/Photo_Edit_from_LunaPic_1_awlhpd.png',
};

@Injectable()
export class BrandingService {
  // Reference implementation only — replace with a PostgreSQL-backed
  // Organization/BrandingConfig table for real multi-tenant deployments
  // (see ARCHITECTURE.md § Multi-tenant branding).
  private readonly configs = new Map<string, BrandingConfigDto>([
    ['default', DEFAULT_BRANDING],
  ]);

  get(orgSlug: string): BrandingConfigDto {
    return this.configs.get(orgSlug) ?? this.configs.get('default')!;
  }

  upsert(orgSlug: string, config: BrandingConfigDto): BrandingConfigDto {
    this.configs.set(orgSlug, config);
    return config;
  }
}
