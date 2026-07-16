import { toSitemapDate } from '@/utils/sitemap';
import { getRootSitemapEntries } from '@/utils/sitemaps/root';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';

const lastModified = toSitemapDate(Date.now());

export async function GET() {
  return createSitemapXmlResponse(getRootSitemapEntries(lastModified));
}
