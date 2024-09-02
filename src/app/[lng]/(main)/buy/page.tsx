import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { OnRamper } from '@/components/OnRamper';
import { WidgetContainer, Widgets } from '@/components/Widgets';

const Page = () => {
  const variant = 'buy';
  const { welcomeScreenClosed, activeTheme } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App
      starterVariant={variant}
      isWelcomeScreenClosed={isWelcomeScreenClosed}
      activeTheme={activeTheme}
    >
      <WidgetContainer welcomeScreenClosed={isWelcomeScreenClosed}>
        <OnRamper
          isWelcomeScreenClosed={isWelcomeScreenClosed}
          activeTheme={activeTheme}
        />
        <Widgets
          closedWelcomeScreen={isWelcomeScreenClosed}
          widgetVariant={variant}
        />
      </WidgetContainer>
    </App>
  );
};

export default Page;
