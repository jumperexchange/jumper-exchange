import { useQuery } from '@apollo/client';
import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { getFeatureCards } from '../../graphql/queries/featureCards';
import { useSettingsStore } from '../../stores';
import { FeatureCard, FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  const { loading, error, data } = useQuery(getFeatureCards);
  const [featureCards, setFeatureCards] = useState([]);
  const [disabledFeatureCards, welcomeScreenEntered] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenEntered],
    shallow,
  );

  const featureCardsFetched = useMemo(() => {
    return data?.featureCardCollection?.items.filter(
      (el, index) =>
        (el.displayConditions &&
          el.displayConditions[0] &&
          !el.displayConditions[0]?.showOnce) ||
        (el.displayConditions &&
          !disabledFeatureCards.includes(el.displayConditions[0]?.id)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.featureCardCollection?.items]);

  useEffect(() => {
    setFeatureCards(featureCardsFetched?.slice(0, 4));
  }, [featureCardsFetched]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg' as Breakpoint));

  return (
    isDesktop &&
    welcomeScreenEntered && (
      <FeatureCardsContainer>
        {featureCards?.length &&
          featureCards.map((cardData, index) => {
            return (
              <FeatureCard
                error={error}
                loading={loading}
                data={cardData}
                key={`feature-card-${index}`}
              />
            );
          })}
      </FeatureCardsContainer>
    )
  );
};
