import type { MetadataRoute } from 'next';
import { getChainsQuery } from '@/hooks/useChains';
import { getSiteUrl } from '@/const/urls';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();

  // Fetch the total number of products and calculate the number of sitemaps needed
  return chains.map((chain) => ({
    url: `${getSiteUrl()}/swap/${chain.name.replace(' ', '-').toLowerCase()}`,
    lastModified: new Date().toISOString().split('T')[0],
    priority: 0.4,
  }));
}
