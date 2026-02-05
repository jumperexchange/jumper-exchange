'use client';
import { sdk } from '@farcaster/miniapp-sdk';
import { Box } from '@mui/material';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AnnouncementBanner } from 'src/components/AnnouncementBanner/AnnouncementBanner';
import { VerticalTabs } from 'src/components/Menus/VerticalMenu';
import { HeaderHeight } from 'src/const/headerHeight';
import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';

export interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: { children: React.ReactNode }) => {
  const announcementBannersRef = useRef<HTMLDivElement>(null);
  const [announcementBannerHeight, setAnnouncementBannerHeight] = useState(0);

  const { welcomeScreenClosed, setWelcomeScreenClosed, enabled } =
    useWelcomeScreen();

  useEffect(() => {
    const element = announcementBannersRef.current;
    if (!element || !welcomeScreenClosed) {
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
  }, [welcomeScreenClosed]);

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
      leftSideContent={
        welcomeScreenClosed && (
          <Box
            sx={{
              marginTop: `${announcementBannerHeight}px`,
              transition: 'margin-top 0.3s ease-in-out',
            }}
          >
            <VerticalTabs />
          </Box>
        )
      }
    >
      {welcomeScreenClosed && (
        <Box
          sx={{
            '& > :last-child': {
              marginBottom: `16px`,
            },
          }}
          ref={announcementBannersRef}
        >
          <AnnouncementBanner />
        </Box>
      )}
      {children}
    </WelcomeOverlayLayout>
  );
};

export default App;
