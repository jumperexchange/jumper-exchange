import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useFeatureCards } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import type { FeatureCardType } from 'src/types';
import { shallow } from 'zustand/shallow';
import { FeatureCard, FeatureCardsContainer } from '.';

export const FeatureCards = () => {
  const [featureCards, setFeatureCards] = useState<FeatureCardType[]>([]);
  const [disabledFeatureCards, welcomeScreenEntered] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenEntered],
    shallow,
  );

  const { featureCards: data, isSuccess } = useFeatureCards();
  const featureCardsFetched = useMemo(() => {
    if (Array.isArray(data?.items) && !!data?.items.length) {
      return data?.items?.filter(
        (el, index) =>
          isSuccess &&
          el.fields.displayConditions &&
          !disabledFeatureCards.includes(el.fields.displayConditions?.id),
      );
    }
    // trigger featureCardsFetched-filtering only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items, isSuccess]);

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
    welcomeScreenEntered && (
      <FeatureCardsContainer>
        {featureCards.map((cardData, index) => {
          return (
            <FeatureCard
              isSuccess={isSuccess}
              data={cardData}
              assets={data?.includes?.Asset || []}
              key={`feature-card-${index}`}
            />
          );
        })}
      </FeatureCardsContainer>
    )
  );
};
