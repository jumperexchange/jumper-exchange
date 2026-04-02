import { toSitemapDate } from '@/utils/sitemap';
import { getSwapSitemapEntries } from '@/utils/sitemaps/swap';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

const lastModified = toSitemapDate(Date.now());

export async function GET() {
  const entries = await getSwapSitemapEntries(lastModified);
  return createSitemapXmlResponse(entries);
}
