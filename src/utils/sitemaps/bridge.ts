import { getChainsQuery } from '@/hooks/useChains';
import { fetchTokensForPage } from '@/app/lib/tokens/cachedTokensFetch';
import coins from '@/utils/coins';
import { getBridgeUrl } from '@/utils/getBridgeUrl';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import {
  getChainById,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';
import { isAlphanumeric } from '@/utils/validation-schemas';
import type { ExtendedChain, Token, TokensResponse } from '@lifi/sdk';
import { cache } from 'react';

export const dynamic = 'force-static';

export const SITEMAP_LIMIT = 10_000;

const getFilteredCoins = (
  availableChainIds: number[],
  availableTokens: TokensResponse['tokens'],
): Token[] =>
  coins.filter(
    (coin) =>
      availableChainIds.includes(coin.chainId) &&
      isAlphanumeric(coin.symbol) &&
      getTokenBySymbolOnSpecificChain(
        availableTokens,
        coin.chainId,
        coin.symbol,
      ) !== undefined,
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

const getChainData = cache(async () => {
  const [{ chains }, availableTokens] = await Promise.all([
    getChainsQuery(),
    fetchTokensForPage(),
  ]);
  const availableChainIds = chains.map((chain) => chain.id);
  const filteredCoins = getFilteredCoins(availableChainIds, availableTokens);
  const pairs = generateBridgePairs(filteredCoins);
  return { chains, pairs };
});

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

export const getBridgeSitemapChunkCount = async (): Promise<number> => {
  const { pairs } = await getChainData();
  return Math.ceil(pairs.length / SITEMAP_LIMIT);
};

export const getBridgeSitemapChunkIds = async (): Promise<string[]> => {
  const chunkCount = await getBridgeSitemapChunkCount();
  return Array.from({ length: chunkCount }, (_, index) => String(index));
};

export const getBridgeSitemapEntriesForChunk = async (
  chunkIndex: number,
  lastModified = toSitemapDate(Date.now()),
): Promise<SitemapXmlEntry[]> => {
  const { chains, pairs } = await getChainData();
  const chunkCount = Math.ceil(pairs.length / SITEMAP_LIMIT);

  if (chunkIndex < 0 || chunkIndex >= chunkCount) {
    return [];
  }

  return pairs
    .slice(chunkIndex * SITEMAP_LIMIT, (chunkIndex + 1) * SITEMAP_LIMIT)
    .flatMap((pair) => {
      const entry = toRouteEntry(chains, pair, lastModified);
      return entry ? [entry] : [];
    });
};

export const isBridgeSitemapChunkInRange = async (
  chunkIndex: number,
): Promise<boolean> => {
  if (chunkIndex < 0) {
    return false;
  }

  const chunkCount = await getBridgeSitemapChunkCount();
  return chunkIndex < chunkCount;
};
