import { AppPaths } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import { slugify } from '@/utils/urls/slugify';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';

export const getSwapSitemapEntries = async (
  lastModified = toSitemapDate(Date.now()),
): Promise<SitemapXmlEntry[]> => {
  const { chains } = await getChainsQuery();

  return chains.map((chain) => ({
    loc: buildUrl(AppPaths.Swap, slugify(chain.name)),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));
};
