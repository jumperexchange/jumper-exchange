import { captureException } from '@sentry/nextjs';
import { toSitemapDate } from '@/utils/sitemap';
import {
  getBridgeSitemapChunkIds,
  getBridgeSitemapEntriesForChunk,
  isBridgeSitemapChunkInRange,
} from '@/utils/sitemaps/bridge';
import {
  createSitemapServiceUnavailableResponse,
  createSitemapXmlResponse,
} from '@/utils/sitemaps/xml';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';
import { cacheLife } from 'next/cache';

const parseChunkIndex = (id: string): number | null => {
  if (!id.endsWith('.xml')) {
    return null;
  }

  const chunkId = id.slice(0, -4);
  if (!/^\d+$/.test(chunkId)) {
    return null;
  }

  return Number(chunkId);
};

async function getBridgeSitemapChunkEntries(
  chunkIndex: number,
): Promise<SitemapXmlEntry[] | null> {
  'use cache';
  cacheLife({ revalidate: 86400 });
  const inRange = await isBridgeSitemapChunkInRange(chunkIndex);

  if (!inRange) {
    return null;
  }

  const lastModified = toSitemapDate(Date.now());
  return getBridgeSitemapEntriesForChunk(chunkIndex, lastModified);
}

export async function generateStaticParams() {
  try {
    const ids = await getBridgeSitemapChunkIds();
    return ids.map((id) => ({ id: `${id}.xml` }));
  } catch (error) {
    captureException(error);
    return [];
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const chunkIndex = parseChunkIndex(id);

  if (chunkIndex === null) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const entries = await getBridgeSitemapChunkEntries(chunkIndex);

    if (!entries) {
      return new Response('Not Found', { status: 404 });
    }

    return createSitemapXmlResponse(entries);
  } catch (error) {
    captureException(error);
    return createSitemapServiceUnavailableResponse();
  }
}
