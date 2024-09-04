import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { OnRamper } from '@/components/OnRamper';
import { Widgets } from '@/components/Widgets';

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
      <OnRamper
        isWelcomeScreenClosed={isWelcomeScreenClosed}
        activeTheme={activeTheme}
      />
      <Widgets
        closedWelcomeScreen={isWelcomeScreenClosed}
        widgetVariant={variant}
      />
    </App>
  );
};

export default Page;
