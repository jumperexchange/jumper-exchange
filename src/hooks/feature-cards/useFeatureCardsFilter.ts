import { useSettingsStore } from 'src/stores/settings';
import type { StrapiFeatureCardData } from 'src/types/strapi';
import { shallow } from 'zustand/shallow';

export const useFeatureCardsFilter = () => {
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );

  const excludedFeatureCardsFilter = (el: StrapiFeatureCardData) => {
    if (!Array.isArray(el?.featureCardsExclusions)) {
      return true;
    }

    const exclusions = el?.featureCardsExclusions.map((item) => item?.uid);

    return !exclusions.some((uid) => disabledFeatureCards.includes(uid));
  };

  const filterAndSliceCards = (cards: StrapiFeatureCardData[]) =>
    cards
      .filter(excludedFeatureCardsFilter)
      .filter(
        (el) =>
          el?.DisplayConditions && !disabledFeatureCards.includes(el?.uid),
      )
      .slice(0, 2);

  return { excludedFeatureCardsFilter, filterAndSliceCards };
};
