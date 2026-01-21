import type { MerklRewardsData } from 'src/types/strapi';

interface TokenAddressesByChain {
  [chainId: number]: Set<string>;
}

export interface RewardFilterConfig {
  allowedChains: Set<number>;
  tokenAddressesByChain: TokenAddressesByChain;
}

export const buildRewardFilter = (
  merklRewards: MerklRewardsData[] = [],
): RewardFilterConfig => {
  const allowedChains = new Set<number>();
  const tokenAddressesByChain: TokenAddressesByChain = {};

  for (const reward of merklRewards) {
    if (reward.ChainId) {
      const chainId = Number(reward.ChainId);
      allowedChains.add(chainId);

      if (reward.TokenAddress) {
        if (!tokenAddressesByChain[chainId]) {
          tokenAddressesByChain[chainId] = new Set();
        }
        tokenAddressesByChain[chainId].add(reward.TokenAddress.toLowerCase());
      }
    }
  }

  return { allowedChains, tokenAddressesByChain };
};

export const isRewardAllowed = (
  filter: RewardFilterConfig,
  chainId: number,
  tokenAddress: string,
): boolean => {
  if (filter.allowedChains.size === 0) {
    return true;
  }

  if (!filter.allowedChains.has(chainId)) {
    return false;
  }

  const chainTokens = filter.tokenAddressesByChain[chainId];
  if (chainTokens?.size) {
    return chainTokens.has(tokenAddress.toLowerCase());
  }

  return true;
};
