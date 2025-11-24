import { useQueries } from '@tanstack/react-query';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';
import type { WalletPositions, DefiPosition } from '@/types/jumper-backend';
import { useMemo } from 'react';

export interface Props {
  addresses: Hex[];
}

export interface Result {
  data: WalletPositions | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown | null;
}

export const usePortfolioDeFiPositions = ({ addresses }: Props): Result => {
  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ['portfolio-defi-positions', address],
      queryFn: async () => {
        const result = await getPositionsForAddress({ evm: address });
        // @ts-expect-error: see LF-15589 - we are transforming data in the backend
        return result.data.data as WalletPositions;
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

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};
