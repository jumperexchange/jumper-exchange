import { useMemo } from 'react';
import type { CustomInformation, RewardGroup } from 'src/types/loyaltyPass';
import type { RewardsInterface } from 'src/types/questDetails';
import { toCompactValue, toFixedFractionDigits } from 'src/utils/formatNumbers';
import { useMissionApy } from '@/hooks/mission/useMissionApy';
import { formatApy } from '@/utils/numbers/apy';

export const useFormatDisplayRewardsData = (
  slug: string,
  customInformation?: CustomInformation,
  pointsFallback?: number,
) => {
  const { tokenRewards, rewardType, rewardRange, chains, genericRewards } =
    useMemo(() => {
      return {
        tokenRewards: customInformation?.['tokenRewards'],
        rewardType: customInformation?.['rewardType'],
        rewardRange: customInformation?.['rewardRange'],
        chains: customInformation?.['chains'],
        genericRewards: customInformation?.['genericRewards'] ?? [],
      };
    }, [customInformation]);

  const { data } = useMissionApy(slug);
  const apyValue = data?.total;

  const apyRewards = useMemo(() => {
    if (apyValue) {
      return [
        {
          value: formatApy(apyValue),
          label: 'APR',
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
          value:
            typeof rewardRange === 'number'
              ? toCompactValue(rewardRange)
              : rewardRange || 'VAR.%',
          label,
        },
      ];
    } else if (pointsFallback) {
      return [
        {
          value: toCompactValue(pointsFallback),
          label,
        },
      ];
    }
    return [];
  }, [pointsFallback, rewardType, rewardRange]);

  const coinsRewards = useMemo(() => {
    if (tokenRewards) {
      return tokenRewards.map((tokenReward: RewardsInterface) => ({
        value: toCompactValue(tokenReward.amount),
        label: tokenReward.name,
        avatarUrl: tokenReward.logo ?? undefined,
      }));
    }
    return [];
  }, [tokenRewards]);

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
    if (genericRewards.length > 0) {
      groups.generic = genericRewards;
    }
    return groups;
  }, [apyRewards, xpRewards, coinsRewards, genericRewards]);

  return rewardGroups;
};
