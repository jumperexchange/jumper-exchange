import type { RewardFilterCriteria } from 'src/types/rewards';

interface TokenAddressesByChain {
  [chainId: number]: Set<string>;
}

export interface RewardFilterConfig {
  allowedChains: Set<number>;
  tokenAddressesByChain: TokenAddressesByChain;
}

export const buildRewardFilter = (
  criteria: RewardFilterCriteria[] = [],
): RewardFilterConfig => {
  const allowedChains = new Set<number>();
  const tokenAddressesByChain: TokenAddressesByChain = {};

  for (const { chainId, tokenAddress } of criteria) {
    allowedChains.add(chainId);

    if (tokenAddress) {
      if (!tokenAddressesByChain[chainId]) {
        tokenAddressesByChain[chainId] = new Set();
      }
      tokenAddressesByChain[chainId].add(tokenAddress.toLowerCase());
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
