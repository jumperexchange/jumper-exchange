import { useQueries } from '@tanstack/react-query';
import { min } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Address, Hex } from 'viem';
import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition, WalletPositions } from '@/types/jumper-backend';
import type { GetTokenUSDPrice } from '@/utils/positions/update-price';
import { updateWalletPositionsPrice } from '@/utils/positions/update-price';
import { useTokens } from '../useTokens';

export interface Props {
  addresses: Hex[];
  filter?: Omit<PortfolioPositionsQuery, 'evm'>;
}

export interface Result {
  data: WalletPositions | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown | null;
  refetch: () => void;
}

export const usePortfolioDeFiPositions = ({
  addresses,
  filter,
}: Props): Result => {
  const { getToken, isLoading: isLoadingTokens, updatedAt } = useTokens();

  const getTokenUSDPrice: GetTokenUSDPrice = useCallback(
    (token: { chainId: number; address: string }) => {
      try {
        const tokenFound = getToken(token.chainId, token.address as Address);

        if (!tokenFound) {
          throw new Error(
            `Token not found for address ${token.address} on chain ${token.chainId}`,
          );
        }

        const priceUSD = parseFloat(tokenFound.priceUSD);

        if (isNaN(priceUSD)) {
          throw new Error(
            `Price USD is NaN for token ${token.address} on chain ${token.chainId}`,
          );
        }

        return priceUSD;
      } catch (error) {
        console.warn('Could not get token USD price', token, error);
        return undefined;
      }
    },
    [getToken],
  );

  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ['portfolio-defi-positions', address, filter, updatedAt],
      queryFn: async () => {
        const result = await getPositionsForAddress({
          evm: address,
          ...filter,
        });
        const positions = result.data;
        return updateWalletPositionsPrice(positions, getTokenUSDPrice);
      },
      enabled: !!address && !isLoadingTokens,
      refetchInterval: ONE_HOUR_MS,
    })),
  });

  const isLoading = isLoadingTokens || queries.some((query) => query.isLoading);
  const isSuccess = queries.every((query) => query.isSuccess);
  const error = queries.find((query) => query.error)?.error ?? null;

  const data = useMemo((): WalletPositions | undefined => {
    if (!isSuccess || queries.length === 0) {
      return undefined;
    }

    const successfulQueries = queries.filter(
      (query) => query.isSuccess && query.data,
    );

    const allPositions: DefiPosition[] = successfulQueries.flatMap(
      (query) => query.data?.data ?? [],
    );

    // Extract dates from all queries (meta.updatedAt is ISO string, dataUpdatedAt is timestamp)
    const dates = successfulQueries.map((query) => {
      const metaUpdatedAt = query.data?.meta?.updatedAt;
      return metaUpdatedAt
        ? new Date(metaUpdatedAt)
        : new Date(query.dataUpdatedAt);
    });

    const oldestUpdatedAtOrFallback =
      dates.length > 0 ? min(dates).toISOString() : new Date().toISOString();

    return {
      data: allPositions,
      meta: { updatedAt: oldestUpdatedAtOrFallback },
    };
  }, [queries, isSuccess]);

  const refetch = () => {
    queries.forEach((query) => query.refetch());
  };

  return {
    data,
    isLoading,
    isSuccess,
    error,
    refetch,
  };
};
