'use client';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardData } from '@/types/strapi';
import { useMemo } from 'react';
import { useFeatureCardsFilter } from 'src/hooks/feature-cards/useFeatureCardsFilter';
import { shallow } from 'zustand/shallow';
import { FeatureCard } from '../FeatureCard';

export const GeneralCards = () => {
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );
  const { excludedFeatureCardsFilter } = useFeatureCardsFilter();

  const { data: cards, isSuccess } = useStrapi<FeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards) && !!cards.length) {
      return cards
        ?.filter(excludedFeatureCardsFilter)
        ?.filter(
          (el) =>
            isSuccess &&
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, isSuccess]);

  if (slicedFeatureCards?.length === 0) {
    return null;
  }

  return slicedFeatureCards?.map((cardData, index) => {
    return <FeatureCard data={cardData} key={`feature-card-${index}`} />;
  });
};
