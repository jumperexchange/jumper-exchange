import type { ChangeFrequency } from '@/types/sitemap';
import type { MetadataRoute } from 'next';
import { getChainsQuery } from '@/hooks/useChains';
import coins from '@/utils/getTokens/coins';
import type { Token } from '@lifi/sdk';
import { getChainById } from '@/utils/tokenAndChain';

//Optimized function to generate ordered bridge pairs (tokens from different chains)
const generateBridgeOrderedPairs = (tokens: Token[]) => {
  const orderedPairs: Array<[Token, Token]> = [];

  // Loop through each token and compare with every other token
  for (const token1 of tokens) {
    for (const token2 of tokens) {
      // Ensure tokens are from different chains (bridge rule)
      if (token1.chainId !== token2.chainId) {
        orderedPairs.push([token1, token2]); // Token1 -> Token2
      }
    }
  }

  return orderedPairs;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();
  const availableChainsId = chains.map((c) => c.id);

  const ordered = generateBridgeOrderedPairs(
    coins.filter((c) => availableChainsId.includes(c.chainId)) as Token[],
  );
  const routes = ordered.map(([a, b]) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/bridge/${`${getChainById(chains, a.chainId)?.name}-${a.symbol}-to-${getChainById(chains, b.chainId)?.name}-${b.symbol}`.toLowerCase()}`,
    lastModified: new Date().toISOString().split('T')[0],
    priority: 0.4,
  }));

  return routes;
}
