import { getLoopoorMarkets } from 'src/app/lib/getLoopoorMarkets';
import type { LoopoorMarket } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from 'src/const/time';

interface UseLoopoorMarketsProps {
  chainId: number | undefined;
}

export type UseLoopoorMarketsResult = UseQueryResult<LoopoorMarket[], unknown>;

export function useLoopoorMarkets({
  chainId,
}: UseLoopoorMarketsProps): UseLoopoorMarketsResult {
  return useQuery({
    queryKey: ['loopoor-markets', chainId],
    queryFn: async () => {
      const result = await getLoopoorMarkets(chainId!);
      if (!result.ok) {
        throw result.error;
      }
      //@ts-ignore - TODO: LF-14853: type this properly
      return result.data.data as LoopoorMarket[];
    },
    enabled: chainId !== undefined,
    refetchInterval: FIVE_MINUTES_MS,
    placeholderData: (previousData) => previousData,
  });
}
