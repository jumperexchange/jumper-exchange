import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getOpportunitiesTop } from 'src/app/lib/getOpportunitiesTop';
import { EVMAddress } from 'src/types/internal';
import { EarnOpportunity } from 'src/types/jumper-backend';

export interface Props {
  address: EVMAddress;
}

export type Result = UseQueryResult<EarnOpportunity[], unknown>;

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

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
    refetchInterval: FIVE_MINUTES_IN_MS,
  });
};
