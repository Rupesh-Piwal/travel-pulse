import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Using a singleton for the Redis connection to avoid multiple clients in development
// HMR in Next.js can cause multiple connections if not handled correctly.
declare global {
  var redisConnection: Redis | undefined;
}

export const connection = global.redisConnection || new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,    // Recommended for serverless/Upstash
  tls: REDIS_URL.startsWith("rediss://") ? {} : undefined,
});

if (process.env.NODE_ENV !== "production") {
  global.redisConnection = connection;
}
