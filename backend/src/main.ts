import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 10 * 1024 * 1024, // 10MB limit for request body (to handle base64 images)
    }),
    { bufferLogs: true },
  );

  // Use nestjs-pino logger
  app.useLogger(app.get(Logger));

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Security Headers
  await app.register(helmet);

  // Compression
  await app.register(compression);

  const rawFrontendUrls = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const normalizedFrontendUrls = rawFrontendUrls
    .map((value) => {
      const trimmed = value.replace(/\/+$/, '');
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
      return `https://${trimmed}`;
    });

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    ...normalizedFrontendUrls,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In production, be more strict; in dev, allow all
        if (process.env.NODE_ENV === 'production') {
          callback(new Error('Not allowed by CORS'), false);
        } else {
          callback(null, true); // Allow all in development
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API Prefix - Set BEFORE Swagger to avoid wildcard route warnings
  app.setGlobalPrefix('api/v1');

  // Swagger Setup - After global prefix, use 'docs' path (will be accessible at /api/v1/docs)
  const config = new DocumentBuilder()
    .setTitle('Scentiment API')
    .setDescription('The Scentiment API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Scentiment API Docs',
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '::');
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
