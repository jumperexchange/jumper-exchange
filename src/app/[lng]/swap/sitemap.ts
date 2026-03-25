import { AppPaths } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { buildUrl, toSitemapDate, toSitemapEntry } from '@/utils/sitemap';
import { slugify } from '@/utils/urls/slugify';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { chains } = await getChainsQuery();

    return chains.map((chain) =>
      toSitemapEntry(
        buildUrl(AppPaths.Swap, slugify(chain.name)),
        0.4,
        toSitemapDate(Date.now()),
      ),
    );
  } catch (error) {
    console.warn('Failed to fetch chain data for swap sitemap:', error);
    return [];
  }
}
