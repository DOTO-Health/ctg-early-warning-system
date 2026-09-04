import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ClassificationService } from '../classification/classification.service';
import { CreateTraceDto } from './dto/create-trace.dto';
import { TraceRecord } from './entities/trace-record.entity';

@Injectable()
export class TracesService {
  // Reference implementation only — replace with a Prisma/PostgreSQL
  // repository for real persistence (see ARCHITECTURE.md § Persistence).
  private readonly records = new Map<string, TraceRecord>();

  constructor(private readonly classificationService: ClassificationService) {}

  create(dto: CreateTraceDto): TraceRecord {
    const record: TraceRecord = {
      id: randomUUID(),
      label: dto.label,
      features: dto.features,
      results: this.classificationService.classifyAll(dto.features),
      createdAt: new Date().toISOString(),
    };
    this.records.set(record.id, record);
    return record;
  }

  findAll(): TraceRecord[] {
    return [...this.records.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  findOne(id: string): TraceRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`Trace not found: ${id}`);
    }
    return record;
  }

  clearAll(): { cleared: number } {
    const cleared = this.records.size;
    this.records.clear();
    return { cleared };
  }
}
