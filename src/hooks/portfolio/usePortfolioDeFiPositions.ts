import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';
import type { WalletPositions } from '@/types/jumper-backend';
import type { PortfolioDeFiPositionsFilter } from '@/app/ui/portfolio/types';

export interface Props extends PortfolioDeFiPositionsFilter {
  address?: Hex;
}

export type Result = UseQueryResult<WalletPositions, unknown>;

export const usePortfolioDeFiPositions = ({ address }: Props): Result => {
  return useQuery({
    queryKey: ['portfolio-defi-positions', address],
    queryFn: async () => {
      if (!address) {
        return [];
      }
      const result = await getPositionsForAddress({ evm: address });
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return result.data.data;
    },
    enabled: !!address,
    refetchInterval: ONE_HOUR_MS,
  });
};
