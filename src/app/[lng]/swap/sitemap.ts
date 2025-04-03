import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import type { MetadataRoute } from 'next';
import { slugify } from 'src/utils/validation-schemas';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();

  // Fetch the total number of products and calculate the number of sitemaps needed
  return chains.map((chain) => ({
    url: `${getSiteUrl()}/swap/${slugify(chain.name)}`,
    lastModified: new Date().toISOString().split('T')[0],
    priority: 0.4,
  }));
}
