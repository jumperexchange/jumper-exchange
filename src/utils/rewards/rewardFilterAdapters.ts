import type { RewardFilterCriteria } from 'src/types/rewards';
import type { MerklRewardsData } from 'src/types/strapi';
import type { Token } from 'src/types/jumper-backend';

export const fromMerklRewardsData = (
  rewards: MerklRewardsData[] = [],
): RewardFilterCriteria[] => {
  return rewards
    .filter((r) => r.ChainId !== null)
    .map((r) => ({
      chainId: Number(r.ChainId),
      tokenAddress: r.TokenAddress?.toLowerCase(),
    }));
};

export const fromTokens = (tokens: Token[] = []): RewardFilterCriteria[] => {
  return tokens.map((t) => ({
    chainId: t.chain.chainId,
    tokenAddress: t.address.toLowerCase(),
  }));
};
