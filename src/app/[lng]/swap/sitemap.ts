import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getChainById } from '@/utils/tokenAndChain';
import type { MetadataRoute } from 'next';

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();

  const routes = chains.map((chain) => {
    return {
      url: `${getSiteUrl()}/swap/${`${getChainById(chains, chain.id)?.name}`.toLowerCase()}`,
      lastModified: new Date().toISOString().split('T')[0],
      priority: 0.4,
    };
  });

  return routes;
}
