import { toSitemapDate } from '@/utils/sitemap';
import { getBridgeSitemapEntries } from '@/utils/sitemaps/bridge';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

const lastModified = toSitemapDate(Date.now());

export async function GET() {
  return createSitemapXmlResponse(getBridgeSitemapEntries(lastModified));
}
