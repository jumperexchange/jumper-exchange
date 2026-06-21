'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */
// Shared ioredis client + key helpers for the two Next cache handlers:
//  - cache-handler.cjs            (`cacheHandlers` plural, the "use cache" directive)
//  - cache-handler-incremental.cjs (`cacheHandler` singular, ISR route output)
// Both run in the same server process, so they share a single connection.
const Redis = require('ioredis');

const prefix = process.env.REDIS_PREFIX ?? 'jumper:cache:';

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 500,
  enableOfflineQueue: false,
});
client.on('error', (err) => console.error('[redis-cache] Redis error:', err));

const withPrefix = (k) => `${prefix}${k}`;

module.exports = { client, prefix, withPrefix };
