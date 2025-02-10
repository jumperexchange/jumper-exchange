'use client';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardData } from '@/types/strapi';
import { useMemo } from 'react';
import { useFeatureCardsFilter } from 'src/hooks/feature-cards/useFeatureCardsFilter';
import { shallow } from 'zustand/shallow';
import { useWidgetExpanded } from '../useWidgetExpanded';

export const useFeatureCards = () => {
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );
  const widgetExpanded = useWidgetExpanded();
  const { excludedFeatureCardsFilter } = useFeatureCardsFilter();

  const { data: cards } = useStrapi<FeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards)) {
      return cards
        ?.filter(excludedFeatureCardsFilter)
        ?.filter(
          (el) =>
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 1);
    }
  }, [cards, disabledFeatureCards, excludedFeatureCardsFilter]);

  if (slicedFeatureCards?.length === 0 || widgetExpanded) {
    return null;
  }

  return slicedFeatureCards;
};
