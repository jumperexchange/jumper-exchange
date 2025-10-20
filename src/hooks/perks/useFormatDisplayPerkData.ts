import { useMemo } from 'react';
import { PerksDataAttributes } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useFormatDisplayPerkData = (perk: PerksDataAttributes) => {
  return useMemo(() => {
    const baseStrapiUrl = getStrapiBaseUrl();
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
    } = perk;

    let bannerImageUrl = '';
    if (BannerImage?.url) {
      bannerImageUrl = `${baseStrapiUrl}${BannerImage?.url}`;
    }

    let imageUrl = '';
    if (Image?.url) {
      imageUrl = `${baseStrapiUrl}${Image?.url}`;
    }

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
    };
  }, [perk]);
};
