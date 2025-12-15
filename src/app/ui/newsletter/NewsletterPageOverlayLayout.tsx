'use client';

import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { HeaderHeight } from '@/const/headerHeight';
import { NewsletterWelcomeScreen } from './NewsletterWelcomeScreen';
import type { FC, PropsWithChildren, ReactNode } from 'react';

interface NewsletterPageOverlayLayoutProps extends PropsWithChildren {
  overlayContent: ReactNode;
}

export const NewsletterPageOverlayLayout: FC<
  NewsletterPageOverlayLayoutProps
> = ({ children, overlayContent }) => {
  return (
    <WelcomeOverlayLayout
      overlayContent={overlayContent}
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
