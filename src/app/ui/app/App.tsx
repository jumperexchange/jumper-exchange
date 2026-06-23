'use client';
import { sdk } from '@farcaster/miniapp-sdk';
import { Box } from '@mui/material';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { HeaderHeight } from 'src/const/headerHeight';
import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useMainPaths } from '@/hooks/useMainPaths';
import dynamic from 'next/dynamic';
import { AlertBannerWrapper } from './AlertBannerWrapper';

const AnnouncementBannerWrapper = dynamic(() =>
  import('./AnnouncementBannerWrapper').then(
    (mod) => mod.AnnouncementBannerWrapper,
  ),
);

const VerticalTabsWrapper = dynamic(() =>
  import('./VerticalTabsWrapper').then((mod) => mod.VerticalTabsWrapper),
);

export interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: { children: React.ReactNode }) => {
  const announcementBannersRef = useRef<HTMLDivElement>(null);
  const [announcementBannerHeight, setAnnouncementBannerHeight] = useState(0);

  const { welcomeScreenClosed, setWelcomeScreenClosed, enabled } =
    useWelcomeScreen();
  const { isMainPaths } = useMainPaths();

  useEffect(() => {
    const element = announcementBannersRef.current;
    if (!element || !welcomeScreenClosed || isMainPaths) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setAnnouncementBannerHeight(height);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      setAnnouncementBannerHeight(0);
    };
  }, [welcomeScreenClosed, isMainPaths]);

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <WelcomeOverlayLayout
      overlayContent={<WelcomeScreen />}
      isOverlayOpen={!welcomeScreenClosed}
      onOverlayClose={() => setWelcomeScreenClosed(true)}
      enabled={enabled}
      trackingConfig={{
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_welcome_screen_on_widget-click',
        enableAddressable: true,
      }}
      overlayClassName="welcome-screen-container"
      containerSx={{
        height: {
          xs: `calc(100dvh - ${HeaderHeight.XS}px)`,
          sm: `calc(100dvh - ${HeaderHeight.SM}px)`,
          md: `calc(100dvh - ${HeaderHeight.MD}px)`,
        },
      }}
      contentSx={
        isMainPaths && welcomeScreenClosed
          ? {
              height: '100%',
              minHeight: 0,
              overflow: 'auto',
            }
          : isMainPaths && !welcomeScreenClosed
            ? {
                overflow: 'visible',
              }
            : undefined
      }
      leftSideContent={
        welcomeScreenClosed &&
        !isMainPaths && (
          <VerticalTabsWrapper marginTop={announcementBannerHeight} />
        )
      }
      fullWidthGlowEffect={isMainPaths}
    >
      {welcomeScreenClosed && !isMainPaths && (
        <AnnouncementBannerWrapper ref={announcementBannersRef} />
      )}
      {children}
      <AlertBannerWrapper />
    </WelcomeOverlayLayout>
  );
};

export default App;
