import { getLoopoorStats } from 'src/app/lib/getLoopoorStats';
import type { LoopoorStatsResponse } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from 'src/const/time';

interface UseLoopoorStatsProps {
  chainId: number | undefined;
  marketId: string | undefined;
  leverageFactor: number;
  amount?: string;
}

export type UseLoopoorStatsResult = UseQueryResult<
  LoopoorStatsResponse,
  unknown
>;

export function useLoopoorStats({
  chainId,
  marketId,
  leverageFactor,
  amount,
}: UseLoopoorStatsProps): UseLoopoorStatsResult {
  return useQuery({
    queryKey: ['loopoor-stats', chainId, marketId, leverageFactor, amount],
    queryFn: async () => {
      const result = await getLoopoorStats(chainId!, marketId!, {
        leverageFactor,
        amount,
      });
      if (!result.ok) {
        throw result.error;
      }
      //@ts-ignore
      return result.data.data;
    },
    enabled: !!chainId && !!marketId && leverageFactor > 1,
    refetchInterval: FIVE_MINUTES_MS,
    placeholderData: (previousData) => previousData,
  });
}
