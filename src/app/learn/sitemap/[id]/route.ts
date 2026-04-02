import {
  getLearnSitemapChunkIds,
  getLearnSitemapEntriesForChunk,
} from '@/utils/sitemaps/learn';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

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

  const entries = await getLearnSitemapEntriesForChunk(chunkIndex);
  return createSitemapXmlResponse(entries);
}
