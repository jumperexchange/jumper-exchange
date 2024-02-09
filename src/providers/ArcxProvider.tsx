'use client';
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import type { FC, PropsWithChildren } from 'react';

export const ArcxProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ArcxAnalyticsProvider apiKey={process.env.ARCX_API_KEY}>
      {children}
    </ArcxAnalyticsProvider>
  );
};
