import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import {
  MerklUserRewards,
  MerklUserRewardsData,
} from 'src/app/lib/getMerklUserRewards';
import { AvailableRewardsExtended } from 'src/types/merkl';
import type { MerklRewardsData } from 'src/types/strapi';
import { MERKL_CLAIMING_ADDRESS } from './merklApi';

interface TokenAddressesByChain {
  [chainId: number]: Set<string>;
}

const processTokenAddressesByChain = (
  merklRewards: MerklRewardsData[] = [],
): TokenAddressesByChain => {
  return merklRewards.reduce<TokenAddressesByChain>((acc, reward) => {
    if (reward.ChainId && reward.TokenAddress) {
      const chainId = Number(reward.ChainId);
      const tokenAddress = reward.TokenAddress.toLowerCase();
      if (!acc[chainId]) {
        acc[chainId] = new Set();
      }
      acc[chainId].add(tokenAddress);
    }
    return acc;
  }, {});
};

const processReward = (
  reward: MerklUserRewards[0],
  chainData: MerklUserRewardsData,
): AvailableRewardsExtended => {
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
    explorerLink: chainData.chain.explorers?.[0]?.url || '',
    chainLogo: chainData.chain.icon,
    tokenLogo: '', // Will be filled later if needed
    claimingAddress: MERKL_CLAIMING_ADDRESS,
    tokenDecimals: decimals,
  };
};

export const processRewardsData = (
  userRewardsData: MerklUserRewardsData[],
  merklRewards?: MerklRewardsData[],
) => {
  const tokenAddressesByChain = processTokenAddressesByChain(merklRewards);

  // Process all rewards and collect campaign IDs
  const processedData = userRewardsData.flatMap((chainData) => {
    const chainId = Number(chainData.chain.id);
    return chainData.rewards
      .filter((reward) => {
        const chainTokens = tokenAddressesByChain[chainId];
        if (chainTokens?.size > 0) {
          return chainTokens.has(reward.token.address.toLowerCase());
        }
        return true;
      })
      .map((reward) => processReward(reward, chainData));
  });

  // Collect all campaign IDs
  const campaignIds = userRewardsData.flatMap((chainData) =>
    chainData.rewards.flatMap((reward) =>
      reward.breakdowns.map((breakdown) => String(breakdown.campaignId)),
    ),
  );

  // Get unique chain IDs where user has claimable rewards
  const chainsWithRewards = new Set(
    processedData
      .filter((reward) => reward.amountToClaim > 0)
      .map((reward) => reward.chainId),
  );

  return {
    rewardsToClaim: processedData,
    pastCampaigns: Array.from(new Set(campaignIds)),
    chainsWithClaimableRewards: Array.from(chainsWithRewards),
  };
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
    if (!exists) acc.push(item);
    return acc;
  }, []);
};

export const calculateMaxApy = (opportunities: MerklOpportunity[]): number => {
  let currentMax = 0;
  for (const opportunity of opportunities) {
    if (!opportunity?.aprRecord) continue;
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
