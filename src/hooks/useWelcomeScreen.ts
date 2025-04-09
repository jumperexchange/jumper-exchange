import { useSettingsStore } from '@/stores/settings';
import { useCallback, useEffect, useMemo } from 'react';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useThemeStore } from '@/stores/theme';

interface useWelcomeScreenResult {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const validThemes = ['default', 'light', 'dark', 'system'];

export const useWelcomeScreen = (): useWelcomeScreenResult => {
  const { isMainPaths } = useMainPaths();
  const activeTheme = useThemeStore((state) => state.activeTheme);

  const [welcomeScreenClosed, setWelcomeScreenClosed] = useSettingsStore(
    (state) => [state.welcomeScreenClosed, state.setWelcomeScreenClosed],
  );

  const enabled = useMemo(
    // check if theme is any of jumper-themes or undefined
    () => {
      return !!(
        isMainPaths &&
        activeTheme && validThemes.includes(activeTheme)
      );
    },
    [activeTheme],
  );

  const updateState = useCallback(
    (closed: boolean) => {
      if (!enabled) {
        return;
      }
      setWelcomeScreenClosed(closed);
    },
    [enabled, setWelcomeScreenClosed],
  );

  return {
    welcomeScreenClosed,
    setWelcomeScreenClosed: updateState,
    enabled,
  };
};
