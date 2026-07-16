import { toSitemapDate } from '@/utils/sitemap';
import { getSwapSitemapEntries } from '@/utils/sitemaps/swap';
import { createSitemapXmlResponse } from '@/utils/sitemaps/xml';
import { cacheLife } from 'next/cache';

async function getSwapSitemapEntriesCached() {
  'use cache';
  cacheLife({ revalidate: 86400 });
  const lastModified = toSitemapDate(Date.now());
  return getSwapSitemapEntries(lastModified);
}

export async function GET() {
  const entries = await getSwapSitemapEntriesCached();
  return createSitemapXmlResponse(entries);
}
