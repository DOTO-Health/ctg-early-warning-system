import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, IsUrl } from 'class-validator';

export class BrandingConfigDto {
  @ApiProperty({
    example: 'Doto Health',
    description: 'Display name shown in the UI header',
  })
  @IsString()
  organizationName: string;

  @ApiProperty({
    example: '#00296B',
    description: 'Primary brand color (hex) — headers, nav, primary buttons',
  })
  @IsHexColor()
  primaryColor: string;

  @ApiProperty({
    example: '#FFD500',
    description: 'Accent brand color (hex) — highlights, active states',
  })
  @IsHexColor()
  accentColor: string;

  @ApiProperty({
    required: false,
    example:
      'https://res.cloudinary.com/rngar1ck/image/upload/v1785149099/Photo_Edit_from_LunaPic_1_awlhpd.png',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  constructor() {
    this.organizationName = 'Doto Health';
    this.primaryColor = '#00296B';
    this.accentColor = '#FFD500';
  }
}
