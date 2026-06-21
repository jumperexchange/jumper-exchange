'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */
// Classic incremental cache handler (Next `cacheHandler`, singular).
// Stores ISR/prerender route output (APP_PAGE, APP_ROUTE, PAGES, ...) in Redis
// so it is shared across replicas and bounded by a TTL, instead of growing on
// each pod's local filesystem cache. This is distinct from `cacheHandlers`
// (plural) in cache-handler.cjs, which only backs the `"use cache"` directive.
const Redis = require('ioredis');

const prefix = process.env.REDIS_PREFIX ?? 'jumper:cache:';
const DEFAULT_EXPIRE_SECONDS = 60 * 60 * 24; // fallback TTL to bound Redis memory

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 500,
  enableOfflineQueue: false,
});
client.on('error', (err) =>
  console.error('[incremental-cache] Redis error:', err),
);

const key = (k) => `${prefix}route:${k}`;
const tagKey = (t) => `${prefix}route-tag:${t}`;

// Buffer (rscData/body/image buffer) and Map (segmentData) are not JSON-safe.
function replacer(_k, value) {
  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', d: value.toString('base64') };
  }
  if (value instanceof Map) {
    return { __t: 'Map', d: Array.from(value.entries()) };
  }
  return value;
}

function reviver(_k, value) {
  if (value && typeof value === 'object') {
    if (value.__t === 'Buffer') {
      return Buffer.from(value.d, 'base64');
    }
    if (value.__t === 'Map') {
      return new Map(value.d);
    }
  }
  return value;
}

module.exports = class IncrementalCacheHandler {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async get(cacheKey) {
    try {
      const stored = await client.get(key(cacheKey));
      if (!stored) {
        return null;
      }
      const entry = JSON.parse(stored, reviver);
      return { lastModified: entry.lastModified, value: entry.value };
    } catch {
      return null;
    }
  }

  async set(cacheKey, data, ctx) {
    try {
      if (data == null) {
        await client.del(key(cacheKey));
        return;
      }
      const tags = Array.isArray(data.tags) ? data.tags : (ctx?.tags ?? []);
      const expire =
        ctx?.cacheControl?.expire && ctx.cacheControl.expire > 0
          ? Math.ceil(ctx.cacheControl.expire)
          : DEFAULT_EXPIRE_SECONDS;
      const payload = JSON.stringify(
        { value: data, lastModified: Date.now(), tags },
        replacer,
      );
      await client.set(key(cacheKey), payload, 'EX', expire);
      if (tags.length) {
        const pipe = client.pipeline();
        for (const tag of tags) {
          pipe.sadd(tagKey(tag), cacheKey);
          pipe.expire(tagKey(tag), expire);
        }
        await pipe.exec();
      }
    } catch {}
  }

  async revalidateTag(tags) {
    try {
      const list = Array.isArray(tags) ? tags : [tags];
      for (const tag of list) {
        const members = await client.smembers(tagKey(tag));
        const pipe = client.pipeline();
        if (members.length) {
          pipe.del(members.map(key));
        }
        pipe.del(tagKey(tag));
        await pipe.exec();
      }
    } catch {}
  }

  resetRequestCache() {}
};
