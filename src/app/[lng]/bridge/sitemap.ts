import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import coins from '@/utils/coins';
import { getBridgeUrl } from '@/utils/getBridgeUrl';
import { getChainById } from '@/utils/tokenAndChain';
import { isAlphanumeric } from '@/utils/validation-schemas';
import type { Token } from '@lifi/sdk';
import type { MetadataRoute } from 'next';

//Optimized function to generate ordered bridge pairs (tokens from different chains)
const generateBridgeOrderedPairs = (tokens: Token[]) => {
  const orderedPairs: Array<[Token, Token]> = [];

  // Loop through each token and compare with every other token
  for (const token1 of tokens) {
    for (const token2 of tokens) {
      // Ensure tokens are from different chains (bridge rule)
      // and both tokens have alphanumeric symbols
      if (
        token1.chainId !== token2.chainId &&
        isAlphanumeric(token1.symbol) &&
        isAlphanumeric(token2.symbol)
      ) {
        orderedPairs.push([token1, token2]); // Token1 -> Token2
      }
    }
  }

  return orderedPairs;
};

const sitemapLinksLimit = 50000;

export async function generateSitemaps() {
  const { chains } = await getChainsQuery();
  const availableChainsId = chains.map((c) => c.id);

  // Filter coins by chain ID and alphanumeric symbols
  const filteredCoins = coins.filter(
    (c) => availableChainsId.includes(c.chainId) && isAlphanumeric(c.symbol),
  ) as Token[];

  const ordered = generateBridgeOrderedPairs(filteredCoins);

  const numberOfChunks = Math.ceil(ordered.length / sitemapLinksLimit);

  return Array.from({ length: numberOfChunks }).map((_, index) => ({
    id: index,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const { chains } = await getChainsQuery();
  const availableChainsId = chains.map((c) => c.id);

  // Filter coins by chain ID and alphanumeric symbols
  const filteredCoins = coins.filter(
    (c) => availableChainsId.includes(c.chainId) && isAlphanumeric(c.symbol),
  ) as Token[];

  const ordered = generateBridgeOrderedPairs(filteredCoins);

  // Split the ordered array into chunks of 50,000
  const start = id * sitemapLinksLimit;
  const end = start + sitemapLinksLimit;
  const orderedChunks = ordered.slice(start, end);
  const routes = orderedChunks
    .filter(([a, b]) => {
      const sourceChain = getChainById(chains, a.chainId);
      const destinationChain = getChainById(chains, b.chainId);
      if (!sourceChain || !destinationChain) {
        return false;
      }

      const bridgeUrl = getBridgeUrl(sourceChain, a, destinationChain, b);
      return bridgeUrl !== null;
    })
    .map(([a, b]) => {
      const sourceChain = getChainById(chains, a.chainId);
      const destinationChain = getChainById(chains, b.chainId);
      const bridgeUrl = getBridgeUrl(sourceChain!, a, destinationChain!, b);
      const lastModified = new Date().toISOString().split('T')[0];

      return {
        url: `${getSiteUrl()}${bridgeUrl}`,
        lastModified,
        priority: 0.4,
      } satisfies MetadataRoute.Sitemap[number];
    });

  return routes;
}
