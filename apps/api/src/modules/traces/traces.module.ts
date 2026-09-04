import { Module } from '@nestjs/common';
import { ClassificationModule } from '../classification/classification.module';
import { TracesController } from './traces.controller';
import { TracesService } from './traces.service';

@Module({
  imports: [ClassificationModule],
  controllers: [TracesController],
  providers: [TracesService],
})
export class TracesModule {}
