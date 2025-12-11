import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition, WalletPositions } from '@/types/jumper-backend';
import type { GetTokenUSDPrice } from '@/utils/positions/update-price';
import { updateWalletPositionsPrice } from '@/utils/positions/update-price';
import { useQueries } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';
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
  const {
    getTokenByAddressAndChain,
    isLoading: isLoadingTokens,
    updatedAt,
  } = useTokens();

  const getTokenUSDPrice: GetTokenUSDPrice = useCallback(
    (token: { chainId: number; address: string }) => {
      try {
        const tokenFound = getTokenByAddressAndChain(
          token.address,
          token.chainId,
        );

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
    [getTokenByAddressAndChain],
  );

  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ['portfolio-defi-positions', address, filter, updatedAt],
      queryFn: async () => {
        const result = await getPositionsForAddress({
          evm: address,
          ...filter,
        });
        // @ts-expect-error: see LF-15589 - we are transforming data in the backend
        const positions = result.data.data as WalletPositions;

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

    const allPositions: DefiPosition[] = queries
      .filter((query) => query.isSuccess && query.data)
      .flatMap((query) => query.data?.positions ?? []);

    return { positions: allPositions };
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
