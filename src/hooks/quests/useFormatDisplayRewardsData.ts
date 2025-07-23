import { CustomInformation, RewardGroup } from 'src/types/loyaltyPass';
import { useMissionsMaxAPY } from '../useMissionsMaxAPY';
import { useMemo } from 'react';

export const useFormatDisplayRewardsData = (
  customInformation?: CustomInformation,
  pointsFallback?: number,
) => {
  const { rewards, rewardType, rewardRange, claimingIds } = useMemo(() => {
    return {
      rewards: customInformation?.['rewards'],
      rewardType: customInformation?.['rewardType'],
      rewardRange: customInformation?.['rewardRange'],
      claimingIds: customInformation?.['claimingIds'],
    };
  }, [JSON.stringify(customInformation ?? {})]);

  //   const chains = customInformation?.['chains'] ?? [];

  // @TODO maybe need to pass the chainIds
  const { apy: apyValue } = useMissionsMaxAPY(claimingIds, undefined);

  const apyRewards = useMemo(() => {
    if (apyValue) {
      return [
        {
          value: apyValue,
          label: 'APY',
        },
      ];
    }
    return [];
  }, [apyValue]);

  const xpRewards = useMemo(() => {
    const label = 'XP';
    if (rewardType === 'weekly') {
      return [
        {
          value: rewardRange || 'VAR.%',
          label,
        },
      ];
    } else if (pointsFallback) {
      return [
        {
          value: pointsFallback,
          label,
        },
      ];
    }
    return [];
  }, [pointsFallback, rewardType, rewardRange]);

  const coinsRewards = useMemo(() => {
    if (rewards) {
      return [
        {
          value: rewards.amount,
          label: rewards.name,
          avatarUrl: rewards.logo ?? undefined,
        },
      ];
    }
    return [];
  }, [rewards]);

  const rewardGroups = useMemo(() => {
    const groups: Record<string, RewardGroup[]> = {};
    if (apyRewards.length > 0) {
      groups.apy = apyRewards;
    }
    if (xpRewards.length > 0) {
      groups.xp = xpRewards;
    }
    if (coinsRewards.length > 0) {
      groups.coins = coinsRewards;
    }
    return groups;
  }, [apyRewards, xpRewards, coinsRewards]);

  return rewardGroups;
};
