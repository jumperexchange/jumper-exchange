import type { ChainId, Token, TokensResponse } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';
import assign from 'lodash/assign';
import { createBatchFetcher } from '@/utils/batches/fetcher';

const TOKEN_CHAIN_TYPES: ChainType[] = Object.values(ChainType);

const tokensBatchesByChainType: Record<string, ChainType[]> =
  Object.fromEntries(
    TOKEN_CHAIN_TYPES.map((chainType) => [chainType, [chainType]]),
  );

export const getChainTokensQuery = async (
  chainId: ChainId,
  signal?: AbortSignal,
): Promise<Token[]> => {
  const data = await getTokens(sdkClient, { chains: [chainId] }, { signal });
  return data.tokens[chainId] ?? [];
};

export const getTokensQuery = async (
  signal?: AbortSignal,
): Promise<TokensResponse['tokens']> => {
  const { results } = createBatchFetcher<ChainType, TokensResponse>(
    tokensBatchesByChainType,
    async (_batchKey, chainTypes) => {
      const data = await getTokens(
        sdkClient,
        { chainTypes: [...chainTypes] },
        { signal },
      );
      return [data];
    },
    {},
    { concurrency: 4 },
    signal,
  );

  const resultsList = await results;

  return assign(
    {} as TokensResponse['tokens'],
    ...resultsList.map((r) => r.tokens),
  );
};
