'use client';
import { useSettingsStore } from '@/stores/settings';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FeatureCardsInner } from './FeatureCardsInner';

export const FeatureCards = () => {
  const welcomeScreenClosed = useSettingsStore(
    (state) => state.welcomeScreenClosed,
  );
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  if (!isDesktop || !welcomeScreenClosed) {
    return null;
  }

  return <FeatureCardsInner />;
};
