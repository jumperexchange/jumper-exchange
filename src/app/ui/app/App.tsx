'use client';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { WidgetContainer } from '@/components/Widgets';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking';
import { Box, Slide, Stack } from '@mui/material';
import { VerticalTabs } from 'src/components/Menus/VerticalMenu';
import React, { useEffect, useRef, useState } from 'react';
import { AnnouncementBanner } from 'src/components/AnnouncementBanner/AnnouncementBanner';
import { HeaderHeight } from 'src/const/headerHeight';

export interface AppProps {
  children: React.ReactNode;
}

const App = ({ children }: { children: React.ReactNode }) => {
  const { trackEvent } = useUserTracking();
  const announcementBannersRef = useRef<HTMLDivElement>(null);
  const [announcementBannerHeight, setAnnouncementBannerHeight] = useState(0);

  const { welcomeScreenClosed, setWelcomeScreenClosed, enabled } =
    useWelcomeScreen();

  const handleWelcomeScreenEnter = () => {
    if (enabled && !welcomeScreenClosed) {
      setWelcomeScreenClosed(true);

      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_welcome_screen_on_widget-click',
        enableAddressable: true,
      });
    }
  };

  /**
   * We don't want to use Welcome Screen inside multisig envs
   */
  useEffect(() => {
    // in Multisig env, window.parent is not equal to window
    const anyWindow =
      typeof window !== 'undefined' ? (window as any) : undefined;
    const isIframeEnvironment = anyWindow && anyWindow.parent !== anyWindow;
    if (isIframeEnvironment) {
      setWelcomeScreenClosed(true);
    }
  }, [setWelcomeScreenClosed]);

  useEffect(() => {
    const element = announcementBannersRef.current;
    if (!element) {
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
  }, []);

  return (
    <Box
      onClick={handleWelcomeScreenEnter}
      sx={{
        height: {
          xs: `calc(100dvh - ${HeaderHeight.XS}px)`,
          sm: `calc(100dvh - ${HeaderHeight.SM}px)`,
          md: `calc(100dvh - ${HeaderHeight.MD}px)`,
        },
      }}
    >
      <Slide
        direction="up"
        in={enabled && !welcomeScreenClosed}
        appear={false}
        timeout={400}
        className="welcome-screen-container"
        mountOnEnter
        unmountOnExit
      >
        <Box
          style={{
            zIndex: 999,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <WelcomeScreen />
        </Box>
      </Slide>
      <Stack
        display="flex"
        direction="row"
        justifyContent="center"
        alignItems="start"
        paddingTop={3.5}
        sx={{
          height: welcomeScreenClosed ? '100%' : 'auto',
          overflow: {
            xs: welcomeScreenClosed ? 'scroll' : 'hidden',
            sm: 'inherit',
          },
          paddingTop: 3.5,
          paddingBottom: { xs: 11, md: 0 },
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
        }}
      >
        {welcomeScreenClosed && (
          <Box
            sx={{
              marginTop: `${announcementBannerHeight}px`,
            }}
          >
            <VerticalTabs />
          </Box>
        )}
        <WidgetContainer
          welcomeScreenClosed={!enabled || welcomeScreenClosed!}
          className="widget-container"
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
        </WidgetContainer>
      </Stack>
    </Box>
  );
};

export default App;
