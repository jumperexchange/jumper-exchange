import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FeatureCard } from 'src/components';
import { useFeatureCards } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import type { FeatureCardData } from 'src/types';
import { shallow } from 'zustand/shallow';
import { FeatureCardsContainer } from '.';
import { useWallet } from 'src/providers';
import { useFetchUser } from 'src/hooks/useFetchUser';

export const FeatureCards = () => {
  const { account } = useWallet();
  //Todo: rerender if new featureCards, fetch the featureCards from the store and merge cards
  const [featureCards, setFeatureCards] = useState<FeatureCardData[]>([]);
  const [personalizedFeatureCards, setPersonalizedFeatureCards] = useState<
    FeatureCardData[]
  >([]);
  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );

  //Todo check if the user is Connected
  const { featureCards: data, isSuccess } = useFeatureCards();
  const featureCardsFetched = useMemo(() => {
    if (Array.isArray(data) && !!data.length) {
      return data?.filter(
        (el, index) =>
          isSuccess &&
          el.attributes.DisplayConditions &&
          !disabledFeatureCards.includes(el.attributes.DisplayConditions?.id),
      );
    }
    // trigger featureCardsFetched-filtering only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    if (!!account.address) {
      const { featureCards: personalizedCards, isSuccess } = useFetchUser(
        account.address,
      );
      if (isSuccess && personalizedCards) {
        setPersonalizedFeatureCards(personalizedCards);
      }
    }
  }, [account]);

  useEffect(() => {
    let cardsToDisplay = personalizedFeatureCards;
    if (Array.isArray(featureCardsFetched)) {
      cardsToDisplay = cardsToDisplay.concat(featureCardsFetched);
    }
    !!cardsToDisplay.length && setFeatureCards(cardsToDisplay?.slice(0, 4));
  }, [featureCardsFetched, personalizedFeatureCards]);

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
