import { useMemo } from 'react';
import { AppPaths } from 'src/const/urls';
import type {
  ParticipantChain,
  Quest,
  RewardGroup,
} from 'src/types/loyaltyPass';
import { capitalizeString } from 'src/utils/capitalizeString';
import { resolveStrapiMediaUrl } from 'src/utils/strapi/strapiHelper';
import { useFormatDisplayRewardsData } from './useFormatDisplayRewardsData';
import type { QuestData } from 'src/types/strapi';
import type { Chain } from 'src/types/questDetails';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

interface DisplayQuestData {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionRichText: BlocksContent;
  info: string;
  startDate: string;
  endDate: string;
  hasEnded: boolean;
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

interface UseFormatDisplayQuestDataOptions {
  useBannerImage?: boolean;
  preferExtraWideImage?: boolean;
  baseNavPath?: string;
}

function isQuest(quest: Quest | QuestData): quest is Quest {
  return 'BannerImage' in quest;
}

export function useFormatDisplayQuestData(
  quest: Quest,
  options?: UseFormatDisplayQuestDataOptions,
): DisplayQuestData;
export function useFormatDisplayQuestData(
  quest: QuestData,
  options?: UseFormatDisplayQuestDataOptions,
): DisplayQuestData;

export function useFormatDisplayQuestData(
  quest: Quest | QuestData,
  {
    useBannerImage = true,
    preferExtraWideImage = false,
    baseNavPath = AppPaths.Missions,
  }: UseFormatDisplayQuestDataOptions = {},
) {
  const rewardGroups = useFormatDisplayRewardsData(
    quest.Slug,
    quest.CustomInformation,
    quest.Points ?? undefined,
  );

  return useMemo(() => {
    const {
      id,
      Title,
      Description,
      DescriptionRichText,
      Information,
      Slug,
      StartDate,
      EndDate,
      hasEnded,
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

    // preferExtraWideImage takes priority over useBannerImage. Use it for slots
    // that need a ~3:1 ratio (e.g. Profile page tiles) where BannerImage (2:1)
    // and Image (~1.54:1) would both be cropped incorrectly by object-fit:cover.
    // Falls back to Image if ExtraWideImage is not set on the quest.
    if (preferExtraWideImage) {
      imageUrl = resolveStrapiMediaUrl(
        quest.ExtraWideImage?.url || quest.Image?.url,
      );
    } else if (useBannerImage) {
      imageUrl = isQuest(quest)
        ? resolveStrapiMediaUrl(quest.BannerImage?.[0]?.url)
        : resolveStrapiMediaUrl(quest.BannerImage?.url);
    } else {
      imageUrl = resolveStrapiMediaUrl(quest.Image?.url);
    }

    return {
      id: id.toString(),
      slug: Slug,
      title: Title || '',
      description: Description || '',
      descriptionRichText: DescriptionRichText || [],
      info: Information || '',
      startDate: StartDate || '',
      endDate: EndDate || '',
      hasEnded: hasEnded ?? false,
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
  }, [rewardGroups, quest]);
}
