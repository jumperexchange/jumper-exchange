'use client';

import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { TrackingCategory, TrackingAction } from '@/const/trackingKeys';
import { HeaderHeight } from '@/const/headerHeight';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { NewsletterWelcomeScreen } from './NewsletterWelcomeScreen';
import { useAccount } from '@lifi/wallet-management';
import { useEffect } from 'react';
import type { FC, PropsWithChildren } from 'react';

export const NewsletterPageOverlayLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <WelcomeOverlayLayout
      overlayContent={<NewsletterWelcomeScreen />}
      isOverlayOpen={true}
      onOverlayClose={() => {}}
      enabled
      containerSx={{
        overflow: 'hidden',
        height: {
          xs: `calc(100dvh - ${HeaderHeight.XS}px)`,
          sm: `calc(100dvh - ${HeaderHeight.SM}px)`,
          md: `calc(100dvh - ${HeaderHeight.MD}px)`,
        },
      }}
      fullWidthGlowEffect
    >
      {children}
    </WelcomeOverlayLayout>
  );
};
