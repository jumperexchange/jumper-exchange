'use client';
import { useSettingsStore } from '@/stores/settings';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useSpindlCards } from 'src/hooks/feature-cards/spindl/useSpindlCards';
import { useFeatureCards } from 'src/hooks/feature-cards/useFeatureCards';
import { useSpindlStore } from 'src/stores/spindl';
import { shallow } from 'zustand/shallow';
import { FeatureCard, FeatureCardsContainer } from '.';
import { usePersonalizedFeatureCards } from '../../hooks/feature-cards/usePersonalizedFeatureCards';

export const FeatureCards = () => {
  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
    shallow,
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  useSpindlCards();

  const spindl = useSpindlStore((state) => state.spindl);
  const featureCards = useFeatureCards();
  const personalizedFeatureCards = usePersonalizedFeatureCards();

  const cards = useMemo(() => {
    return [
      ...(spindl ?? []),
      ...(featureCards ?? []),
      ...(personalizedFeatureCards ?? []),
    ];
  }, [spindl, featureCards, personalizedFeatureCards]);

  if (!isDesktop || !welcomeScreenClosed || !cards || cards.length === 0) {
    return null;
  }

  return (
    <FeatureCardsContainer>
      {cards?.map((cardData, index) => {
        return <FeatureCard data={cardData} key={`feature-card-${index}`} />;
      })}
    </FeatureCardsContainer>
  );
};
