'use client';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { DeFiReacherReward } from 'src/types/rewards';
import type { MerklRewardsData } from 'src/types/strapi';
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
  merklRewards?: MerklRewardsData[];
}

type UseDeFiReacherRewardsResult = UseQueryResult<DeFiReacherReward[], Error>;

export const useDeFiReacherRewards = ({
  userAddress,
  merklRewards,
}: UseDeFiReacherRewardsProps): UseDeFiReacherRewardsResult => {
  const filter = buildRewardFilter(merklRewards);

  return useQuery({
    queryKey: ['deFiReacherRewards', userAddress],
    queryFn: () => getDeFiReacherRewards(userAddress!),
    enabled: !!userAddress,
    select: (data) =>
      data
        .filter((reward) =>
          isRewardAllowed(filter, reward.chainId, reward.tokenAddress),
        )
        .map(transformToDeFiReacherReward),
  });
};
