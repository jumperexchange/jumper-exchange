import { useCallback } from 'react';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useSettingsStore } from '@/stores/settings';

interface UsePortfolioWelcomeScreenResult {
  portfolioWelcomeScreenClosed: boolean | undefined;
  setPortfolioWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const usePortfolioWelcomeScreen =
  (): UsePortfolioWelcomeScreenResult => {
    const { isMainPaths } = useMainPaths();

    const [portfolioWelcomeScreenClosed, setPortfolioWelcomeScreenClosed] =
      useSettingsStore((state) => [
        state.portfolioWelcomeScreenClosed,
        state.setPortfolioWelcomeScreenClosed,
      ]);

    const enabled = !!isMainPaths;

    const updateState = useCallback(
      (closed: boolean) => {
        if (!enabled) {
          return;
        }
        setPortfolioWelcomeScreenClosed(closed);
      },
      [enabled, setPortfolioWelcomeScreenClosed],
    );

    return {
      portfolioWelcomeScreenClosed,
      setPortfolioWelcomeScreenClosed: updateState,
      enabled,
    };
  };
