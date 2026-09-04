import { Module } from '@nestjs/common';
import { ClassificationModule } from './modules/classification/classification.module';
import { TracesModule } from './modules/traces/traces.module';
import { BrandingModule } from './modules/branding/branding.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [ClassificationModule, TracesModule, BrandingModule],
  controllers: [HealthController],
})
export class AppModule {}
