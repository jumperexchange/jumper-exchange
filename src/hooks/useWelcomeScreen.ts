import { useSettingsStore } from '@/stores/settings';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useMultisig } from './useMultisig';

interface useWelcomeScreenProps {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
  enabled: boolean;
}

export const useWelcomeScreen = (
  initialState?: boolean,
  activeTheme?: string,
): useWelcomeScreenProps => {
  const [state, setState] = useState(initialState);
  const [cookie, setCookie] = useCookies(['welcomeScreenClosed', 'theme']);
  const { isMultisigSigner } = useMultisig();

  const [, sessionSetWelcomeScreenClosed] = useSettingsStore((state) => [
    state.welcomeScreenClosed,
    state.setWelcomeScreenClosed,
  ]);

  const enabled = useMemo(
    // check if theme is any of jumper-themes or undefined
    () =>
      activeTheme === 'default' ||
      activeTheme === 'light' ||
      activeTheme === 'dark' ||
      activeTheme === 'system' ||
      cookie.theme === 'default' ||
      cookie.theme === 'light' ||
      cookie.theme === 'dark' ||
      cookie.theme === 'system' ||
      !cookie.theme,
    [activeTheme, cookie],
  );

  useEffect(() => {
    if (isMultisigSigner) {
      setState(true);
    } else {
      setState(cookie.welcomeScreenClosed);
    }
  }, [cookie.welcomeScreenClosed, isMultisigSigner]);

  const updateState = (closed: boolean) => {
    if (!enabled) {
      return;
    }
    setState(closed);
    sessionSetWelcomeScreenClosed(closed);
    setCookie('welcomeScreenClosed', closed, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
      sameSite: true,
    });
  };

  return {
    welcomeScreenClosed: state,
    setWelcomeScreenClosed: updateState,
    enabled,
  };
};
