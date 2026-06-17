/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const Redis = require('ioredis');

const prefix = process.env.REDIS_PREFIX ?? 'jumper:cache:';

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: false,
  maxRetriesPerRequest: 1,
});
client.on('error', (err) => console.error('[cache-handler] Redis error:', err));

const key = (k) => `${prefix}${k}`;

// Local cache of tag invalidation timestamps, synced from Redis on each request
// via refreshTags(). Avoids a Redis round-trip per getExpiration() call.
const localTagTimestamps = new Map();

module.exports = {
  async get(cacheKey, softTags) {
    try {
      const stored = await client.get(key(cacheKey));
      if (!stored) {
        return undefined;
      }
      const data = JSON.parse(stored);
      return {
        value: new ReadableStream({
          start(controller) {
            controller.enqueue(Buffer.from(data.value, 'base64'));
            controller.close();
          },
        }),
        tags: data.tags,
        stale: data.stale,
        timestamp: data.timestamp,
        expire: data.expire,
        revalidate: data.revalidate,
      };
    } catch {
      return undefined;
    }
  },

  async set(cacheKey, pendingEntry) {
    try {
      const entry = await pendingEntry;
      const reader = entry.value.getReader();
      const chunks = [];
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      const data = Buffer.concat(chunks.map((c) => Buffer.from(c)));
      await client.set(
        key(cacheKey),
        JSON.stringify({
          value: data.toString('base64'),
          tags: entry.tags,
          stale: entry.stale,
          timestamp: entry.timestamp,
          expire: entry.expire,
          revalidate: entry.revalidate,
        }),
        'EX',
        entry.expire,
      );
      if (entry.tags?.length) {
        const pipe = client.pipeline();
        for (const tag of entry.tags) {
          pipe.sadd(key(`tag-keys:${tag}`), cacheKey);
        }
        await pipe.exec();
      }
    } catch {}
  },

  // Called before each request — syncs tag invalidation timestamps from Redis
  // into the local map so getExpiration() can read without extra round-trips.
  async refreshTags() {
    try {
      const tagNames = await client.smembers(key('revalidated-tags'));
      if (!tagNames.length) {
        return;
      }
      const values = await client.mget(tagNames.map((t) => key(`tag-ts:${t}`)));
      for (let i = 0; i < tagNames.length; i++) {
        localTagTimestamps.set(tagNames[i], Number(values[i] ?? 0));
      }
    } catch {}
  },

  // Reads from the local map synced by refreshTags() — no Redis round-trip.
  async getExpiration(tags) {
    return Math.max(...tags.map((t) => localTagTimestamps.get(t) ?? 0), 0);
  },

  async updateTags(tags, _durations) {
    try {
      const now = Date.now();
      const pipe = client.pipeline();
      for (const tag of tags) {
        pipe.set(key(`tag-ts:${tag}`), String(now));
        pipe.sadd(key('revalidated-tags'), tag);
        localTagTimestamps.set(tag, now);
      }
      await pipe.exec();

      // Invalidate all cache keys associated with these tags
      for (const tag of tags) {
        const memberKeys = await client.smembers(key(`tag-keys:${tag}`));
        if (memberKeys.length) {
          const delPipe = client.pipeline();
          delPipe.del(memberKeys.map(key));
          delPipe.del(key(`tag-keys:${tag}`));
          await delPipe.exec();
        }
      }
    } catch {}
  },
};
