import { useSettingsStore } from '@/stores/settings';
import { useCallback, useEffect, useState } from 'react';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useHydrated } from '@/hooks/useHydrated';

interface useWelcomeScreenResult {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const validThemes = ['default', 'light', 'dark', 'system'];

export const useWelcomeScreen = (): useWelcomeScreenResult => {
  const { isMainPaths } = useMainPaths();
  const hydrated = useHydrated();

  const [welcomeScreenClosedFromStore, setWelcomeScreenClosed] =
    useSettingsStore((state) => [
      state.welcomeScreenClosed,
      state.setWelcomeScreenClosed,
    ]);

  const [welcomeScreenClosed, setWelcomeScreenClosedLocal] = useState<boolean>(
    welcomeScreenClosedFromStore,
  );

  useEffect(() => {
    if (hydrated) {
      setWelcomeScreenClosedLocal(welcomeScreenClosedFromStore);
    }
  }, [hydrated, welcomeScreenClosedFromStore]);

  const enabled = !!isMainPaths;

  const updateState = useCallback(
    (closed: boolean) => {
      if (!enabled) {
        return;
      }
      setWelcomeScreenClosed(closed);
      setWelcomeScreenClosedLocal(closed);
    },
    [enabled, setWelcomeScreenClosed],
  );

  return {
    welcomeScreenClosed,
    setWelcomeScreenClosed: updateState,
    enabled,
  };
};
