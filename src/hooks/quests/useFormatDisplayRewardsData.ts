import { CustomInformation, RewardGroup } from 'src/types/loyaltyPass';
import { useMissionsMaxAPY } from '../useMissionsMaxAPY';
import { useMemo } from 'react';
import { RewardsInterface } from 'src/components/ProfilePage/QuestCard/QuestCard';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';

export const useFormatDisplayRewardsData = (
  customInformation?: CustomInformation,
  pointsFallback?: number,
) => {
  const { tokenRewards, rewardType, rewardRange, rewardsIds, chains } =
    useMemo(() => {
      return {
        tokenRewards: customInformation?.['tokenRewards'],
        rewardType: customInformation?.['rewardType'],
        rewardRange: customInformation?.['rewardRange'],
        rewardsIds: customInformation?.['rewardsIds'],
        chains: customInformation?.['chains'],
      };
    }, [JSON.stringify(customInformation ?? {})]);

  const chainIds = (chains ?? [])
    .map((chain) => chain.chainId)
    .filter((chainId) => chainId !== undefined);

  const { apy: apyValue } = useMissionsMaxAPY(rewardsIds, chainIds);

  const apyRewards = useMemo(() => {
    if (apyValue) {
      return [
        {
          value: `${toFixedFractionDigits(apyValue, 0, 2)}%`,
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
    if (tokenRewards) {
      return tokenRewards.map((tokenReward: RewardsInterface) => ({
        value: tokenReward.amount,
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
    return groups;
  }, [apyRewards, xpRewards, coinsRewards]);

  return rewardGroups;
};
