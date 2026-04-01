import { toSitemapDate } from '@/utils/sitemap';
import { getRootSitemapEntries } from '@/utils/sitemaps/root';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

const lastModified = toSitemapDate(Date.now());

export async function GET() {
  return createSitemapXmlResponse(getRootSitemapEntries(lastModified));
}
