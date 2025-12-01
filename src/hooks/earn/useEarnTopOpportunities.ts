import type { UseQueryResult } from '@tanstack/react-query';
import { getOpportunitiesTop } from '@/app/lib/getOpportunitiesTop';
import { FIVE_MINUTES_MS } from '@/const/time';
import type {
  EarnOpportunities,
  EarnOpportunityWithLatestAnalytics,
} from '@/types/jumper-backend';
import type { Hex } from 'viem';
import { useAccountAddress } from './useAccountAddress';
import { useEarnQuery } from './useEarnQuery';
import { useWalletCookie } from './useWalletCookie';
import { ChainType } from '@lifi/sdk';

export interface UseEarnTopOpportunitiesProps {
  initialData?: EarnOpportunities;
}

export type UseEarnTopOpportunitiesResult = UseQueryResult<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export const useEarnTopOpportunities = ({
  initialData,
}: UseEarnTopOpportunitiesProps): UseEarnTopOpportunitiesResult => {
  const connectedAddress = useAccountAddress();
  const walletCookie = useWalletCookie(ChainType.EVM) as Hex | undefined;
  const address = connectedAddress ?? walletCookie;

  return useEarnQuery<
    EarnOpportunities,
    Hex | undefined,
    EarnOpportunityWithLatestAnalytics[]
  >({
    queryKey: ['earn-top-opportunities', address],
    fetcher: getOpportunitiesTop,
    filter: address,
    placeholderData: address ? undefined : initialData,
    refetchInterval: FIVE_MINUTES_MS,
    select: (payload) => payload.data,
  });
};
