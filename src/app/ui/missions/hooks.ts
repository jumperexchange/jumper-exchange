import { useMemo } from 'react';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { StrapiResponseData, QuestData } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useFormatDisplayMissionData = (
  mission: StrapiResponseData<QuestData>[number],
) => {
  const baseStrapiUrl = getStrapiBaseUrl();
  const {
    id,
    Title,
    Slug,
    StartDate,
    EndDate,
    Points,
    Image,
    Link,
    CustomInformation = {},
  } = mission;

  const rewards = CustomInformation?.['rewards'];
  const rewardType = CustomInformation?.['rewardType'];
  const rewardRange = CustomInformation?.['rewardRange'];
  const claimingIds = CustomInformation?.['claimingIds'];
  const chains = CustomInformation?.['chains'];
  const shouldOverrideWithInternalLink =
    !!CustomInformation?.['shouldOverrideWithInternalLink'];
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
    } else if (Points) {
      return [
        {
          value: Points,
          label,
        },
      ];
    }
    return [];
  }, [Points, rewardType, rewardRange]);

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
    const groups: Record<string, any[]> = {};
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

  return {
    id: id.toString(),
    slug: Slug,
    title: Title || '',
    startDate: StartDate || '',
    endDate: EndDate || '',
    imageUrl: Image?.url ? `${baseStrapiUrl}${Image.url}` : undefined,
    participants: chains?.map((chain: any) => ({
      avatarUrl: chain.logo,
      label: chain.name,
    })),
    rewardGroups,
    href: shouldOverrideWithInternalLink ? `/missions/${Slug}` : Link,
  };
};
