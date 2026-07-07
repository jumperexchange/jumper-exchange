import { INDEXED_BRIDGE_SEGMENTS } from '@/const/indexedPages';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';

export const getBridgeSitemapEntries = (
  lastModified = toSitemapDate(Date.now()),
): SitemapXmlEntry[] =>
  [...INDEXED_BRIDGE_SEGMENTS].map((segment) => ({
    loc: buildUrl('bridge', segment),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
