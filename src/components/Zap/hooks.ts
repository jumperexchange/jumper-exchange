import { useMemo } from 'react';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { Quest } from 'src/types/loyaltyPass';
import { capitalizeString } from 'src/utils/capitalizeString';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

// Move to generic types
interface ChainParticipant {
  name: string;
  logo: string;
  chainId: number;
}

export const useFormatDisplayZapData = (zap: Quest) => {
  const baseStrapiUrl = getStrapiBaseUrl();
  const {
    id,
    Title,
    Description,
    Information,
    Slug,
    StartDate,
    EndDate,
    Points,
    BannerImage,
    Link,
    CustomInformation = {} as any,
  } = zap;

  const rewards = CustomInformation?.['rewards'];
  const rewardType = CustomInformation?.['rewardType'];
  const rewardRange = CustomInformation?.['rewardRange'];
  const claimingIds = CustomInformation?.['claimingIds'];
  const chains = (CustomInformation?.['chains'] ?? []) as ChainParticipant[];
  const projectData = CustomInformation?.['projectData'];
  const projectDataName = projectData?.project;
  const chainId = projectData?.chainId;
  const chainName = projectData?.chain;
  const partnerLinkHref = CustomInformation?.['socials']?.website;
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

  return useMemo(() => {
    return {
      id: id.toString(),
      slug: Slug,
      title: Title || '',
      description: Description || '',
      info: Information || '',
      startDate: StartDate || '',
      endDate: EndDate || '',
      imageUrl: BannerImage?.[0]?.url
        ? `${baseStrapiUrl}${BannerImage[0].url}`
        : undefined,
      participants: chains?.map((chain) => ({
        avatarUrl: chain.logo,
        label: chain.name,
        id: chain.chainId,
      })),
      rewardGroups,
      href: shouldOverrideWithInternalLink ? `/zap/${Slug}` : Link,
      partnerLink: partnerLinkHref
        ? {
            url: partnerLinkHref,
            label: `Discover ${capitalizeString(projectDataName ?? '')}`,
          }
        : undefined,
      chain: {
        name: chainName,
        id: chainId,
      },
    };
  }, [
    id,
    Slug,
    Title,
    Description,
    Information,
    StartDate,
    EndDate,
    BannerImage,
    chains,
    partnerLinkHref,
    projectDataName,
    rewardGroups,
    chainName,
    chainId,
  ]);
};
