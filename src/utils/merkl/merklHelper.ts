import { flatMap, uniq } from 'lodash';
import type { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import type {
  MerklUserRewards,
  MerklUserRewardsData,
} from 'src/app/lib/getMerklUserRewards';
import type { MerklReward } from 'src/types/rewards';
import type { MerklRewardsData } from 'src/types/strapi';
import {
  buildRewardFilter,
  isRewardAllowed,
} from '@/utils/rewards/merklRewardFilter';
import { MERKL_CLAIMING_ADDRESS } from './merklApi';

const processReward = (reward: MerklUserRewards[0]): MerklReward => {
  const amountBigInt = BigInt(reward.amount);
  const claimedBigInt = BigInt(reward.claimed);
  const decimals = reward.token.decimals;
  const amountToClaim = Number(
    (amountBigInt - claimedBigInt) / BigInt(10 ** decimals),
  );

  return {
    chainId: reward.token.chainId,
    address: reward.token.address,
    symbol: reward.token.symbol,
    accumulatedAmountForContractBN: String(reward.amount),
    amountToClaim,
    amountAccumulated: Number(amountBigInt / BigInt(10 ** decimals)),
    proof: reward.proofs,
    claimingAddress: MERKL_CLAIMING_ADDRESS,
    tokenDecimals: decimals,
  };
};

export const processRewardsData = (
  userRewardsData: MerklUserRewardsData[],
  merklRewards?: MerklRewardsData[],
) => {
  const filter = buildRewardFilter(merklRewards);

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

// this filters out duplicate opportunities
export const filterUniqueByIdentifier = (
  array: MerklOpportunity[],
): MerklOpportunity[] => {
  return array.reduce<MerklOpportunity[]>((acc, item) => {
    if (!item.identifier) {
      acc.push(item);
      return acc;
    }
    const exists = acc.some(
      (existing) => existing.identifier === item.identifier,
    );
    if (!exists) {
      acc.push(item);
    }
    return acc;
  }, []);
};

export const calculateMaxApy = (opportunities: MerklOpportunity[]): number => {
  let currentMax = 0;
  for (const opportunity of opportunities) {
    if (!opportunity?.aprRecord) {
      continue;
    }
    for (const breakdown of opportunity.aprRecord.breakdowns) {
      if (breakdown.value > currentMax) {
        currentMax = breakdown.value;
      }
    }
  }
  return currentMax;
};

export const sanitizeSearchQuery = (query: string): string => {
  // If the query contains an underscore, it's likely a chainId_identifier format
  // We only want the identifier part for the search
  return query.includes('_') ? query.split('_')[1] : query;
};
