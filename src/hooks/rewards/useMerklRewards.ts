'use client';
import { getMerklTokens, type MerklToken } from '@/app/lib/getMerklTokens';
import { getMerklUserRewards } from '@/app/lib/getMerklUserRewards';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import type { MerklReward, RewardFilterCriteria } from 'src/types/rewards';
import { MERKL_CACHE_TIME, MERKL_STALE_TIME } from 'src/utils/merkl/merklApi';
import { processRewardsData } from 'src/utils/merkl/merklHelper';
import { isAddress } from 'viem';

interface UseMerklRewardsProps {
  userAddress?: string;
  filterCriteria?: RewardFilterCriteria[];
  claimableOnly?: boolean;
}

interface UseMerklRewardsResult {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: MerklReward[];
  pastCampaigns: string[];
}

export const useMerklRewards = ({
  userAddress,
  filterCriteria = [],
  claimableOnly = false,
}: UseMerklRewardsProps): UseMerklRewardsResult => {
  const isValidAddress = !!userAddress && isAddress(userAddress);

  const chainIds = useMemo(() => {
    if (!filterCriteria.length) {
      return REWARDS_CHAIN_IDS;
    }
    return [...new Set(filterCriteria.map((c) => String(c.chainId)))];
  }, [filterCriteria]);

  const {
    data: userRewardsData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['MerklUserRewards', userAddress, chainIds.join(',')],
    queryFn: () =>
      getMerklUserRewards({ userAddress, chainIds, claimableOnly }),
    enabled: isValidAddress && chainIds.length > 0,
    refetchInterval: MERKL_CACHE_TIME,
    staleTime: MERKL_STALE_TIME,
    gcTime: MERKL_CACHE_TIME,
  });

  const { rewardsToClaim, pastCampaigns, chainsWithClaimableRewards } =
    useMemo(() => {
      if (!userRewardsData || !isValidAddress) {
        return {
          rewardsToClaim: [],
          pastCampaigns: [],
          chainsWithClaimableRewards: [],
        };
      }
      return processRewardsData(userRewardsData, filterCriteria);
    }, [userRewardsData, filterCriteria, isValidAddress]);

  const tokenAddressMap = useQueries({
    queries: chainsWithClaimableRewards.map((chainId) => ({
      queryKey: ['MerklTokens', chainId],
      queryFn: () => getMerklTokens({ chainId: Number(chainId) }),
      enabled: isValidAddress && !!chainId,
      staleTime: MERKL_STALE_TIME,
      gcTime: MERKL_CACHE_TIME,
    })),
    combine: (results) =>
      results.reduce<Record<string, MerklToken>>((acc, result, i) => {
        (result.data || []).forEach((token) => {
          acc[
            `${chainsWithClaimableRewards[i]}_${token.address.toLowerCase()}`
          ] = token;
        });
        return acc;
      }, {}),
  });

  const availableRewards = useMemo<MerklReward[]>(
    () =>
      rewardsToClaim.map((reward) => {
        const merklToken =
          tokenAddressMap[`${reward.chainId}_${reward.address.toLowerCase()}`];
        return {
          ...reward,
          logoURI: merklToken?.icon || '',
        };
      }),
    [rewardsToClaim, tokenAddressMap],
  );

  if (!isValidAddress) {
    return {
      isLoading: false,
      isSuccess: false,
      availableRewards: [],
      pastCampaigns: [],
    };
  }

  return {
    isLoading,
    isSuccess,
    availableRewards,
    pastCampaigns,
  };
};
