import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getOpportunitiesTop } from 'src/app/lib/getOpportunitiesTop';
import { FIVE_MINUTES_MS } from 'src/const/time';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { Hex } from 'viem';
import { useAccountAddress } from './useAccountAddress';

export interface Props {}

export type Result = UseQueryResult<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export const useEarnTopOpportunities = ({}: Props): Result => {
  const address: Hex | undefined = useAccountAddress();

  return useQuery({
    queryKey: ['earn-top-opportunities', address],
    queryFn: async () => {
      const result = await getOpportunitiesTop(address);
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
