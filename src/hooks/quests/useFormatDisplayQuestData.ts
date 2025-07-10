import { useMemo } from 'react';
import { AppPaths } from 'src/const/urls';
import { ParticipantChain, Quest, RewardGroup } from 'src/types/loyaltyPass';
import { capitalizeString } from 'src/utils/capitalizeString';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { useFormatDisplayRewardsData } from './useFormatDisplayRewardsData';
import { QuestData } from 'src/types/strapi';
import { Chain } from 'src/types/questDetails';

interface DisplayQuestData {
  id: string;
  slug: string;
  title: string;
  description: string;
  info: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  participants?: ParticipantChain[];
  rewardGroups: Record<string, RewardGroup[]>;
  href: string;
  partnerLink?: {
    url: string;
    label: string;
  };
  chain?: {
    name?: string;
    id?: string | number;
  };
}

function isQuest(quest: Quest | QuestData): quest is Quest {
  return 'BannerImage' in quest;
}

export function useFormatDisplayQuestData(
  quest: Quest,
  useBannerImage?: boolean,
  baseNavPath?: string,
): DisplayQuestData;
export function useFormatDisplayQuestData(
  quest: QuestData,
  useBannerImage?: boolean,
  baseNavPath?: string,
): DisplayQuestData;

export function useFormatDisplayQuestData(
  quest: Quest | QuestData,
  useBannerImage: boolean = true,
  baseNavPath: string = AppPaths.Missions,
) {
  const rewardGroups = useFormatDisplayRewardsData(
    quest.CustomInformation,
    quest.Points ?? undefined,
  );

  return useMemo(() => {
    const baseStrapiUrl = getStrapiBaseUrl();
    const {
      id,
      Title,
      Description,
      Information,
      Slug,
      StartDate,
      EndDate,
      Link,
      CustomInformation,
    } = quest;

    const chains = (CustomInformation?.['chains'] ?? []) as Chain[];
    const projectData = CustomInformation?.['projectData'];
    const projectDataName = projectData?.project;
    const chainId = projectData?.chainId;
    const chainName = projectData?.chain;
    const partnerLinkHref = CustomInformation?.['socials']?.website;
    const shouldOverrideWithInternalLink =
      !!CustomInformation?.['shouldOverrideWithInternalLink'];

    let imageUrl: string | undefined;

    if (useBannerImage) {
      imageUrl = isQuest(quest)
        ? quest.BannerImage?.[0]?.url
          ? `${baseStrapiUrl}${quest.BannerImage[0].url}`
          : undefined
        : quest.BannerImage?.url
          ? `${baseStrapiUrl}${quest.BannerImage?.url}`
          : undefined;
    } else {
      imageUrl = quest.Image ? `${baseStrapiUrl}${quest.Image.url}` : undefined;
    }

    return {
      id: id.toString(),
      slug: Slug,
      title: Title || '',
      description: Description || '',
      info: Information || '',
      startDate: StartDate || '',
      endDate: EndDate || '',
      imageUrl: imageUrl,
      participants: chains?.map((chain) => ({
        avatarUrl: chain.logo,
        label: chain.name,
        id: chain.chainId,
      })),
      rewardGroups,
      href: shouldOverrideWithInternalLink ? `${baseNavPath}/${Slug}` : Link,
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
  }, [rewardGroups, JSON.stringify(quest)]);
}
