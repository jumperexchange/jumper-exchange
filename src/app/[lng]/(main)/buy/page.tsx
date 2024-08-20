import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { OnRamper } from '@/components/OnRamper';
import { WidgetContainer, Widgets } from '@/components/Widgets';

const Page = () => {
  const variant = 'buy';
  const { activeThemeMode, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <OnRamper />
        <Widgets
          closedWelcomeScreen={!!welcomeScreenClosed}
          widgetVariant={variant}
        />
      </WidgetContainer>
    </App>
  );
};

export default Page;
