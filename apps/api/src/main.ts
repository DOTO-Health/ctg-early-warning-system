import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation — reject out-of-range physiological values before
  // they ever reach a guideline strategy (ARCHITECTURE.md § Validation).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // The Tailwind/HTML web app is served separately during development
  // (Vite on :5173) and needs cross-origin access to the API.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'],
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Ctg-Early-Warning-System API')
    .setDescription(
      'Multi-guideline CTG (cardiotocography) interpretation API. Classifies fetal heart rate ' +
        'trace features against FIGO, NICE, and ACOG guidelines — individually or all at once — ' +
        'and supports per-organization white-label branding.',
    )
    .setVersion('0.1.0')
    .addTag(
      'classification',
      'Run a trace through one or all guideline strategies',
    )
    .addTag('traces', 'Persisted classification events (audit trail)')
    .addTag('branding', 'Per-organization/partner theme configuration')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(
    `🚀 Ctg-Early-Warning-System API running on http://localhost:${port}/api`,
  );

  console.log(`📘 Swagger docs at        http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
