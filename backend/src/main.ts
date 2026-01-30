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
import rawBody from 'fastify-raw-body';
import cookie from '@fastify/cookie';

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

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
  });

  await app.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
    routes: ['/api/v1/webhooks/shopify'],
  });

  const rawFrontendUrls = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = rawFrontendUrls.map((value) => {
    const trimmed = value.replace(/\/+$/, '');
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  });

  // In development, always allow localhost origins
  // Also allow localhost if ALLOW_LOCALHOST_IN_PROD is set (for testing production backend locally)
  const allowLocalhost = process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCALHOST_IN_PROD === 'true';
  
  if (allowLocalhost) {
    allowedOrigins.push(
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    );
  }

  if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
    throw new Error('FRONTEND_URL must be set in production');
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development or if ALLOW_LOCALHOST_IN_PROD is set, allow localhost variations
        if (allowLocalhost) {
          if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
          }
        }
        callback(new Error('Not allowed by CORS'), false);
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
    .setTitle('AROMAZUR API')
    .setDescription('The AROMAZUR API for the luxury fragrance diffuser platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'AROMAZUR API Docs',
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '::');
  await app.listen(port, host);
  app.get(Logger).log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
