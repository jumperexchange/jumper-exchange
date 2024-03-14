import { useEffect } from 'react';
import { useInitUserTracking, useCookie3 } from './hooks';

export function UserTracking() {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return null;
}
