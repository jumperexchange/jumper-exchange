'use client';
import { useInitUserTracking } from '@/hooks/userTracking/useInitUserTracking';
import { useEffect } from 'react';
import GoogleAnalytics from './GoogleAnalytics';

const UserTracking = () => {
  const { initTracking } = useInitUserTracking();
  // todo: enable cookie3
  // const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    // cookie3?.trackPageView();
  }, [initTracking]);

  return (
    <>
      <GoogleAnalytics />
    </>
  );
};

export default UserTracking;
