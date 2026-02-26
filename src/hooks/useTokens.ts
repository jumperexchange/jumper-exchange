import type { ChainId, Token } from '@lifi/sdk';
import { ChainType, getTokens } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Address } from 'viem';

import { ExtendedToken } from '../utils/Token';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { createBatchFetcher } from '@/utils/batches/fetcher';

// NOTE: We are using the StaticToken type here as USD prices from the /tokens
// endpoint tend to be incorrect. Use useToken() instead
// TODO: This needs to be StaticToken
export type AllTokens = { tokens: { [chainId: number]: Token[] } };

const TOKEN_CHAIN_TYPES: ChainType[] = [
  ChainType.EVM,
  ChainType.SVM,
  ChainType.UTXO,
  ChainType.MVM,
];

const tokensBatchesByChainType: Record<string, ChainType[]> =
  Object.fromEntries(
    TOKEN_CHAIN_TYPES.map((chainType) => [chainType, [chainType]]),
  );

export const getTokensQuery = async (
  signal?: AbortSignal,
): Promise<AllTokens> => {
  const { results } = createBatchFetcher<ChainType, AllTokens>(
    tokensBatchesByChainType,
    async (_batchKey, chainTypes) => {
      const data = await getTokens({ chainTypes: [...chainTypes] });
      return [data];
    },
    {},
    { concurrency: 4 },
    signal,
  );

  const resultsList = await results;

  return Object.assign({}, ...resultsList.map((r) => r.tokens));
};

export const useTokens = () => {
  const { data, isLoading, isSuccess, isError, error, dataUpdatedAt } =
    useQuery({
      queryKey: [getQueryKey('tokens', 'jumper-default')],
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
      if (!data.tokens[chainId]) {
        return;
      }
      const tokenData = data.tokens[chainId].find(
        (token) => token.address.toLowerCase() === address.toLowerCase(),
      );
      if (!tokenData) {
        return;
      }
      // TODO: This needs to be SimpleToken
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
