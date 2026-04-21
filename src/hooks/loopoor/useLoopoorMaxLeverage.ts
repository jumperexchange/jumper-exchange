import { getLoopoorMaxLeverage } from 'src/app/lib/getLoopoorMaxLeverage';
import type { LoopoorMaxLeverageResponse } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from 'src/const/time';

interface UseLoopoorMaxLeverageProps {
  chainId: number | undefined;
  marketId: string | undefined;
}

export type UseLoopoorMaxLeverageResult = UseQueryResult<
  LoopoorMaxLeverageResponse,
  unknown
>;

export function useLoopoorMaxLeverage({
  chainId,
  marketId,
}: UseLoopoorMaxLeverageProps): UseLoopoorMaxLeverageResult {
  return useQuery({
    queryKey: ['loopoor-max-leverage', chainId, marketId],
    queryFn: async () => {
      const result = await getLoopoorMaxLeverage(chainId!, marketId!);
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    enabled: chainId !== undefined && !!marketId,
    refetchInterval: FIVE_MINUTES_MS,
    placeholderData: (previousData) => previousData,
  });
}
