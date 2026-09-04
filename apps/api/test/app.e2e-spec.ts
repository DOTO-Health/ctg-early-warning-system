import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Ctg-Early-Warning-System API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET) reports ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res: Record<string, any>) => {
        const body = res.body as { status: string };
        expect(body.status).toBe('ok');
      });
  });

  it('/api/classification/guidelines (GET) lists FIGO, NICE, ACOG', () => {
    return request(app.getHttpServer())
      .get('/api/classification/guidelines')
      .expect(200)
      .expect((res: Record<string, any>) => {
        const bodyArray = res.body as Array<{ id: string }>;
        const ids = bodyArray.map((g) => g.id);
        expect(ids).toEqual(['FIGO', 'NICE', 'ACOG']);
      });
  });

  it('/api/classification/all (POST) classifies a healthy trace as Normal/Reassuring/Category I', () => {
    const healthyFeatures = {
      baseline: 140,
      variability: 10,
      accelerationCount: 2,
      lateDecelCount: 0,
      earlyDecelCount: 2,
      variableDecelCount: 0,
      prolongedDecelCount: 0,
      totalDecelCount: 0,
      repetitiveVariable: false,
      contractionsPer10Min: 3,
    };

    return request(app.getHttpServer())
      .post('/api/classification/all')
      .send(healthyFeatures)
      .expect(201)
      .expect((res) => {
        const body = res.body as { FIGO: string; ACOG: string };
        expect(body.FIGO).toBe('Normal');
        expect(body.ACOG).toBe('Category I');
      });
  });

  it('/api/classification/all (POST) rejects an out-of-range baseline', () => {
    return request(app.getHttpServer())
      .post('/api/classification/all')
      .send({
        baseline: 999,
        variability: 10,
        accelerationCount: 2,
        lateDecelCount: 0,
        earlyDecelCount: 0,
        variableDecelCount: 0,
        prolongedDecelCount: 0,
        totalDecelCount: 0,
        repetitiveVariable: false,
        contractionsPer10Min: 3,
      })
      .expect(400);
  });

  it('/api/branding/default (GET) returns the default theme', () => {
    return request(app.getHttpServer())
      .get('/api/branding/default')
      .expect(200)
      .expect((res) => {
        const body = res.body as { primaryColor: string };
        expect(body.primaryColor).toBe('#00296B');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
