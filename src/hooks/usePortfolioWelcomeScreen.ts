import { useCallback, useEffect, useMemo } from 'react';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useSettingsStore } from '@/stores/settings';
import { useThemeStore } from '@/stores/theme';

interface usePortfolioWelcomeScreenResult {
  portfolioWelcomeScreenClosed: boolean | undefined;
  setPortfolioWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const validThemes = ['default', 'light', 'dark', 'system'];

export const usePortfolioWelcomeScreen =
  (): usePortfolioWelcomeScreenResult => {
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
