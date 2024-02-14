import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { FeatureCard } from 'src/components';
import { useFeatureCards } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import { shallow } from 'zustand/shallow';
import { FeatureCardsContainer } from '.';

export const FeatureCards = () => {
  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );

  const { featureCards: data, isSuccess } = useFeatureCards();
  const featureCards = useMemo(() => {
    if (Array.isArray(data) && !!data.length) {
      const filteredCards = data.filter(
        (el, index) =>
          isSuccess &&
          el.attributes.DisplayConditions &&
          !disabledFeatureCards.includes(el.attributes.DisplayConditions?.id),
      );
      const slicedCards = filteredCards.slice(0, 4);
      return slicedCards;
    }
    // Return a default value if data is not an array or if it's empty
    return [];
  }, [data, isSuccess, disabledFeatureCards]);
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
