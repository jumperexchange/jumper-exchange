'use client';
import {
  STRAPI_FEATURE_CARDS,
  STRAPI_JUMPER_USERS,
} from '@/const/strapiContentKeys';
import { useAccounts } from '@/hooks/useAccounts';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import type { FeatureCardData, JumperUserData } from '@/types/strapi';
import type { Theme } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import { FeatureCard, FeatureCardsContainer } from '.';

export const FeatureCards = () => {
  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );

  const { account } = useAccounts();
  const { data: cards, isSuccess } = useStrapi<FeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const { data: jumperUser } = useStrapi<JumperUserData>({
    contentType: STRAPI_JUMPER_USERS,
    filterPersonalFeatureCards: {
      enabled: true,
      account: account,
    },
    queryKey: ['personalized-feature-cards'],
  });

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards) && !!cards.length) {
      return cards
        ?.filter(
          (el, index) =>
            isSuccess &&
            el.attributes.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes.uid),
        )
        .slice(0, 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, isSuccess]);

  const slicedPersonalizedFeatureCards = useMemo(() => {
    const personalizedFeatureCards =
      jumperUser && jumperUser[0]?.attributes?.feature_cards.data;
    if (
      Array.isArray(personalizedFeatureCards) &&
      !!personalizedFeatureCards.length
    ) {
      return personalizedFeatureCards
        ?.filter(
          (el, index) =>
            el.attributes.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumperUser]);

  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  return (
    isDesktop &&
    welcomeScreenClosed && (
      <FeatureCardsContainer>
        {slicedPersonalizedFeatureCards?.map((cardData, index) => {
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
