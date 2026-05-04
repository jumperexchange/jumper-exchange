import type { LoopoorMarketHistory } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getLoopoorMarketHistory } from 'src/app/lib/getLoopoorMarketHistory';
import { FIVE_MINUTES_MS } from 'src/const/time';

interface UseLoopoorMarketHistoryProps {
  chainId: number;
  marketId: string;
}

export type UseLoopoorMarketHistoryResult = UseQueryResult<
  LoopoorMarketHistory,
  unknown
>;

export function useLoopoorMarketHistory({
  chainId,
  marketId,
}: UseLoopoorMarketHistoryProps): UseLoopoorMarketHistoryResult {
  return useQuery({
    queryKey: ['loopoor-market-history', chainId, marketId],
    queryFn: async () => {
      const result = await getLoopoorMarketHistory(chainId, marketId);
      if (!result.ok) {
        throw result.error;
      }
      //@ts-ignore - TODO: LF-14853: type this properly
      return result.data.data as LoopoorMarketHistory;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
}
