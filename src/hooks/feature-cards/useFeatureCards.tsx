'use client';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings';
import type { StrapiFeatureCardData } from '@/types/strapi';
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

  const { data: cards } = useStrapi<StrapiFeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards)) {
      return cards
        .filter(excludedFeatureCardsFilter)
        .filter(
          (el) =>
            el?.DisplayConditions && !disabledFeatureCards.includes(el?.uid),
        )
        .slice(0, 1);
    }
    // prevent re-loading on card-click
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  if (slicedFeatureCards?.length === 0 || widgetExpanded) {
    return null;
  }

  return slicedFeatureCards;
};
