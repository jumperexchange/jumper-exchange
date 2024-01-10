import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FeatureCard } from 'src/components';
import { useFeatureCards } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import type { FeatureCardData } from 'src/types';
import { deepMerge, removeEmpty } from 'src/utils';
import { shallow } from 'zustand/shallow';
import { FeatureCardsContainer } from '.';

export const FeatureCards = () => {
  const [featureCards, setFeatureCards] = useState<FeatureCardData[]>([]);
  const [disabledFeatureCards, welcomeScreenClosed, languageMode] =
    useSettingsStore(
      (state) => [
        state.disabledFeatureCards,
        state.welcomeScreenClosed,
        state.languageMode,
      ],
      shallow,
    );
  // get english response
  const { featureCards: data, isSuccess } = useFeatureCards();
  // get translated response
  const {
    featureCards: translatedFeatureCards,
    isSuccess: translatedFeatureCardsIsSuccess,
  } = useFeatureCards({ translation: true });

  // remove null´s (missing entries) from translated object
  const cleanedTranslation = useMemo(() => {
    const cleanedTranslation = translatedFeatureCards?.map((el) =>
      removeEmpty(el),
    );
    return cleanedTranslation;
  }, [translatedFeatureCards]);

  // merge
  const filteredResponse = data?.map((el) => {
    const translatedItem = cleanedTranslation?.find(
      (foundItem) =>
        foundItem?.attributes?.DisplayConditions.id ===
        el.attributes?.DisplayConditions.id,
    );
    if (translatedItem) {
      return deepMerge(el, translatedItem);
    }
    return el;
  });

  const featureCardsFetched = useMemo(() => {
    if (Array.isArray(filteredResponse) && !!filteredResponse.length) {
      return filteredResponse?.filter(
        (el, index) =>
          isSuccess &&
          el.attributes.DisplayConditions &&
          !disabledFeatureCards.includes(el.attributes.DisplayConditions?.id),
      );
    }
    // trigger featureCardsFetched-filtering only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageMode, isSuccess, translatedFeatureCardsIsSuccess]);

  useEffect(() => {
    if (Array.isArray(featureCardsFetched)) {
      !!featureCardsFetched.length &&
        setFeatureCards(featureCardsFetched?.slice(0, 4));
    }
  }, [featureCardsFetched]);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));
  return (
    isDesktop &&
    welcomeScreenClosed && (
      <FeatureCardsContainer>
        {featureCards.map((cardData, index) => {
          return (
            <FeatureCard
              isSuccess={isSuccess}
              data={cardData}
              key={`feature-card-${index}`}
            />
          );
        })}
      </FeatureCardsContainer>
    )
  );
};
