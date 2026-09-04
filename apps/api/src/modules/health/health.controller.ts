import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController() // internal/orchestration only — kept out of the public Swagger surface
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'Ctg-Early-Warning-System-api',
      timestamp: new Date().toISOString(),
    };
  }
}
