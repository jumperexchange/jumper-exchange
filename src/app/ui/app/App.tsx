'use client';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { WidgetContainer } from '@/components/Widgets';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking';
import { Box, Slide } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import WidgetQuoteSSR from 'src/components/ImageGeneration/WidgetQuotesSSR';

export interface AppProps {
  activeTheme?: string;
}

const App = ({ activeTheme, children }: PropsWithChildren<AppProps>) => {
  const { trackEvent } = useUserTracking();

  const { welcomeScreenClosed, setWelcomeScreenClosed, enabled } =
    useWelcomeScreen(activeTheme);

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

  return (
    <Box onClick={handleWelcomeScreenEnter}>
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
            zIndex: 1000,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <WelcomeScreen />
        </Box>
      </Slide>
      <WidgetQuoteSSR width={0} height={0} />
      <WidgetContainer
        welcomeScreenClosed={!enabled || welcomeScreenClosed!}
        className="widget-container"
      >
        {children}
      </WidgetContainer>
    </Box>
  );
};

export default App;
