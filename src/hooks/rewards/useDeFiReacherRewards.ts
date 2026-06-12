'use client';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import type {
  DeFiReacherReward,
  RewardFilterCriteria,
} from 'src/types/rewards';
import {
  getDeFiReacherRewards,
  type DeFiReacherApiReward,
} from '@/app/lib/getDeFiReacherRewards';
import {
  buildRewardFilter,
  isRewardAllowed,
} from '@/utils/rewards/merklRewardFilter';

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

interface UseDeFiReacherRewardsProps {
  userAddress?: string;
  filterCriteria?: RewardFilterCriteria[];
}

type UseDeFiReacherRewardsResult = UseQueryResult<DeFiReacherReward[], Error>;

export const useDeFiReacherRewards = ({
  userAddress,
  filterCriteria = [],
}: UseDeFiReacherRewardsProps): UseDeFiReacherRewardsResult => {
  const filter = useMemo(
    () => buildRewardFilter(filterCriteria),
    [filterCriteria],
  );

  const selectFn = useCallback(
    (data: DeFiReacherApiReward[]) =>
      data
        .filter((reward) =>
          isRewardAllowed(filter, reward.chainId, reward.tokenAddress),
        )
        .map(transformToDeFiReacherReward),
    [filter],
  );

  return useQuery({
    queryKey: ['deFiReacherRewards', userAddress],
    queryFn: () => getDeFiReacherRewards(userAddress!),
    enabled: !!userAddress,
    select: selectFn,
  });
};
