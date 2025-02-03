'use client';
import { STRAPI_FEATURE_CARDS } from '@/const/strapiContentKeys';
import { usePersonalizedFeatureCards } from '@/hooks/usePersonalizedFeatureCards';
import { useStrapi } from '@/hooks/useStrapi';
import { useSettingsStore } from '@/stores/settings';
import type { FeatureCardData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import type { RouteExecutionUpdate } from '@lifi/widget';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSpindlFetch } from 'src/hooks/spindl/useSpindlFetch';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { usePersonalizedFeatureOnLevel } from 'src/hooks/usePersonalizedFeatureOnLevel';
import { useSpindlStore } from 'src/stores/spindl';
import { shallow } from 'zustand/shallow';
import { FeatureCard, FeatureCardsContainer } from '.';

export const FeatureCards = () => {
  const { account } = useAccount();
  const { fetchSpindlData } = useSpindlFetch();

  const [disabledFeatureCards, welcomeScreenClosed] = useSettingsStore(
    (state) => [state.disabledFeatureCards, state.welcomeScreenClosed],
    shallow,
  );

  const { points } = useLoyaltyPass(account?.address);
  const [widgetExpanded, setWidgetExpanded] = useState(false);
  const [showSpindleAds, setShowSpindleAds] = useState(false);
  const widgetEvents = useWidgetEvents();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const spindl = useSpindlStore((state) => state.spindl);
  const { data: cards, isSuccess } = useStrapi<FeatureCardData>({
    contentType: STRAPI_FEATURE_CARDS,
    queryKey: ['feature-cards'],
  });

  const { data: featureCardsToDisplay } = usePersonalizedFeatureCards();

  const { featureCards: featureCardsLevel } = usePersonalizedFeatureOnLevel({
    points: points,
    enabled: !!points,
  });

  useEffect(() => {
    const handleWidgetExpanded = async (expanded: boolean) => {
      setWidgetExpanded(expanded);
    };
    const handleRouteUpdated = async (route: RouteExecutionUpdate) => {
      await fetchSpindlData({
        address: account?.address,
        chainId: route.route.toToken.chainId,
        tokenAddress: route.route.toToken.address,
      });
      setShowSpindleAds(true);
    };
    widgetEvents.on(WidgetEvent.WidgetExpanded, handleWidgetExpanded);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, handleRouteUpdated);

    return () => {
      widgetEvents.off(WidgetEvent.WidgetExpanded, handleWidgetExpanded);
      widgetEvents.off(WidgetEvent.RouteExecutionUpdated, handleRouteUpdated);
    };
  }, [account?.address, fetchSpindlData, widgetEvents, widgetExpanded]);

  function excludedFeatureCardsFilter(el: FeatureCardData) {
    if (
      !el.attributes?.featureCardsExclusions ||
      !Array.isArray(el.attributes?.featureCardsExclusions?.data)
    ) {
      return true;
    }

    const exclusions = el.attributes?.featureCardsExclusions.data.map(
      (item) => item.attributes?.uid,
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
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, isSuccess]);

  const slicedPersonalizedFeatureCards = useMemo(() => {
    const personalizedFeatureCards =
      featureCardsToDisplay && featureCardsToDisplay.length > 0
        ? featureCardsToDisplay
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
            el.attributes?.DisplayConditions &&
            !disabledFeatureCards.includes(el.attributes?.uid),
        )
        .slice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCardsToDisplay, featureCardsLevel]);

  const featureCards = [
    ...(showSpindleAds ? (spindl ?? []) : []),
    ...(!widgetExpanded ? (slicedPersonalizedFeatureCards ?? []) : []),
    ...(!widgetExpanded ? (slicedFeatureCards ?? []) : []),
  ].filter((_, index) => index < 3);

  return (
    isDesktop &&
    welcomeScreenClosed && (
      <FeatureCardsContainer>
        {featureCards?.map((cardData, index) => {
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
