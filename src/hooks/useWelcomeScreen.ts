import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { usePartnerTheme } from './usePartnerTheme';

interface useWelcomeScreenProps {
  welcomeScreenDisabled: boolean;
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
}

export const useWelcomeScreen = (
  initialState?: boolean,
): useWelcomeScreenProps => {
  const [state, setState] = useState(initialState);
  const [cookie, setCookie] = useCookies(['welcomeScreenClosed']);
  const { activeUid } = usePartnerTheme();

  useEffect(() => {
    setState(!!activeUid || cookie.welcomeScreenClosed);
  }, [activeUid, cookie.welcomeScreenClosed]);

  const updateState = (closed: boolean) => {
    if (!activeUid) {
      setState(closed);
      setCookie('welcomeScreenClosed', closed, {
        path: '/', // Cookie available across the entire website
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
        sameSite: true,
      });
    }
  };

  return {
    welcomeScreenDisabled: !!activeUid,
    welcomeScreenClosed: state,
    setWelcomeScreenClosed: updateState,
  };
};
