import { flatMap, uniq, maxBy } from 'lodash';
import type { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import type {
  MerklUserRewards,
  MerklUserRewardsData,
} from 'src/app/lib/getMerklUserRewards';
import type { MerklReward, RewardFilterCriteria } from 'src/types/rewards';
import type { RewardApiLink } from 'src/types/jumper-backend';

import {
  buildRewardFilter,
  isRewardAllowed,
} from '@/utils/rewards/merklRewardFilter';
import { MERKL_CLAIMING_ADDRESS } from './merklApi';
import { formatTokenAmount } from '@lifi/widget';

const processReward = (reward: MerklUserRewards[0]): MerklReward => {
  const amountBigInt = BigInt(reward.amount);
  const claimedBigInt = BigInt(reward.claimed);
  const decimals = reward.token.decimals;
  const amountToClaim = Number(
    formatTokenAmount(amountBigInt - claimedBigInt, decimals),
  );

  return {
    chainId: reward.token.chainId,
    address: reward.token.address,
    symbol: reward.token.symbol,
    accumulatedAmountForContractBN: String(reward.amount),
    amountToClaim,
    amountAccumulated: Number(formatTokenAmount(amountBigInt, decimals)),
    proof: reward.proofs,
    claimingAddress: MERKL_CLAIMING_ADDRESS,
    tokenDecimals: decimals,
  };
};

export const processRewardsData = (
  userRewardsData: MerklUserRewardsData[],
  filterCriteria?: RewardFilterCriteria[],
) => {
  const filter = buildRewardFilter(filterCriteria);

  const rewardsToClaim = flatMap(userRewardsData, (chainData) => {
    const chainId = Number(chainData.chain.id);
    return chainData.rewards
      .filter((reward) =>
        isRewardAllowed(filter, chainId, reward.token.address),
      )
      .map(processReward);
  });

  const pastCampaigns = uniq(
    flatMap(userRewardsData, (chainData) =>
      flatMap(chainData.rewards, (reward) =>
        reward.breakdowns.map((breakdown) => String(breakdown.campaignId)),
      ),
    ),
  );

  const chainsWithClaimableRewards = uniq(
    rewardsToClaim
      .filter((reward) => reward.amountToClaim > 0)
      .map((reward) => reward.chainId),
  );

  return { rewardsToClaim, pastCampaigns, chainsWithClaimableRewards };
};
