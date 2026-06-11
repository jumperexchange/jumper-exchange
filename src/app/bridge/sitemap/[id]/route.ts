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
    const inRange = await isBridgeSitemapChunkInRange(chunkIndex);

    if (!inRange) {
      return new Response('Not Found', { status: 404 });
    }

    const entries = await getBridgeSitemapEntriesForChunk(
      chunkIndex,
      lastModified,
    );
    return createSitemapXmlResponse(entries);
  } catch (error) {
    captureException(error);
    return createSitemapServiceUnavailableResponse();
  }
}
