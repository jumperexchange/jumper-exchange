'use client';

import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { WidgetContainer } from '@/components/Widgets';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking';
import type { StarterVariantType } from '@/types/internal';
import { Box, Slide, Stack } from '@mui/material';
import { VerticalTabs } from 'src/components/Menus/VerticalMenu';

export interface AppProps {
  starterVariant: StarterVariantType;
  children: React.ReactNode;
  isWelcomeScreenClosed: boolean;
  activeTheme?: string;
}

const App = ({
  starterVariant,
  isWelcomeScreenClosed,
  activeTheme,
  children,
}: AppProps) => {
  const { trackEvent } = useUserTracking();

  const { welcomeScreenClosed, setWelcomeScreenClosed, enabled } =
    useWelcomeScreen(isWelcomeScreenClosed, activeTheme);

  const handleWelcomeScreenEnter = () => {
    if (enabled && !welcomeScreenClosed) {
      setWelcomeScreenClosed(true);

      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_welcome_screen_on_widget-click',
        data: { widgetVariant: starterVariant },
        enableAddressable: true,
      });
    }
  };

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
          <WelcomeScreen closed={!enabled || welcomeScreenClosed!} />
        </Box>
      </Slide>
      <Stack
        display="flex"
        direction="row"
        justifyContent="center"
        alignItems="start"
        paddingTop={3.5}
      >
        {welcomeScreenClosed && <VerticalTabs />}
        <WidgetContainer
          welcomeScreenClosed={!enabled || welcomeScreenClosed!}
          className="widget-container"
        >
          {children}
        </WidgetContainer>
      </Stack>
    </Box>
  );
};

export default App;
