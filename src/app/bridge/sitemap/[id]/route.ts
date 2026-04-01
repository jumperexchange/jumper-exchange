import { toSitemapDate } from '@/utils/sitemap';
import {
  getBridgeSitemapChunkIds,
  getBridgeSitemapEntriesForChunk,
} from '@/utils/sitemaps/bridge';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

const lastModified = toSitemapDate(Date.now());

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

export async function generateStaticParams() {
  const ids = await getBridgeSitemapChunkIds();
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

  const entries = await getBridgeSitemapEntriesForChunk(
    chunkIndex,
    lastModified,
  );
  return createSitemapXmlResponse(entries);
}
