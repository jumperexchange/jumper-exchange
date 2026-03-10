import { AppPaths } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { buildUrl, toSitemapDate, toSitemapEntry } from '@/utils/sitemap';
import type { MetadataRoute } from 'next';
import { slugify } from 'src/utils/validation-schemas';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();

  // Fetch the total number of products and calculate the number of sitemaps needed
  return chains.map((chain) =>
    toSitemapEntry(
      buildUrl(AppPaths.Swap, slugify(chain.name)),
      0.4,
      toSitemapDate(Date.now()),
    ),
  );
}
