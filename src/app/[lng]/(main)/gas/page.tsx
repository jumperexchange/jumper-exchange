import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { WidgetContainer, Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';

const Page = () => {
  const variant = 'refuel';
  const { activeThemeMode, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true}>
        <Widget starterVariant={variant} activeThemeMode={activeThemeMode} />
        <Widgets
          closedWelcomeScreen={!!welcomeScreenClosed}
          widgetVariant={variant}
        />
      </WidgetContainer>
    </App>
  );
};

export default Page;
