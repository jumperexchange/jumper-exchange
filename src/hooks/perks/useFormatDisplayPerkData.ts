import { useMemo } from 'react';
import { PerksData, PerksDataAttributes } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useFormatDisplayPerkData = (perk: PerksDataAttributes) => {
  return useMemo(() => {
    const baseStrapiUrl = getStrapiBaseUrl();
    const {
      id,
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
    } = perk;

    return {
      id,
      title: Title,
      description: Description,
      href: Link,
      startDate: StartDate,
      endDate: EndDate,
      perkItems: PerkItems.map((perkItem) => perkItem.Label),
      unlockLevel: UnlockLevel,
      slug: Slug,
      bannerImageUrl: `${baseStrapiUrl}${BannerImage?.url}`,
      imageUrl: `${baseStrapiUrl}${Image?.url}`,
    };
  }, [perk]);
};
