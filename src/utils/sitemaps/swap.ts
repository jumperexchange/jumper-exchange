import { INDEXED_SWAP_CHAINS } from '@/const/indexedPages';
import { AppPaths } from '@/const/urls';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';

export const getSwapSitemapEntries = (
  lastModified = toSitemapDate(Date.now()),
): SitemapXmlEntry[] =>
  [...INDEXED_SWAP_CHAINS].map((chain) => ({
    loc: buildUrl(AppPaths.Swap, chain),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
