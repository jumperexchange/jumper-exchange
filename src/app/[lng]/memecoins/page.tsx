import { getCookies } from '@/app/lib/getCookies';
import App from '@/app/ui/app/App';
import { Widgets } from '@/components/Widgets';
import { Widget } from '@/components/Widgets/Widget';
import { WidgetContainer } from 'src/components/Widgets/WidgetContainer';

const Page = () => {
  const variant = 'default';
  const { activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <App starterVariant={variant} isWelcomeScreenClosed={isWelcomeScreenClosed}>
      <WidgetContainer welcomeScreenClosed={true} widgetVariant={'default'}>
        <Widgets
          activeTheme={activeTheme}
          closedWelcomeScreen={isWelcomeScreenClosed}
          widgetVariant={variant}
        />

        <Widget starterVariant={variant} activeTheme={activeTheme} />
      </WidgetContainer>
    </App>
  );
};

export default Page;
