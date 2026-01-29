import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly memory = new Map<
    string,
    {
      value: string;
      expiresAt: number | null;
    }
  >();

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
    this.redis.on('error', () => undefined);
  }

  private get isRedisReady(): boolean {
    return this.redis.status === 'ready';
  }

  private memoryGet(key: string): string | null {
    const entry = this.memory.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return entry.value;
  }

  private memorySet(key: string, value: string, ttlSeconds?: number): void {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.memory.set(key, { value, expiresAt });
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isRedisReady) {
      try {
        const data = await this.redis.get(key);
        return data ? (JSON.parse(data) as T) : null;
      } catch {
        const data = this.memoryGet(key);
        return data ? (JSON.parse(data) as T) : null;
      }
    }

    const data = this.memoryGet(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (this.isRedisReady) {
      try {
        if (ttl) {
          await this.redis.set(key, stringValue, 'EX', ttl);
          return;
        }
        await this.redis.set(key, stringValue);
        return;
      } catch {
        this.memorySet(key, stringValue, ttl);
        return;
      }
    }

    this.memorySet(key, stringValue, ttl);
  }

  async del(key: string): Promise<void> {
    this.memory.delete(key);
    if (!this.isRedisReady) {
      return;
    }
    try {
      await this.redis.del(key);
    } catch {
      return;
    }
  }

  async reset(): Promise<void> {
    this.memory.clear();
    if (!this.isRedisReady) {
      return;
    }
    try {
      await this.redis.flushall();
    } catch {
      return;
    }
  }
}
