'use client';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { DeFiReacherReward } from 'src/types/rewards';
import {
  getDeFiReacherRewards,
  type DeFiReacherApiReward,
} from '@/app/lib/getDeFiReacherRewards';

const transformToDeFiReacherReward = (
  apiReward: DeFiReacherApiReward,
): DeFiReacherReward => ({
  chainId: apiReward.chainId,
  address: apiReward.tokenAddress,
  symbol: apiReward.tokenSymbol,
  amountToClaim: Number(apiReward.amountFormatted),
  tokenDecimals: apiReward.tokenDecimals,
  campaignId: apiReward.campaignId,
  contractAddress: apiReward.contractAddress,
});

type UseDeFiReacherRewardsResult = UseQueryResult<DeFiReacherReward[], Error>;

export const useDeFiReacherRewards = (
  userAddress?: string,
): UseDeFiReacherRewardsResult => {
  return useQuery({
    queryKey: ['deFiReacherRewards', userAddress],
    queryFn: () => getDeFiReacherRewards(userAddress!),
    enabled: !!userAddress,
    select: (data) => data.map(transformToDeFiReacherReward),
  });
};
