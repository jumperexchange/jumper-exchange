import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getOpportunitiesTop } from 'src/app/lib/getOpportunitiesTop';
import { FIVE_MINUTES_MS } from 'src/const/time';
import { Hex } from 'viem';
import { EarnOpportunity } from 'src/types/jumper-backend';

export interface Props {
  address: Hex;
}

export type Result = UseQueryResult<EarnOpportunity[], unknown>;

export const useEarnTopOpportunities = ({ address }: Props): Result => {
  // TODO: LF-14980: Deal with favorites & refetching
  return useQuery({
    queryKey: ['earn-top-opportunities', address],
    queryFn: async () => {
      const result = await getOpportunitiesTop(address);
      if (!result.ok) {
        throw result.error;
      }
      return result.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
