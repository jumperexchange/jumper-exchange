import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useFeatureCards } from '../../hooks/useFeatureCards';
import { useSettingsStore } from '../../stores';
import { FeatureCard, FeatureCardsContainer } from './index';

export const FeatureCards = () => {
  const [featureCards, setFeatureCards] = useState([]);
  const [disabledFeatureCards, welcomeScreenEntered] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenEntered],
    shallow,
  );

  const { featureCards: data, isSuccess } = useFeatureCards();
  console.log(data);
  const featureCardsFetched = useMemo(() => {
    return data?.items?.filter(
      (el, index) =>
        isSuccess &&
        el.fields.displayConditions &&
        !disabledFeatureCards.includes(el.fields.displayConditions[0]?.id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data?.items]);

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
