import App from '@/app/ui/app/App';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { OnRamper } from '@/components/OnRamper';
import { getCookies } from '@/app/lib/getCookies';

const Page = () => {
  const variant = 'buy';
  const { activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widgets
          activeTheme={activeTheme}
          closedWelcomeScreen={!!welcomeScreenClosed}
          widgetVariant={variant}
        />

        <OnRamper />
      </WidgetContainer>
    </App>
  );
};

export default Page;
