import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

const isBuildTime = () => {
  return process.env.BUILD_CACHE === 'true';
};

const sanitizeKey = (key: string) => {
  return key.replace(/[^a-zA-Z0-9-_]/g, '-');
};

export const getCachedData = async (
  key: string,
  fetcher: () => Promise<any>,
  ttl = 3600000,
) => {
  if (!isBuildTime()) {
    return fetcher();
  }

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.warn('Failed to create cache directory:', (error as Error).message);
  }

  const safeKey = sanitizeKey(key);
  const cacheFile = path.join(CACHE_DIR, `${safeKey}.json`);

  try {
    const stats = await fs.stat(cacheFile);
    if (Date.now() - stats.mtime.getTime() < ttl) {
      const cached = await fs.readFile(cacheFile, 'utf8');
      console.log(`Cache HIT for ${key}`);
      return JSON.parse(cached);
    }
    console.log(`Cache EXPIRED for ${key}`);
  } catch (error) {
    console.log(`Cache MISS for ${key}`);
  }

  console.log(`Fetching fresh data for ${key}`);
  try {
    const data = await fetcher();

    try {
      await fs.writeFile(cacheFile, JSON.stringify(data));
      const size = (JSON.stringify(data).length / 1024 / 1024).toFixed(2);
      console.log(`Cached ${key} (${size}MB)`);
    } catch (writeError) {
      console.warn(
        `Failed to write cache for ${key}:`,
        (writeError as Error).message,
      );
    }

    return data;
  } catch (fetchError) {
    try {
      const staleData = await fs.readFile(cacheFile, 'utf8');
      console.log(`Using stale cache for ${key} (fetch failed)`);
      return JSON.parse(staleData);
    } catch (staleError) {
      throw fetchError;
    }
  }
};

export const clearCache = async (key?: string) => {
  try {
    if (key) {
      const safeKey = sanitizeKey(key);
      const cacheFile = path.join(CACHE_DIR, `${safeKey}.json`);
      await fs.unlink(cacheFile);
      console.log(`Cleared cache for ${key}`);
    } else {
      const files = await fs.readdir(CACHE_DIR);
      await Promise.all(
        files.map((file) => fs.unlink(path.join(CACHE_DIR, file))),
      );
      console.log(`Cleared all cache (${files.length} files)`);
    }
  } catch (error) {
    console.warn('Failed to clear cache:', (error as Error).message);
  }
};
