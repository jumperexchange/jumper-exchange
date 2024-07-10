import App from '@/app/ui/app/App';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { getCookies } from '@/app/lib/getCookies';

const Page = () => {
  const variant = 'refuel';
  const { activeThemeMode, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widgets
          activeThemeMode={activeThemeMode}
          closedWelcomeScreen={!!welcomeScreenClosed}
          widgetVariant={variant}
        />
        <Widget starterVariant={variant} activeThemeMode={activeThemeMode} />
      </WidgetContainer>
    </App>
  );
};

export default Page;
