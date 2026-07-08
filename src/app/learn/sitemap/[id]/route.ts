import {
  getLearnSitemapChunkIds,
  getLearnSitemapEntriesForChunk,
} from '@/utils/sitemaps/learn';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';
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

async function getLearnSitemapChunkEntries(
  chunkIndex: number,
): Promise<SitemapXmlEntry[]> {
  'use cache';
  cacheLife({ revalidate: 86400 });
  return getLearnSitemapEntriesForChunk(chunkIndex);
}

export async function generateStaticParams() {
  const ids = await getLearnSitemapChunkIds();
  return ids.map((id) => ({ id: `${id}.xml` }));
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

  const entries = await getLearnSitemapChunkEntries(chunkIndex);
  return createSitemapXmlResponse(entries);
}
