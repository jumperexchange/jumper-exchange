'use client';
import { cookie3Config } from '@/const/cookie3';
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { cookie3Analytics } from '@cookie3/analytics';
import type { PropsWithChildren } from 'react';
import { UserTracking } from 'src/UserTracking';
import { Cookie3Provider } from './Cookie3Provider';

export const TrackingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const analytics = cookie3Analytics(cookie3Config);

  return (
    <>
      <UserTracking />
      <ArcxAnalyticsProvider apiKey={process.env.NEXT_PUBLIC_ARCX_API_KEY}>
        <Cookie3Provider value={analytics}>{children}</Cookie3Provider>
      </ArcxAnalyticsProvider>
    </>
  );
};
