import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TracesService } from './traces.service';
import { CreateTraceDto } from './dto/create-trace.dto';
import { TraceRecord } from './entities/trace-record.entity';

@ApiTags('traces')
@Controller('traces')
export class TracesController {
  constructor(private readonly tracesService: TracesService) {}

  @Post()
  @ApiOperation({
    summary: 'Store a trace and classify it against all guidelines',
    description:
      'Persists the CTG feature set alongside the FIGO/NICE/ACOG results, forming an auditable classification event.',
  })
  @ApiOkResponse({ type: TraceRecord })
  create(@Body() dto: CreateTraceDto): TraceRecord {
    return this.tracesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List stored traces, most recent first' })
  @ApiOkResponse({ type: [TraceRecord] })
  findAll(): TraceRecord[] {
    return this.tracesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch one stored trace by id' })
  @ApiParam({ name: 'id', example: 'b6d2b6b0-6e0a-4e9a-9e3a-9a2e2b7b6f10' })
  @ApiOkResponse({ type: TraceRecord })
  findOne(@Param('id') id: string): TraceRecord {
    return this.tracesService.findOne(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all stored traces' })
  @ApiOkResponse({ schema: { properties: { cleared: { type: 'number' } } } })
  clearAll(): { cleared: number } {
    return this.tracesService.clearAll();
  }
}
