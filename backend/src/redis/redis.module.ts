import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const host = configService.get<string>('REDIS_HOST') ?? '127.0.0.1';
        const port = Number(configService.get<string>('REDIS_PORT') ?? 6379);
        const password = configService.get<string>('REDIS_PASSWORD') || undefined;

        const client = redisUrl
          ? new Redis(redisUrl, {
              lazyConnect: true,
              enableOfflineQueue: false,
              maxRetriesPerRequest: null, // Allow retries for offline queue
              retryStrategy: (times) => {
                // Retry up to 10 times, then give up
                if (times >= 10) {
                  console.warn('[Redis] Max retries reached, using in-memory cache');
                  return null;
                }
                return Math.min(times * 200, 2000);
              },
              reconnectOnError: () => true,
            })
          : new Redis({
              host,
              port,
              password,
              lazyConnect: true,
              enableOfflineQueue: false,
              maxRetriesPerRequest: null,
              retryStrategy: (times) => {
                if (times >= 10) {
                  console.warn('[Redis] Max retries reached, using in-memory cache');
                  return null;
                }
                return Math.min(times * 200, 2000);
              },
              reconnectOnError: () => true,
            });

        // Suppress connection errors (handled gracefully by RedisService)
        client.on('error', (err) => {
          // Only log if it's not a connection refused (expected when Redis is down)
          if (err.message && !err.message.includes('ECONNREFUSED')) {
            console.warn('[Redis] Error:', err.message);
          }
        });

        // Log successful connection
        client.on('connect', () => {
          console.log('[Redis] Connected successfully');
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
