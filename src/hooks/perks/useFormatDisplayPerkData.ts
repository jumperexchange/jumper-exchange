import { useMemo } from 'react';
import { type PerksDataAttributes } from 'src/types/strapi';
import { resolveStrapiMediaUrl } from 'src/utils/strapi/strapiHelper';

export const useFormatDisplayPerkData = (perk: PerksDataAttributes) => {
  return useMemo(() => {
    const {
      documentId,
      Title,
      Description,
      BannerImage,
      Image,
      Link,
      StartDate,
      EndDate,
      PerkItems,
      UnlockLevel,
      Slug,
      ClaimableSteps,
      ClaimableStepProps,
      HowToUseDescription,
      NextStepsDescription,
      HasCustomPromoCodes,
    } = perk;

    const bannerImageUrl = resolveStrapiMediaUrl(BannerImage?.url) ?? '';
    const imageUrl = resolveStrapiMediaUrl(Image?.url) ?? '';

    return {
      id: documentId,
      title: Title,
      description: Description,
      href: Link,
      startDate: StartDate,
      endDate: EndDate,
      perkItems: PerkItems.map((perkItem) => perkItem.Label),
      unlockLevel: UnlockLevel,
      slug: Slug,
      bannerImageUrl,
      imageUrl,
      claimableSteps: ClaimableSteps?.selectedValues ?? [],
      claimableStepProps: ClaimableStepProps ?? {},
      howToUsePerkDescription: HowToUseDescription,
      nextStepsDescription: NextStepsDescription,
      hasCustomPromoCodes: !!HasCustomPromoCodes,
    };
  }, [perk]);
};
