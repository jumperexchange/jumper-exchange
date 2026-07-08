import { captureException } from '@sentry/nextjs';
import { toSitemapDate, buildUrl } from '@/utils/sitemap';
import { getBridgeSitemapChunkIds } from '@/utils/sitemaps/bridge';
import {
  createSitemapIndexXmlResponse,
  createSitemapServiceUnavailableResponse,
} from '@/utils/sitemaps/xml';
import { cacheLife } from 'next/cache';

async function getBridgeSitemapIndexData() {
  'use cache';
  cacheLife({ revalidate: 86400 });
  const ids = await getBridgeSitemapChunkIds();
  const lastModified = toSitemapDate(Date.now());
  const locs = ids.map((id) => buildUrl('bridge', 'sitemap', `${id}.xml`));
  return { locs, lastModified };
}

export async function GET() {
  try {
    const { locs, lastModified } = await getBridgeSitemapIndexData();
    return createSitemapIndexXmlResponse(locs, lastModified);
  } catch (error) {
    captureException(error);
    return createSitemapServiceUnavailableResponse();
  }
}
