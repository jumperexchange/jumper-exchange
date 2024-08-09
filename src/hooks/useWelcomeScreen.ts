import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSettingsStore } from '@/stores/settings';
import { useMultisig } from './useMultisig';

interface useWelcomeScreenProps {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
}

export const useWelcomeScreen = (
  initialState?: boolean,
): useWelcomeScreenProps => {
  const [, setState] = useState(initialState);
  const [cookie, setCookie] = useCookies(['welcomeScreenClosed']);
  const { isMultisigSigner } = useMultisig();

  const [, sessionSetWelcomeScreenClosed] = useSettingsStore((state) => [
    state.welcomeScreenClosed,
    state.setWelcomeScreenClosed,
  ]);

  useEffect(() => {
    if (isMultisigSigner) {
      setState(true);
    } else {
      setState(cookie.welcomeScreenClosed);
    }
  }, [cookie.welcomeScreenClosed, isMultisigSigner]);

  const updateState = (closed: boolean) => {
    setState(closed);
    sessionSetWelcomeScreenClosed(closed);
    setCookie('welcomeScreenClosed', closed, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
      sameSite: true,
    });
  };

  return {
    // welcomeScreenClosed: state || sessionWelcomeScreenClosed,
    welcomeScreenClosed: true, // todo: adapt to get back the welcome screen
    setWelcomeScreenClosed: updateState,
  };
};
