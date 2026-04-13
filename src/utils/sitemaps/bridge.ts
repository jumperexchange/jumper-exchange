import { getChainsQuery } from '@/hooks/useChains';
import coins from '@/utils/coins';
import { getBridgeUrl } from '@/utils/getBridgeUrl';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import { getChainById } from '@/utils/tokenAndChain';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';
import { isAlphanumeric } from '@/utils/validation-schemas';
import type { ExtendedChain, Token } from '@lifi/sdk';

export const dynamic = 'force-static';

const SITEMAP_LIMIT = 50_000;

const getFilteredCoins = (availableChainIds: number[]): Token[] =>
  coins.filter(
    (coin) =>
      availableChainIds.includes(coin.chainId) && isAlphanumeric(coin.symbol),
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
  const availableChainIds = chains.map((chain) => chain.id);
  const filteredCoins = getFilteredCoins(availableChainIds);
  const pairs = generateBridgePairs(filteredCoins);
  return { chains, pairs };
};

const toRouteEntry = (
  chains: ExtendedChain[],
  [a, b]: [Token, Token],
  lastModified: string,
): SitemapXmlEntry | null => {
  const sourceChain = getChainById(chains, a.chainId);
  const destinationChain = getChainById(chains, b.chainId);

  if (!sourceChain || !destinationChain) {
    return null;
  }

  const bridgeUrl = getBridgeUrl(sourceChain, a, destinationChain, b);
  if (!bridgeUrl) {
    return null;
  }

  return {
    loc: buildUrl(bridgeUrl),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.4,
  };
};

export const getBridgeSitemapChunkIds = async (): Promise<string[]> => {
  const { pairs } = await getChainData();
  const numberOfChunks = Math.ceil(pairs.length / SITEMAP_LIMIT);
  return Array.from({ length: numberOfChunks }, (_, index) => String(index));
};

export const getBridgeSitemapEntriesForChunk = async (
  chunkIndex: number,
  lastModified = toSitemapDate(Date.now()),
): Promise<SitemapXmlEntry[]> => {
  const { chains, pairs } = await getChainData();

  return pairs
    .slice(chunkIndex * SITEMAP_LIMIT, (chunkIndex + 1) * SITEMAP_LIMIT)
    .flatMap((pair) => {
      const entry = toRouteEntry(chains, pair, lastModified);
      return entry ? [entry] : [];
    });
};
