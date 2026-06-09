import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getOpportunitiesTop } from 'src/app/lib/getOpportunitiesTop';
import { FIVE_MINUTES_MS } from 'src/const/time';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import type { Hex } from 'viem';
import { useAccountAddress } from './useAccountAddress';

export interface Props {}

export type Result = UseQueryResult<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export const earnTopOpportunitiesQueryKey = (address?: Hex) =>
  ['earn-top-opportunities', address] as const;

export const fetchEarnTopOpportunities = async (address?: Hex) => {
  const result = await getOpportunitiesTop(address);
  if (!result.ok) {
    throw result.error;
  }
  return result.data.data;
};

export const useEarnTopOpportunities = ({}: Props): Result => {
  const address: Hex | undefined = useAccountAddress();

  return useQuery<EarnOpportunityWithLatestAnalytics[], unknown>({
    queryKey: earnTopOpportunitiesQueryKey(address),
    queryFn: () => fetchEarnTopOpportunities(address),
    staleTime: FIVE_MINUTES_MS,
    refetchInterval: FIVE_MINUTES_MS,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};
