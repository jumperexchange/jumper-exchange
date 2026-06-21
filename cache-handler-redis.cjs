'use strict';
/* eslint-disable @typescript-eslint/no-require-imports */
// Shared ioredis client + key helpers for the two Next cache handlers:
//  - cache-handler.cjs            (`cacheHandlers` plural, the "use cache" directive)
//  - cache-handler-incremental.cjs (`cacheHandler` singular, ISR route output)
// Both run in the same server process, so they share a single connection.
const Redis = require('ioredis');
const zlib = require('zlib');
const { promisify } = require('util');

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

// Cache entries are large text (RSC payloads / HTML); brotli shrinks Redis
// memory and network. Quality 4 is a deliberate balance — compress runs on the
// server during cache writes (decompress on reads is cheap). Bump quality for a
// better ratio, or lower it, if profiling shows CPU pressure on hot paths.
const brotliCompressAsync = promisify(zlib.brotliCompress);
const brotliDecompressAsync = promisify(zlib.brotliDecompress);
const BROTLI_OPTIONS = {
  params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
};

/** Compress a UTF-8 string to a brotli Buffer (stored raw in Redis). */
const compress = (text) =>
  brotliCompressAsync(Buffer.from(text, 'utf8'), BROTLI_OPTIONS);

/** Decompress a brotli Buffer (from Redis getBuffer) back to a UTF-8 string. */
const decompress = async (buffer) =>
  (await brotliDecompressAsync(buffer)).toString('utf8');

module.exports = { client, prefix, withPrefix, compress, decompress };
