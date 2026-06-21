'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */
const { client, withPrefix: key } = require('./cache-handler-redis.cjs');

const localTagTimestamps = new Map();

module.exports = {
  async get(cacheKey, softTags = []) {
    try {
      const stored = await client.get(key(cacheKey));
      if (!stored) {
        return undefined;
      }
      const data = JSON.parse(stored);

      if (softTags.length) {
        const tagExpiration = Math.max(...softTags.map((t) => localTagTimestamps.get(t) ?? 0), 0);
        if (tagExpiration > data.timestamp) {
          return undefined;
        }
      }

      if (typeof data.revalidate === 'number' && Date.now() > data.timestamp + data.revalidate * 1000) {
        return undefined;
      }

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

  async refreshTags() {
    try {
      const now = Date.now();
      const retentionMs = 24 * 60 * 60 * 1000;
      const tagNames = await client.zrangebyscore(
        key('revalidated-tags'),
        now - retentionMs,
        '+inf',
      );
      if (!tagNames.length) {
        return;
      }
      const values = await client.mget(tagNames.map((t) => key(`tag-ts:${t}`)));
      for (let i = 0; i < tagNames.length; i++) {
        localTagTimestamps.set(tagNames[i], Number(values[i] ?? 0));
      }
    } catch {}
  },

  async getExpiration(tags) {
    return Math.max(...tags.map((t) => localTagTimestamps.get(t) ?? 0), 0);
  },

  async updateTags(tags, _durations) {
    try {
      const now = Date.now();
      const pipe = client.pipeline();
      for (const tag of tags) {
        pipe.set(key(`tag-ts:${tag}`), String(now));
        pipe.zadd(key('revalidated-tags'), now, tag);
        localTagTimestamps.set(tag, now);
      }
      pipe.zremrangebyscore(key('revalidated-tags'), '-inf', now - 24 * 60 * 60 * 1000);
      await pipe.exec();

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
