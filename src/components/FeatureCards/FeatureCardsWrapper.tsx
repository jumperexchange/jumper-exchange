'use client';
import { useSettingsStore } from '@/stores/settings';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useSpindlCards } from 'src/hooks/feature-cards/spindl/useSpindlCards';
import { shallow } from 'zustand/shallow';
import { FeatureCardsContainer } from '.';
import { GeneralCards } from './GeneralCards/GeneralCards';
import { PersonalizedCards } from './PersonalizedCards/PersonalizedCards';
import { SpindlCards } from './SpindlCards/SpindlCards';

export const FeatureCardsWrapper = () => {
  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
    shallow,
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  useSpindlCards();

  if (!isDesktop || !welcomeScreenClosed) {
    return null;
  }

  return (
    <FeatureCardsContainer>
      <SpindlCards />
      <PersonalizedCards />
      <GeneralCards />
    </FeatureCardsContainer>
  );
};
