import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition, WalletPositions } from '@/types/jumper-backend';
import { updateWalletPositionsPrice } from '@/utils/positions/update-price';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';

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

const getTokenUSDPrice = async (token: {
  chainId: number;
  address: string;
}): Promise<number> => {
  // TODO: this data is probably somewhere in the codebase already
  return Promise.resolve(4.2);
};

export const usePortfolioDeFiPositions = ({
  addresses,
  filter,
}: Props): Result => {
  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ['portfolio-defi-positions', address, filter],
      queryFn: async () => {
        const result = await getPositionsForAddress({
          evm: address,
          ...filter,
        });
        // @ts-expect-error: see LF-15589 - we are transforming data in the backend
        const positions = result.data.data as WalletPositions;

        return updateWalletPositionsPrice(positions, getTokenUSDPrice);
      },
      enabled: !!address,
      refetchInterval: ONE_HOUR_MS,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
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
