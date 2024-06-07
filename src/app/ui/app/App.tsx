'use client';

import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import type { StarterVariantType } from '@/types/internal';
import { WidgetContainer } from '@/components/Widgets';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { EventTrackingTool } from '@/types/userTracking';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking';

export interface AppProps {
  starterVariant: StarterVariantType;
  children: React.ReactNode;
  isWelcomeScreenClosed: boolean;
}

const App = ({ starterVariant, isWelcomeScreenClosed, children }: AppProps) => {
  const { trackEvent } = useUserTracking();

  const welcomeScreen = useWelcomeScreen(isWelcomeScreenClosed);

  const handleWelcomeScreenEnter = () => {
    if (!isWelcomeScreenClosed) {
      welcomeScreen.setWelcomeScreenClosed(true);
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_welcome_screen_on_widget-click',
        data: { widgetVariant: starterVariant },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
        enableAddressable: true,
      });
    }
  };

  return (
    <div onClick={handleWelcomeScreenEnter}>
      <WelcomeScreen closed={isWelcomeScreenClosed} />
      <WidgetContainer welcomeScreenClosed={isWelcomeScreenClosed}>
        {children}
      </WidgetContainer>
    </div>
  );
};

export default App;
