import type { ChainId, TokensResponse } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';
import assign from 'lodash/assign';
import { useCallback } from 'react';
import type { Address } from 'viem';

import { ExtendedToken } from '../utils/Token';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { createBatchFetcher } from '@/utils/batches/fetcher';

const TOKEN_CHAIN_TYPES: ChainType[] = Object.values(ChainType);

const tokensBatchesByChainType: Record<string, ChainType[]> =
  Object.fromEntries(
    TOKEN_CHAIN_TYPES.map((chainType) => [chainType, [chainType]]),
  );

export const getTokensQuery = async (
  signal?: AbortSignal,
): Promise<TokensResponse['tokens']> => {
  const { results } = createBatchFetcher<ChainType, TokensResponse>(
    tokensBatchesByChainType,
    async (_batchKey, chainTypes) => {
      const data = await getTokens(sdkClient, { chainTypes: [...chainTypes] });
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

export const useTokens = () => {
  const { data, isLoading, isSuccess, isError, error, dataUpdatedAt } =
    useQuery({
      queryKey: [getQueryKey('tokens')],
      queryFn: ({ signal }) => getTokensQuery(signal),
      refetchInterval: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const getToken = useCallback(
    (chainId: ChainId, address: Address) => {
      if (!data) {
        return;
      }
      if (!data[chainId]) {
        return;
      }
      const tokenData = data[chainId].find(
        (token) => token.address.toLowerCase() === address.toLowerCase(),
      );
      if (!tokenData) {
        return;
      }
      // NOTE: We are using the StaticToken type here as USD prices from the /tokens
      // endpoint tend to be incorrect. Use useToken() instead
      // TODO: This needs to be StaticToken
      return new ExtendedToken(tokenData);
    },
    [data],
  );

  return {
    getToken,
    error,
    isError,
    isLoading,
    isSuccess,
    tokens: data,
    updatedAt: dataUpdatedAt,
  };
};
