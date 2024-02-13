import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { FeatureCard } from 'src/components';
import { useFeatureCards } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { shallow } from 'zustand/shallow';
import { FeatureCardsContainer } from '.';
import { usePersonalizedFeatureCards } from '../../hooks/usePersonalizedFeatureCards';

export const FeatureCards = () => {
  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );

  const { featureCards: cards, isSuccess } = useFeatureCards();
  const { featureCards: personalizedCards } = usePersonalizedFeatureCards();

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards) && !!cards.length) {
      return cards
        ?.filter(
          (el, index) =>
            isSuccess &&
            el.attributes.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes.DisplayConditions?.id),
        )
        .slice(0, 2);
    }
    //trigger featureCardsFetched-filtering only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, isSuccess]);

  const slicedPersonalizedFeatureCards = useMemo(() => {
    if (Array.isArray(personalizedCards) && !!personalizedCards.length) {
      return personalizedCards
        ?.filter(
          (el, index) =>
            el.attributes.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes.DisplayConditions?.id),
        )
        .slice(0, 1);
    }
    //trigger featureCardsFetched-filtering only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalizedCards]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));
  return (
    isDesktop &&
    welcomeScreenClosed && (
      <FeatureCardsContainer>
        {slicedPersonalizedFeatureCards?.slice(0, 1).map((cardData, index) => {
          return (
            <FeatureCard
              isSuccess={isSuccess}
              data={cardData}
              key={`feature-card-p-${index}`}
            />
          );
        })}
        {slicedFeatureCards?.map((cardData, index) => {
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
