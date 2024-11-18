'use client';
import {
  STRAPI_FEATURE_CARDS,
} from '@/const/strapiContentKeys';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardData, JumperUserData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { usePersonalizedFeatureOnLevel } from 'src/hooks/usePersonalizedFeatureOnLevel';
import { shallow } from 'zustand/shallow';
import { FeatureCard, FeatureCardsContainer } from '.';
import { usePersonalizedFeatureCards } from '@/hooks/usePersonalizedFeatureCards';

export const FeatureCards = () => {
  const { account } = useAccount();
  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );
  const { points } = useLoyaltyPass(account?.address);
  const [widgetExpanded, setWidgetExpanded] = useState(false);
  const widgetEvents = useWidgetEvents();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const { data: cards, isSuccess } = useStrapi<FeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const { data: featureCardsToDisplay } = usePersonalizedFeatureCards();

  const { featureCards: featureCardsLevel } = usePersonalizedFeatureOnLevel({
    points: points,
    enabled: !!points && (!featureCardsToDisplay || featureCardsToDisplay?.length === 0),
  });

  useEffect(() => {
    const handleWidgetExpanded = async (expanded: boolean) => {
      setWidgetExpanded(expanded);
    };
    widgetEvents.on(WidgetEvent.WidgetExpanded, handleWidgetExpanded);

    return () =>
      widgetEvents.off(WidgetEvent.WidgetExpanded, handleWidgetExpanded);
  }, [widgetEvents, widgetExpanded]);

  function excludedFeatureCardsFilter(el: FeatureCardData) {
    if (
      !el.attributes.featureCardsExclusions ||
      !Array.isArray(el.attributes.featureCardsExclusions?.data)
    ) {
      return true;
    }

    const exclusions = el.attributes.featureCardsExclusions.data.map(
      (item) => item.attributes.uid,
    );

    return !exclusions.some((uid) => disabledFeatureCards.includes(uid));
  }

  const slicedFeatureCards = useMemo(() => {
    if (Array.isArray(cards) && !!cards.length) {
      return cards
        ?.filter(excludedFeatureCardsFilter)
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
      featureCardsToDisplay && featureCardsToDisplay.length > 0
        ?  featureCardsLevel?.filter((card) => featureCardsToDisplay.includes(card.id))
        : featureCardsLevel && featureCardsLevel.length > 0
          ? [featureCardsLevel[0]]
          : undefined;

    if (
      Array.isArray(personalizedFeatureCards) &&
      !!personalizedFeatureCards.length
    ) {
      return personalizedFeatureCards
        ?.filter(excludedFeatureCardsFilter)
        ?.filter(
          (el, index) =>
            el.attributes.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCardsToDisplay, featureCardsLevel]);

  return (
    isDesktop &&
    welcomeScreenClosed &&
    !widgetExpanded && (
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
