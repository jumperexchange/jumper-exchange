import { captureException } from '@sentry/nextjs';
import { toSitemapDate, buildUrl } from '@/utils/sitemap';
import { getBridgeSitemapChunkIds } from '@/utils/sitemaps/bridge';
import {
  createSitemapIndexXmlResponse,
  createSitemapServiceUnavailableResponse,
} from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  try {
    const ids = await getBridgeSitemapChunkIds();
    const lastModified = toSitemapDate(Date.now());
    const locs = ids.map((id) => buildUrl('bridge', 'sitemap', `${id}.xml`));

    return createSitemapIndexXmlResponse(locs, lastModified);
  } catch (error) {
    captureException(error);
    return createSitemapServiceUnavailableResponse();
  }
}
