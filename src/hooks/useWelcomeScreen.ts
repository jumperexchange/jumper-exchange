import { useSettingsStore } from '@/stores/settings';
import { useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useMultisig } from './useMultisig';
import { useMainPaths } from '@/hooks/useMainPaths';

interface useWelcomeScreenProps {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const validThemes = ['default', 'light', 'dark', 'system'];

export const useWelcomeScreen = (
  activeTheme?: string,
): useWelcomeScreenProps => {
  const { isMainPaths } = useMainPaths();
  const [cookie, setCookie] = useCookies(['welcomeScreenClosed', 'theme']);

  const [welcomeScreenClosed, setWelcomeScreenClosed] = useSettingsStore(
    (state) => [state.welcomeScreenClosed, state.setWelcomeScreenClosed],
  );

  const enabled = useMemo(
    // check if theme is any of jumper-themes or undefined
    () => {
      return (
        isMainPaths &&
        ((activeTheme && validThemes.includes(activeTheme)) ||
          validThemes.includes(cookie.theme) ||
          !cookie.theme)
      );
    },
    [activeTheme, cookie],
  );

  const updateState = useCallback(
    (closed: boolean) => {
      if (!enabled) {
        return;
      }
      setWelcomeScreenClosed(closed);
      setCookie('welcomeScreenClosed', closed, {
        path: '/', // Cookie available across the entire website
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
        sameSite: true,
      });
    },
    [enabled, setCookie, setWelcomeScreenClosed],
  );

  return {
    welcomeScreenClosed,
    setWelcomeScreenClosed: updateState,
    enabled,
  };
};
