import { getChainsQuery } from '@/hooks/useChains';
import coins from '@/utils/coins';
import { getBridgeUrl } from '@/utils/getBridgeUrl';
import { buildUrl, toSitemapDate, toSitemapEntry } from '@/utils/sitemap';
import { getChainById } from '@/utils/tokenAndChain';
import { isAlphanumeric } from '@/utils/validation-schemas';
import type { Token, ExtendedChain } from '@lifi/sdk';
import type { MetadataRoute } from 'next';

const SITEMAP_LIMIT = 50_000;

const getFilteredCoins = (availableChainIds: number[]): Token[] =>
  coins.filter(
    (c) => availableChainIds.includes(c.chainId) && isAlphanumeric(c.symbol),
  ) as Token[];

const generateBridgePairs = (tokens: Token[]): Array<[Token, Token]> => {
  const pairs: Array<[Token, Token]> = [];
  for (const token1 of tokens) {
    for (const token2 of tokens) {
      if (token1.chainId !== token2.chainId) {
        pairs.push([token1, token2]);
      }
    }
  }
  return pairs;
};

const getChainData = async () => {
  const { chains } = await getChainsQuery();
  const availableChainIds = chains.map((c) => c.id);
  const filteredCoins = getFilteredCoins(availableChainIds);
  const pairs = generateBridgePairs(filteredCoins);
  return { chains, pairs };
};

const toRouteEntry = (
  chains: ExtendedChain[],
  [a, b]: [Token, Token],
): MetadataRoute.Sitemap[number] | null => {
  const sourceChain = getChainById(chains, a.chainId);
  const destinationChain = getChainById(chains, b.chainId);

  if (!sourceChain || !destinationChain) {
    return null;
  }

  const bridgeUrl = getBridgeUrl(sourceChain, a, destinationChain, b);
  if (!bridgeUrl) {
    return null;
  }

  return toSitemapEntry(buildUrl(bridgeUrl), 0.4, toSitemapDate(Date.now()));
};

export async function generateSitemaps() {
  const { pairs } = await getChainData();
  const numberOfChunks = Math.ceil(pairs.length / SITEMAP_LIMIT);
  return Array.from({ length: numberOfChunks }, (_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const [id, { chains, pairs }] = await Promise.all([props.id, getChainData()]);
  const chunkIndex = Number(id);

  return pairs
    .slice(chunkIndex * SITEMAP_LIMIT, (chunkIndex + 1) * SITEMAP_LIMIT)
    .flatMap((pair) => {
      const entry = toRouteEntry(chains, pair);
      return entry ? [entry] : [];
    });
}
