import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

const Page = () => {
  const variant = 'refuel';
  const { activeThemeMode, welcomeScreenClosed, activeTheme } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App
      starterVariant={variant}
      isWelcomeScreenClosed={isWelcomeScreenClosed}
      activeTheme={activeTheme}
    >
      <Widget
        starterVariant={variant}
        activeThemeMode={activeThemeMode}
        isWelcomeScreenClosed={isWelcomeScreenClosed}
      />
      <Widgets
        closedWelcomeScreen={isWelcomeScreenClosed}
        widgetVariant={variant}
      />
    </App>
  );
};

export default Page;
