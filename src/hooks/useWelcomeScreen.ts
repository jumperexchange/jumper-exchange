import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface useWelcomeScreenProps {
  welcomeScreenClosed: boolean | undefined;
  setWelcomeScreenClosed: (closed: boolean) => void;
}

export const useWelcomeScreen = (
  initialState?: boolean,
): useWelcomeScreenProps => {
  const [state, setState] = useState(initialState);
  const [cookie, setCookie] = useCookies(['welcomeScreenClosed']);

  useEffect(() => {
    setState(cookie.welcomeScreenClosed);
  }, [cookie.welcomeScreenClosed]);

  const updateState = (closed: boolean) => {
    setState(closed);
    setCookie('welcomeScreenClosed', closed, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
    });
  };

  return {
    welcomeScreenClosed: state,
    setWelcomeScreenClosed: updateState,
  };
};
