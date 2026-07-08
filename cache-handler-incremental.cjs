'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */
// Classic incremental cache handler (Next `cacheHandler`, singular).
// Stores ISR/prerender route output (APP_PAGE, APP_ROUTE, PAGES, ...) in Redis
// so it is shared across replicas and bounded by a TTL, instead of growing on
// each pod's local filesystem cache. This is distinct from `cacheHandlers`
// (plural) in cache-handler.cjs, which only backs the `"use cache"` directive.
const {
  client,
  withPrefix,
  compress,
  decompress,
} = require('./cache-handler-redis.cjs');

const DEFAULT_EXPIRE_SECONDS = 60 * 60 * 24; // fallback TTL to bound Redis memory

const key = (k) => withPrefix(`route:${k}`);
const tagKey = (t) => withPrefix(`route-tag:${t}`);

// Buffer (rscData/body/image buffer) and Map (segmentData) are not JSON-safe.
// Buffer.prototype.toJSON() runs before this replacer sees the value, so we
// read the pre-toJSON value off the holder (`this[k]`) to detect Buffers.
function replacer(k, value) {
  const raw = this[k];
  if (Buffer.isBuffer(raw)) {
    return { __t: 'Buffer', d: raw.toString('base64') };
  }
  if (raw instanceof Map) {
    return { __t: 'Map', d: Array.from(raw.entries()) };
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
      const stored = await client.getBuffer(key(cacheKey));
      if (!stored) {
        return null;
      }
      const entry = JSON.parse(await decompress(stored), reviver);
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
      await client.set(key(cacheKey), await compress(payload), 'EX', expire);
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
